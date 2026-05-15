import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Download, MessageSquare } from 'lucide-react';

interface ProjectData {
  id: number;
  display_id: string;
  title: string;
  authors: string;
  lab: string;
  format: string;
  food: string;
  abstract: string;
  status: string;
  artifact_path: string | null;
  review_note: string | null;
}

export default function Admin() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tracks the comment textarea values individually by project database row ID
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/projects', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        
        // Pre-fill our feedback note state cache with items loaded out of the database row
        const initialNotes: Record<number, string> = {};
        data.forEach((proj: ProjectData) => {
          initialNotes[proj.id] = proj.review_note || '';
        });
        setReviewNotes(initialNotes);
      } else {
        setError('Failed to fetch project listings. Verify administrative credentials.');
      }
    } catch (err) {
      setError('Network connection error targeting backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleReviewAction = async (projectId: number, nextStatus: 'Approved' | 'Denied' | 'Revisions Requested') => {
    setSubmittingId(projectId);
    try {
      const response = await fetch(`http://localhost:8000/api/admin/projects/${projectId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          review_note: reviewNotes[projectId] || '',
        }),
        credentials: 'include',
      });

      if (response.ok) {
        // Refresh local view data mapping matrix seamlessly on validation
        await fetchProjects();
      } else {
        alert('Database execution rejected administrative action.');
      }
    } catch (err) {
      alert('Communication failure handling submission review routing processing.');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleNoteChange = (projectId: number, value: string) => {
    setReviewNotes(prev => ({ ...prev, [projectId]: value }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-500 animate-pulse font-medium">Loading Symposium Submission Registry Matrix...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Faculty Review Dashboard</h1>
        <p className="text-slate-600 mt-2">Evaluate research document details, download digital artifact files, and process symposium approvals.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          No senior project submissions have been uploaded to the registry engine yet.
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                
                {/* Header Information Matrix Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md tracking-wider uppercase">
                      {project.display_id}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{project.title}</h2>
                    <p className="text-sm font-medium text-slate-600 mt-1">Authors: <span className="text-slate-800">{project.authors}</span></p>
                  </div>

                  {/* Status Badges conditional styling mapping blocks */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      project.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      project.status === 'Denied' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      project.status === 'Revisions Requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {project.status === 'Approved' && <CheckCircle size={14} />}
                      {project.status === 'Denied' && <XCircle size={14} />}
                      {project.status === 'Revisions Requested' && <AlertCircle size={14} />}
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Technical Configuration Specifics Grid Blocks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl text-sm mb-6">
                  <div><p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Research Lab</p><p className="font-semibold text-slate-800 mt-0.5">{project.lab}</p></div>
                  <div><p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Session Format</p><p className="font-semibold text-slate-800 mt-0.5">{project.format}</p></div>
                  <div><p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Catering Target</p><p className="font-semibold text-slate-800 mt-0.5">{project.food}</p></div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Artifact File</p>
                    {project.artifact_path ? (
                      <a href={`http://localhost:8000/uploads/${project.artifact_path}`} download className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors mt-1">
                        <Download size={12} /> Download Asset
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-0.5">No File Provided</p>
                    )}
                  </div>
                </div>

                {/* Abstract Text block Section */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Abstract</h3>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{project.abstract}</p>
                </div>

                {/* Form Processing Controls & Commentary Interface Container */}
                <div className="border-t border-slate-100 pt-6 mt-6 bg-slate-50/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 w-full">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <MessageSquare size={14} /> Review Note / Revision Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNotes[project.id] || ''}
                      onChange={(e) => handleNoteChange(project.id, e.target.value)}
                      placeholder="Add guidance notes, rejection reasons, or required corrections here..."
                      className="w-full text-sm px-4 py-2 border border-slate-300 rounded-lg shadow-sm bg-white resize-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      disabled={submittingId === project.id}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleReviewAction(project.id, 'Revisions Requested')}
                      disabled={submittingId === project.id}
                      className="px-4 py-2 border border-amber-300 text-amber-700 bg-white hover:bg-amber-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Request Revisions
                    </button>
                    <button
                      onClick={() => handleReviewAction(project.id, 'Denied')}
                      disabled={submittingId === project.id}
                      className="px-4 py-2 border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => handleReviewAction(project.id, 'Approved')}
                      disabled={submittingId === project.id}
                      className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}