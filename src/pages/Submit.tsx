import { useState, useEffect, useRef } from 'react';
import { UploadCloud, ChevronRight, File, X, AlertCircle } from 'lucide-react';

export default function Submit() {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [lab, setLab] = useState('');
  const [format, setFormat] = useState('Full Presentation (20 min)');
  const [food, setFood] = useState('Panera Bread');
  const [abstract, setAbstract] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState<string | null>(null);

  // Automatically load existing draft or submission when the component mounts
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/project/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title || '');
          setAuthors(data.authors || '');
          setLab(data.lab || '');
          setFormat(data.format || 'Full Presentation (20 min)');
          setFood(data.food || 'Panera Bread');
          setAbstract(data.abstract || '');
          setCurrentStatus(data.status);
          setReviewNote(data.review_note || null);
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    };
    loadDraft();
  }, []);

  const onUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files;
      if (selectedFile.size > 50 * 1024 * 1024) {
        setStatusMessage({ type: 'error', text: 'File sizes must not exceed 50MB limits.' });
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveProject = async (isDraft: boolean) => {
    setStatusMessage(null);

    // Enforce validation constraints only on final submissions
    if (!isDraft) {
      if (!title.trim() || !authors.trim() || !abstract.trim() || !lab || lab === 'Select a lab...') {
        setStatusMessage({ type: 'error', text: 'Please fill out all mandatory fields before final submission.' });
        return;
      }
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('authors', authors);
    formData.append('lab', lab);
    formData.append('format', format);
    formData.append('food', food);
    formData.append('abstract', abstract);
    formData.append('status', isDraft ? 'Draft' : 'Pending Review');
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:8000/api/submit', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentStatus(data.status);
        setStatusMessage({
          type: 'success',
          text: isDraft 
            ? 'Draft progress saved successfully.' 
            : `Project submitted final! Assigned Reference ID: PRJ-${data.project_id + 100}`,
        });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Server rejected the database transaction.' });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatusMessage({ type: 'error', text: 'Network connection failure. Verify Flask status.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 py-10 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            Home <ChevronRight className="w-4 h-4 mx-1" /> Submissions
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Project Submission</h1>
          
          {/* Dynamic Status Badges Display */}
          {currentStatus && (
            <div className="mt-2 flex flex-col gap-2">
              <span className={`inline-flex w-max items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                currentStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                currentStatus === 'Denied' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                currentStatus === 'Revisions Requested' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                Current Status: {currentStatus}
              </span>
            </div>
          )}

          {/* Render Teacher Notes if corrections are requested */}
          {currentStatus === 'Revisions Requested' && (
            <div className="mt-4 p-4 border border-amber-200 bg-amber-50 text-amber-900 rounded-xl text-sm shadow-sm">
              <p className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle size={16} /> Revisions Requested by Lab Director:
              </p>
              <p className="mt-2 text-slate-700 bg-white border border-amber-100 p-3 rounded-lg font-medium whitespace-pre-line shadow-inner italic">
                {reviewNote || "No text comments provided. Please coordinate updates directly with your research mentor."}
              </p>
            </div>
          )}
        </div>

        {statusMessage && (
          <div className={`mb-6 p-4 rounded-md border text-sm font-medium ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">Information about the lab</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Convolutional Neural Networks..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Author(s)</label>
                    <input
                      type="text"
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Separate names with commas"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Research Lab / Mentorship</label>
                      <select 
                        value={lab}
                        onChange={(e) => setLab(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Select a lab...</option>
                        <option>Artificial Intelligence Lab</option>
                        <option>Neuroscience Lab</option>
                        <option>Computer Systems Lab</option>
                        <option>External Mentorship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                      <select 
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      >
                        <option>Full Presentation (20 min)</option>
                        <option>Poster Session</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Catering Request</label>
                    <select 
                      value={food}
                      onChange={(e) => setFood(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                      disabled={isSubmitting}
                    >
                      <option>Chipotle (I wish)</option>
                      <option>Panera Bread</option>
                      <option>Noodles and Company</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">Abstract & Details</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Abstract</label>
                  <p className="text-xs text-slate-500 mb-2">Maximum 250 words. This will be printed in the symposium program.</p>
                  <textarea
                    rows={6}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm bg-white resize-none text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your abstract here..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">Upload Artifacts</h2>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.pptx,image/*" />
                <div onClick={onUploadAreaClick} className="mt-2 flex justify-center px-6 pt-10 pb-12 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 relative group hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <div className="space-y-2 text-center flex flex-col items-center">
                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="p-3 bg-blue-100 text-blue-700 rounded-full mb-2"><File className="h-8 w-8" /></div>
                        <p className="text-sm font-medium text-slate-800 max-w-xs truncate">{file.name}</p>
                        <button onClick={removeFile} className="mt-3 px-2.5 py-1 text-xs font-medium border border-slate-200 text-slate-600 bg-white rounded hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm">Remove File</button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <div className="flex text-sm text-slate-600"><span className="relative rounded-md font-medium text-blue-600">Upload a file</span><p className="pl-1">or drag and drop</p></div>
                        <p className="text-xs text-slate-500">PDF, PPTX, image files up to 50MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3">
            <button 
              onClick={() => saveProject(true)} 
              disabled={isSubmitting}
              className="px-5 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button 
              onClick={() => saveProject(false)} 
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Final Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}