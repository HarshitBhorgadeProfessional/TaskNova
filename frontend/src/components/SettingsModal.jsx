import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Bell, Shield, LogOut, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState('');

  // Preferences State
  const [preferences, setPreferences] = useState({
    taskAssigned: true,
    deadlineReminders: true,
    projectUpdates: true,
  });
  const [prefMsg, setPrefMsg] = useState('');

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.preferences) setPreferences(user.preferences);
  }, [user]);

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/api/auth/profile', { name });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg('Failed to update profile.');
      setTimeout(() => setProfileMsg(''), 3000);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/auth/password', { currentPassword, newPassword });
      setSecurityMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSecurityMsg(''), 3000);
    } catch (err) {
      setSecurityMsg(err.response?.data?.message || 'Failed to change password.');
      setTimeout(() => setSecurityMsg(''), 3000);
    }
  };

  const togglePreference = async (key) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    try {
      await api.put('/api/auth/preferences', newPrefs);
      // Dispatch or just show toast
      setPrefMsg('Preferences saved.');
      setTimeout(() => setPrefMsg(''), 2000);
    } catch (err) {
      setPrefMsg('Failed to save preference.');
      setTimeout(() => setPrefMsg(''), 2000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <UserIcon size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {/* Tabs */}
            <div className="flex space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Personal Information</h3>
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-lg px-4 py-2.5 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
                    </div>
                    <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                      Save Changes
                    </button>
                    {profileMsg && <p className="text-sm text-emerald-500 text-center mt-2 flex items-center justify-center gap-1"><Check size={16}/> {profileMsg}</p>}
                  </form>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Task Assignments</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Notify when you're assigned a task</p>
                      </div>
                      <button 
                        onClick={() => togglePreference('taskAssigned')}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${preferences.taskAssigned ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${preferences.taskAssigned ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Deadline Reminders</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Alerts for approaching due dates</p>
                      </div>
                      <button 
                        onClick={() => togglePreference('deadlineReminders')}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${preferences.deadlineReminders ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${preferences.deadlineReminders ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Project Updates</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Status changes and comments</p>
                      </div>
                      <button 
                        onClick={() => togglePreference('projectUpdates')}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${preferences.projectUpdates ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${preferences.projectUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {prefMsg && <p className="text-sm text-emerald-500 text-center mt-2 flex items-center justify-center gap-1"><Check size={16}/> {prefMsg}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Change Password</h3>
                  <form onSubmit={updatePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                        minLength={6}
                      />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white font-medium py-2.5 rounded-lg transition-colors">
                      Update Password
                    </button>
                    {securityMsg && <p className={`text-sm text-center mt-2 flex items-center justify-center gap-1 ${securityMsg.includes('success') ? 'text-emerald-500' : 'text-red-500'}`}>{securityMsg}</p>}
                  </form>
                </div>
              </motion.div>
            )}
          </div>

          {/* Logout Section */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors font-medium border border-red-200 dark:border-red-500/20"
            >
              <LogOut size={18} />
              <span>Log out from TaskNova</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SettingsModal;
