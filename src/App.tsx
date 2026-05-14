import { useState } from 'react';
import Landing from './pages/Landing';
import Submit from './pages/Submit';
import Admin from './pages/Admin';
import { Microscope, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Page = 'landing' | 'submit' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-200">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo('landing')}>
              <span className="ml-2 text-xl font-display font-bold text-slate-900 tracking-tight">TJStar</span>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <button
                onClick={() => navigateTo('landing')}
                className={`text-sm font-medium transition-colors ${currentPage === 'landing' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('submit')}
                className={`text-sm font-medium transition-colors ${currentPage === 'submit' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Submit Project
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className={`text-sm font-medium transition-colors ${currentPage === 'admin' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Admin Review
              </button>
              
              <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm">
                Sign In
              </button>
            </div>

            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white">
            <div className="pt-2 pb-3 space-y-1">
              <button
                onClick={() => navigateTo('landing')}
                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${currentPage === 'landing' ? 'bg-blue-50 border-blue-700 text-blue-700' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'}`}
              >
                Home
              </button>
              <button
                onClick={() => navigateTo('submit')}
                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${currentPage === 'submit' ? 'bg-blue-50 border-blue-700 text-blue-700' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'}`}
              >
                Submit Project
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${currentPage === 'admin' ? 'bg-blue-50 border-blue-700 text-blue-700' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'}`}
              >
                Admin Review
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex-1 h-full w-full">
              <Landing onNavigate={navigateTo} />
            </motion.div>
          )}
          {currentPage === 'submit' && (
            <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex-1 h-full w-full">
              <Submit />
            </motion.div>
          )}
          {currentPage === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex-1 h-full w-full bg-slate-50">
              <Admin />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-400 text-sm mt-auto z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Thomas Jefferson High School for Science and Technology.</p>
          <p className="mt-2 text-slate-500">Made by Shaun Saladi, Uzair Nasir, and Adhiraj Chhoda</p>
        </div>
      </footer>
    </div>
  );
}
