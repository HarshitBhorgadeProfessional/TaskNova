import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Settings, MessageSquare, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <Briefcase size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Team Chat', path: '/chat', icon: <MessageSquare size={20} /> },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Users', path: '/users', icon: <Users size={20} /> });
  }

  return (
    <aside className="w-64 bg-slate-900 dark:bg-[#0b1120] text-slate-300 hidden md:flex flex-col border-r border-slate-800">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="TaskNova Logo" className="w-8 h-8 rounded-md shadow-lg border border-slate-800" />
          <h1 className="text-lg font-bold text-white tracking-wide">
            Task<span className="font-light text-primary-400">Nova</span>
          </h1>
        </div>
      </div>
      
      <div className="px-4 py-6 flex-1 space-y-8">
        <div>
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors group ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-primary-600/10 rounded-lg border border-primary-500/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                    <span className="relative z-10 font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
