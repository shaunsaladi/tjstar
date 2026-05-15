import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Submit from './pages/Submit';
import Admin from './pages/Admin';
import { Microscope, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Page = 'landing' | 'submit' | 'admin';

interface UserProfile {
  ion_username: string;
  full_name: string;
  email: string;
  picture: string;
  is_student: boolean; // Dynamic boolean flag received from Flask session mapping
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Auth check failed");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const navigateTo = (page: Page) => {
    // 1. Guard route: If not signed in, deny access to submit and admin screens
    if (!user && (page === 'submit' || page === 'admin')) {
      setCurrentPage('landing');
      return;
    }
    // 2. Guard route: If signed in but user is a student, deny access to admin screen
    if (user && page === 'admin' && user.is_student) {
      setCurrentPage('landing');
      return;
    }
    
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/login';
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/logout', {
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        navigateTo('landing');
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
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
              <button onClick={() => navigateTo('landing')} className={`text-sm font-medium ${currentPage === 'landing' ? 'text-blue-700' : 'text-slate-600'}`}>Home</button>
              
              {/* Conditional rendering for navigation items */}
              {user && user.is_student && (
                <button onClick={() => navigateTo('submit')} className={`text-sm font-medium ${currentPage === 'submit' ? 'text-blue-700' : 'text-slate-600'}`}>Submit Project</button>
              )}
              
              {user && !user.is_student && (
                <button onClick={() => navigateTo('admin')} className={`text-sm font-medium ${currentPage === 'admin' ? 'text-blue-700' : 'text-slate-600'}`}>Admin Review</button>
              )}
              
              {isLoading ? (
                <div className="h-8 w-8 bg-slate-100 rounded-full animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 leading-none">{user.full_name}</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">{user.ion_username}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 overflow-hidden">
                    {user.picture ? (
                      <img src={user.picture} alt={user.full_name} className="h-8 w-8 object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-md transition-colors" title="Log Out">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 transition-colors">
                  Sign In
                </button>
              )}
            </div>

            <div className="flex items-center sm:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 hover:text-slate-700 focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu block */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white">
            <div className="pt-2 pb-3 space-y-1">
              <button onClick={() => navigateTo('landing')} className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${currentPage === 'landing' ? 'bg-blue-50 border-blue-700 text-blue-700' : 'border-transparent text-slate-600'}`}>Home</button>
              
              {user && user.is_student && (
                <button onClick={() => navigateTo('submit')} className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${currentPage === 'submit' ? 'bg-blue-50 border-blue-700 text-blue-700' : 'border-transparent text-slate-600'}`}>Submit Project</button>
              )}
              
              {user && !user.is_student && (
                <button onClick={() => navigateTo('admin')} className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium ${currentPage === 'admin' ? 'bg-blue-50 border-blue-700 text-blue-700' : 'border-transparent text-slate-600'}`}>Admin Review</button>
              )}
              
              <div className="pt-4 pb-2 border-t border-slate-200 px-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 overflow-hidden">
                        {user.picture ? <img src={user.picture} alt={user.full_name} className="h-10 w-10 object-cover" /> : <UserIcon size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{user.full_name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                ) : (
                  <button onClick={handleLogin} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 h-full w-full">
              <Landing onNavigate={navigateTo} />
            </motion.div>
          )}
          {currentPage === 'submit' && user && user.is_student && <Submit />}
          {currentPage === 'admin' && user && !user.is_student && <Admin />}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-900 py-8 text-center text-slate-400 text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Thomas Jefferson High School for Science and Technology.</p>
          <p className="mt-2 text-slate-500">Made by Shaun Saladi, Uzair Nasir, and Adhiraj Chhoda</p>
        </div>
      </footer>
    </div>
  );
}