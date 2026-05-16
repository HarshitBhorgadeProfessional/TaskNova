import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Search, User as UserIcon, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/axios';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ tasks: [], projects: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const notifRef = useRef(null);
  const searchRef = useRef(null);



  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const [tasksRes, projectsRes] = await Promise.all([
            api.get('/api/tasks'),
            api.get('/api/projects')
          ]);
          
          const filteredTasks = tasksRes.data.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
          const filteredProjects = projectsRes.data.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
          
          setSearchResults({ tasks: filteredTasks, projects: filteredProjects });
          setShowSearch(true);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearch(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="glass-panel h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">
      <div className="flex-1 flex items-center">
        {/* Global Search */}
        <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery.length > 1) setShowSearch(true); }}
            placeholder="Search projects, tasks..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all dark:text-slate-200"
          />
          
          <AnimatePresence>
            {showSearch && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 w-full bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-xl shadow-xl overflow-hidden z-50"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.tasks.length === 0 && searchResults.projects.length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-500">No results found</div>
                    )}
                    
                    {searchResults.projects.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Projects</div>
                        {searchResults.projects.map(p => (
                          <a href="/projects" key={p._id} className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#27272a] rounded-lg transition-colors">
                            {p.title}
                          </a>
                        ))}
                      </div>
                    )}

                    {searchResults.tasks.length > 0 && (
                      <div className="p-2 border-t border-slate-100 dark:border-[#27272a]">
                        <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase">Tasks</div>
                        {searchResults.tasks.map(t => (
                          <a href="/tasks" key={t._id} className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#27272a] rounded-lg transition-colors">
                            <span className="font-medium text-slate-900 dark:text-white mr-2">{t.title}</span>
                            <span className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-[#111113] rounded text-slate-500">{t.status}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-5 ml-auto">
        <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={notifRef}>
          <NotificationDropdown />
        </div>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg py-1 border border-slate-100 dark:border-slate-700"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2">
                  <UserIcon size={16} /> <span>Profile</span>
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <LogOut size={16} /> <span>Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
