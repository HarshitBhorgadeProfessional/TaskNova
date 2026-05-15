import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Settings, MessageSquare, Users, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/axios';
import socket from '../lib/socket';
import SettingsModal from './SettingsModal';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchTeam = async () => {
      try {
        const res = await api.get('/api/users');
        setTeamMembers(res.data.filter(u => u._id !== user._id));
      } catch (err) {
        console.error('Failed to fetch team members', err);
      }
    };
    fetchTeam();

    socket.connect();

    const registerUser = () => {
      socket.emit('userOnline', user._id);
      socket.emit('getOnlineUsers');
    };

    if (socket.connected) {
      registerUser();
    }
    
    socket.on('connect', registerUser);

    const handleOnlineUsers = (users) => setOnlineUsers(users);
    socket.on('onlineUsersList', handleOnlineUsers);

    return () => {
      socket.off('connect', registerUser);
      socket.off('onlineUsersList', handleOnlineUsers);
    };
  }, [user]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} className="text-indigo-400" /> },
    { name: 'Projects', path: '/projects', icon: <Briefcase size={20} className="text-amber-400" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} className="text-emerald-400" /> },
    { name: 'Team Chat', path: '/chat', icon: <MessageSquare size={20} className="text-pink-400" /> },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Users', path: '/users', icon: <Users size={20} className="text-blue-400" /> });
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
      
      <div className="px-4 py-6 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
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

        <div>
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Team Online</p>
          <div className="space-y-1 px-2">
            {teamMembers.length === 0 ? (
              <p className="px-2 text-xs text-slate-500 italic">No team members found.</p>
            ) : (
              teamMembers.map(member => {
                const isOnline = onlineUsers.includes(member._id);
                return (
                  <motion.div 
                    key={member._id}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                    className="flex items-center space-x-3 px-2 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-slate-900 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-300 truncate">{member.name}</p>
                      {member.role === 'Admin' && <p className="text-[10px] text-primary-400">Admin</p>}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
};

export default Sidebar;
