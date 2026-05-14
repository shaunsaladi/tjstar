import { UploadCloud, ChevronRight } from 'lucide-react';

export default function Submit() {
  return (
    <div className="bg-slate-50 py-10 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex items-center text-sm font-medium text-slate-500 mb-2">
            Home <ChevronRight className="w-4 h-4 mx-1" /> Submissions
          </div>

          <h1 className="text-3xl font-display font-bold text-slate-900">
            Project Submission
          </h1>

          <p className="text-slate-600 mt-2">
            Submit your senior research project details securely. All
            information will be reviewed by lab directors before publication.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <form
              className="space-y-8"
              onSubmit={(e) => e.preventDefault()}
            >
              
              {/* Information Section */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
                  Information about the lab
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Project Title
                    </label>

                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="e.g. Convolutional Neural Networks for Early Detection..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Author(s)
                    </label>

                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                      placeholder="Separate multiple names with commas"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Research Lab / Mentorship
                      </label>

                      <select className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option>Select a lab...</option>
                        <option>Artificial Intelligence Lab</option>
                        <option>Neuroscience Lab</option>
                        <option>Computer Systems Lab</option>
                        <option>External Mentorship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Format
                      </label>

                      <select className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option>Full Presentation (20 min)</option>
                      </select>
                    </div>
                  </div>

                  {/* Food */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Food
                    </label>

                    <select className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                      <option>Chipotle (I wish)</option>
                      <option>Panera Bread</option>
                      <option>Noodles and Company</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Abstract Section */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
                  Abstract & Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Abstract
                  </label>

                  <p className="text-xs text-slate-500 mb-2">
                    Maximum 250 words. This will be printed in the symposium
                    program.
                  </p>

                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                    placeholder="Enter your abstract here..."
                  />
                </div>
              </div>

              {/* Upload Section */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
                  Upload Artifacts
                </h2>

                <div className="mt-2 flex justify-center px-6 pt-10 pb-12 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 relative group hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <div className="space-y-2 text-center flex flex-col items-center">
                    
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" />

                    <div className="flex text-sm text-slate-600">
                      <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        Upload a file
                      </span>

                      <p className="pl-1">or drag and drop</p>
                    </div>

                    <p className="text-xs text-slate-500">
                      PDF, PPTX, image files up to 50MB
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer Buttons */}
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3">
            
            <button className="px-5 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              Save Draft
            </button>

            <button className="px-5 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
              Submit Final Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}