import { useState, useEffect, useContext } from 'react';
import api from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Mail, Shield, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Users = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member'
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'Admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'Member' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        await api.put(`/api/users/${editingUser._id}`, formData);
      } else {
        // Create user
        await api.post('/api/users', formData);
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save user', error);
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-slate-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage team members and their roles.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={18} />
          <span>Add User</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((u) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111113] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 dark:bg-primary-400/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{u.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <Mail size={14} />
                      <span className="truncate max-w-[150px]">{u.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 relative z-10">
                <div className="flex items-center gap-2">
                  {u.role === 'Admin' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                      <Shield size={12} /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <UserIcon size={12} /> Member
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(u)}
                    className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  {u._id !== currentUser._id && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#111113] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#0b0b0c]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {editingUser ? 'Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <Input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-[#09090b] dark:text-slate-100"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                  <Button type="submit">{editingUser ? 'Save Changes' : 'Create User'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
