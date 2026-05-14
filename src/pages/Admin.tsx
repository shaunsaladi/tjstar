import { Search, Filter, MoreHorizontal, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

const mockProjects = [
  { id: 'PRJ-101', title: 'Attention Patterns in Transformer Models for NLP', authors: 'Shaun Saladi, Uzair Nasir, Adhiraj Chhoda', lab: 'Computer Systems', status: 'Approved', format: 'Presentation' },
  { id: 'PRJ-102', title: 'Novel Synthesis of Biodegradable Polymers', authors: 'Sarah Jenkins', lab: 'Chemistry', status: 'Pending Review', format: 'Poster' },
  { id: 'PRJ-103', title: 'Behavioral Responses of Drosophila to Light Stimuli', authors: 'Michael Zhu', lab: 'Neuroscience', status: 'Revisions Requested', format: 'Presentation' },
  { id: 'PRJ-104', title: 'Optimizing Wind Turbine Blade Aerodynamics', authors: 'David Kim', lab: 'Prototyping', status: 'Approved', format: 'Presentation' },
  { id: 'PRJ-105', title: 'Exoplanet Transit Analysis Using Deep Learning', authors: 'Amanda Ray', lab: 'Astronomy', status: 'Pending Review', format: 'Presentation' },
];

export default function Admin() {
  return (
    <div className="min-h-full py-8 w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">Faculty Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Manage, review, and approve senior research projects.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm flex items-center gap-2">
              <FileText className="w-4 h-4" /> Export CSV
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
              Publish Schedule
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Submissions', value: '284', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Pending Review', value: '42', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
            { label: 'Approved', value: '235', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
            { label: 'Revisions Needed', value: '7', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search projects, authors, or ID..."
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
              <Filter className="h-4 w-4 text-slate-500" /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Lab / Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Format</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {mockProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 border-b border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 group flex items-center">
                          {project.title}
                        </span>
                        <span className="text-sm text-slate-500 flex items-center mt-1">
                          {project.id} <span className="mx-1.5 inline-block w-1 h-1 rounded-full bg-slate-300"></span> {project.authors}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-slate-100">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {project.lab}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 border-b border-slate-100">
                      {project.format}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-b border-slate-100">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                        project.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        project.status === 'Pending Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {project.status === 'Approved' && <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                        {project.status === 'Pending Review' && <Clock className="w-3 h-3 mr-1.5" />}
                        {project.status === 'Revisions Requested' && <XCircle className="w-3 h-3 mr-1.5" />}
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-b border-slate-100">
                      <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">Showing <span className="font-medium text-slate-700">1</span> to <span className="font-medium text-slate-700">5</span> of <span className="font-medium text-slate-700">284</span> results</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border border-slate-200 rounded text-sm disabled:opacity-50 disabled:bg-slate-100">Previous</button>
              <button className="px-3 py-1 border border-slate-300 rounded text-sm bg-white hover:bg-slate-50 text-slate-700 font-medium">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
