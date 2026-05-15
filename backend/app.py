import os
from flask import Flask, redirect, url_for, session, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from requests_oauthlib import OAuth2Session
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# AUTHENTICATION & SESSION COOKIE CONFIGURATION
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "tjstar_local_dev_secret_key_string")

app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',      # Allows cookie sharing across local ports 3000 and 8000
    SESSION_COOKIE_HTTPONLY=True,      # Restricts client-side scripting access to session cookie
    SESSION_COOKIE_SECURE=False        # Permits cookies over insecure HTTP during local development
)

# FILE UPLOAD INFRASTRUCTURE SETUP
UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# SQLALCHEMY DATABASE ENGINE CONFIGURATION
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tjstar.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Permit session cookie exchange from the React server on port 3000
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# ION AUTHENTICATION REGISTRATION VARIABLES
CLIENT_ID = os.environ.get("ION_CLIENT_ID")
CLIENT_SECRET = os.environ.get("ION_CLIENT_SECRET")
REDIRECT_URI = os.environ.get("ION_REDIRECT_URI")

AUTHORIZATION_BASE_URL = "https://ion.tjhsst.edu/oauth/authorize/"
TOKEN_URL = "https://ion.tjhsst.edu/oauth/token/"
PROFILE_URL = "https://ion.tjhsst.edu/api/profile"

# Bypass default OAuth HTTPS enforcement for local environment sessions
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


# RELATIONAL SQL DATABASE SCHEMAS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ion_username = db.Column(db.String(80), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_student = db.Column(db.Boolean, default=True)
    projects = db.relationship('Project', backref='author_user', lazy=True)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    authors = db.Column(db.String(255), nullable=False)
    lab = db.Column(db.String(120), nullable=False)
    format = db.Column(db.String(120), nullable=False)
    food = db.Column(db.String(120), nullable=False)
    abstract = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Pending Review') # Draft, Pending Review, Approved, Denied, Revisions Requested
    artifact_path = db.Column(db.String(255), nullable=True)
    review_note = db.Column(db.Text, nullable=True) # Stores faculty feedback commentary
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        """Converts raw database row contents into formatted JSON for frontend rendering."""
        return {
            "id": self.id,
            "display_id": f"PRJ-{self.id + 100}",
            "title": self.title,
            "authors": self.authors,
            "lab": self.lab,
            "format": self.format,
            "food": self.food,
            "abstract": self.abstract,
            "status": self.status,
            "artifact_path": self.artifact_path,
            "review_note": self.review_note
        }


# AUTHENTICATION & INTERFACE ENDPOINTS
@app.route("/api/auth/login")
def login():
    """Step 1: Instantiates OAuth session tracking context and redirects to Ion."""
    ion = OAuth2Session(CLIENT_ID, redirect_uri=REDIRECT_URI, scope=["read"])
    authorization_url, state = ion.authorization_url(AUTHORIZATION_BASE_URL)
    session['oauth_state'] = state
    return redirect(authorization_url)

@app.route("/api/auth/callback")
def callback():
    """Step 2: Collects access keys, upserts unique identity records, establishes system session."""
    ion = OAuth2Session(CLIENT_ID, state=session.get('oauth_state'), redirect_uri=REDIRECT_URI)
    token = ion.fetch_token(TOKEN_URL, client_secret=CLIENT_SECRET, authorization_response=request.url)
    
    profile_response = ion.get(PROFILE_URL)
    profile_data = profile_response.json()
    
    ion_username = profile_data.get('ion_username')
    
    user = User.query.filter_by(ion_username=ion_username).first()
    if not user:
        user = User(
            ion_username=ion_username,
            full_name=profile_data.get('display_name'),
            email=profile_data.get('tj_email'),
            is_student=profile_data.get('is_student', True)
        )
        db.session.add(user)
        db.session.commit()

    session['user_id'] = user.id
    session['user'] = {
        'ion_username': user.ion_username,
        'email': user.email,
        'full_name': user.full_name,
        'picture': profile_data.get('picture'),
        'is_student': user.is_student
    }
    session['oauth_token'] = token
    
    return redirect("http://localhost:3000/")

@app.route("/api/me")
def get_profile():
    """Session verification check endpoint invoked by React app lifecycle mounts."""
    user = session.get('user')
    if user:
        return jsonify(user)
    return jsonify({"error": "Unauthorized"}), 401


# SYMPOSIUM SUBMISSION PIPELINE ENDPOINTS
@app.route("/api/project/me", methods=["GET"])
def get_my_project():
    """Fetches any pre-existing submission or draft progress mapped to the logged-in student user."""
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    project = Project.query.filter_by(user_id=session['user_id']).first()
    if project:
        return jsonify(project.to_dict())
    return jsonify({"message": "No active projects found"}), 404

@app.route("/api/submit", methods=["POST"])
def submit_project():
    """Processes incoming multipart FormData packets for both incremental saving and final submission."""
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
        
    title = request.form.get('title', '')
    authors = request.form.get('authors', '')
    lab = request.form.get('lab', '')
    format = request.form.get('format', '')
    food = request.form.get('food', '')
    abstract = request.form.get('abstract', '')
    status = request.form.get('status', 'Pending Review')
    
    if status == 'Pending Review':
        if not title.strip() or not authors.strip() or not abstract.strip() or not lab or lab == 'Select a lab...':
            return jsonify({"error": "Missing mandatory field records for final submission approval."}), 400
            
    uploaded_file = request.files.get('file')
    project = Project.query.filter_by(user_id=session['user_id']).first()
    
    saved_filename = project.artifact_path if project else None
    if uploaded_file and uploaded_file.filename != '':
        filename = secure_filename(uploaded_file.filename)
        saved_filename = f"user_{session['user_id']}_{filename}"
        file_dest_path = os.path.join(app.config['UPLOAD_FOLDER'], saved_filename)
        uploaded_file.save(file_dest_path)
        
    try:
        if project:
            project.title = title
            project.authors = authors
            project.lab = lab
            project.format = format
            project.food = food
            project.abstract = abstract
            project.status = status
            if saved_filename:
                project.artifact_path = saved_filename
        else:
            project = Project(
                title=title,
                authors=authors,
                lab=lab,
                format=format,
                food=food,
                abstract=abstract,
                status=status,
                artifact_path=saved_filename,
                user_id=session['user_id']
            )
            db.session.add(project)
            
        db.session.commit()
        return jsonify({"success": True, "project_id": project.id, "status": project.status}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ADMINISTRATOR OPERATIONS ENDPOINTS
@app.route("/api/admin/projects", methods=["GET"])
def get_admin_projects():
    """Fetches all records registered in the project table. Role-guarded to non-student accounts only."""
    if 'user' not in session or session['user'].get('is_student') == True:
        return jsonify({"error": "Forbidden: Faculty administrative level authorization required."}), 403
        
    projects = Project.query.all()
    return jsonify([project.to_dict() for project in projects])

@app.route("/api/admin/projects/<int:project_id>/review", methods=["POST"])
def review_project(project_id):
    """Processes approvals, rejections, and review comments added by faculty reviewers."""
    if 'user' not in session or session['user'].get('is_student') == True:
        return jsonify({"error": "Forbidden: Administrative access required."}), 403
        
    data = request.json
    status = data.get('status')
    review_note = data.get('review_note', '')

    if status not in ['Approved', 'Denied', 'Revisions Requested']:
        return jsonify({"error": "Invalid administrative status value configuration."}), 400

    project = Project.query.get_or_404(project_id)
    project.status = status
    project.review_note = review_note

    try:
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/logout")
def logout():
    """Wipes current server tracking scopes and invalidates client session headers."""
    session.clear()
    return jsonify({"success": True}), 200


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(port=8000, debug=True)