import { ArrowRight, BookOpen, MapPin, Users } from 'lucide-react';

export default function Landing({ onNavigate }: { onNavigate: (page: 'landing' | 'submit' | 'admin') => void }) {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-slate-300 bg-white text-slate-700 text-sm font-medium mb-8">
            May 14, 2026 • 8:00 AM - 3:00 PM
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-slate-900 mb-6">
            Thomas Jefferson Symposium<br/>
            to Advance Research
          </h1>
          
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            TJHSST's annual research symposium showcasing the innovative work of our senior research students across a wide range of fields. Join us for a day of discovery, inspiration, and some food!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('submit')}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              Submit Research <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium transition-colors flex items-center justify-center"
            >
              View Schedule
            </button>
          </div>
        </div>
      </section>

      {/* Stats/About */}
      

      {/* Featured Labs / Disciplines */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-8">Fields of Research</h2>
          
          <ul className="space-y-4">
            {[
              { title: 'Artificial Intelligence', desc: 'Exploring deep learning, neural networks, and applications of modern AI.' },
              { title: 'Neuroscience', desc: 'Investigating neuroplasticity, cognitive behaviors, and neurological structures.' },
              { title: 'Quantum Physics', desc: 'Research into quantum entanglement, computing paradigms, and state simulations.' },
              { title: 'Biotechnology', desc: 'Applying technological methods to biological systems for novel solutions.' },
              { title: 'Aerospace Engineering', desc: 'Fluid dynamics, propulsion systems, and aerodynamic structures.' }
            ].map((lab) => (
              <li key={lab.title} className="flex flex-col sm:flex-row sm:items-baseline gap-2 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <span className="font-semibold text-slate-900 w-48 shrink-0">{lab.title}</span>
                <span className="text-slate-600 text-sm">{lab.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
