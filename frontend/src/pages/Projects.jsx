import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/axios';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Active', teamMembers: [] });

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/api/projects');
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (user.role === 'Admin') {
      try {
        const { data } = await api.get('/api/users');
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/projects', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', status: 'Active', teamMembers: [] });
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => {
      const isSelected = prev.teamMembers.includes(userId);
      if (isSelected) {
        return { ...prev, teamMembers: prev.teamMembers.filter(id => id !== userId) };
      } else {
        return { ...prev, teamMembers: [...prev.teamMembers, userId] };
      }
    });
  };

  if (loading) return <div>Loading Projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Projects</h2>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-pink-600 dark:bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-700 dark:hover:bg-pink-600 transition shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white dark:bg-[#111113] p-6 rounded-2xl border border-slate-200 dark:border-[#27272a] shadow-sm hover:shadow-md dark:hover:border-pink-500/50 transition-all flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{project.title}</h3>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                project.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 
                project.status === 'Completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-[#27272a] dark:text-slate-300'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">{project.description}</p>
            
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-[#27272a]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                <div className="flex -space-x-2">
                  {project.teamMembers.slice(0, 3).map((member, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-500/20 border-2 border-white dark:border-[#111113] flex items-center justify-center text-xs font-bold text-pink-700 dark:text-pink-400" title={member.name}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {project.teamMembers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#27272a] border-2 border-white dark:border-[#111113] flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      +{project.teamMembers.length - 3}
                    </div>
                  )}
                </div>
              </div>
              
              {user?.role === 'Admin' && (
                <div className="flex justify-end space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(project._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Basic Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col selection:bg-primary-500/30 selection:text-primary-600 dark:selection:text-primary-400">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-[#27272a] bg-slate-50 dark:bg-[#111113] flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Create New Project</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                  required 
                  type="text" 
                  className="w-full px-4 py-2 bg-white dark:bg-[#1f1f22] border border-slate-200 dark:border-[#27272a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-shadow" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                  required 
                  className="w-full px-4 py-2 bg-white dark:bg-[#1f1f22] border border-slate-200 dark:border-[#27272a] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-shadow resize-none" 
                  rows="3" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Team Members</label>
                <div className="max-h-32 overflow-y-auto bg-white dark:bg-[#1f1f22] border border-slate-200 dark:border-[#27272a] rounded-lg p-3 space-y-2">
                  {users.map(u => (
                    <label key={u._id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-slate-50 dark:hover:bg-[#27272a] rounded transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 bg-white dark:bg-[#18181b] dark:border-[#27272a] dark:checked:bg-primary-600"
                        checked={formData.teamMembers.includes(u._id)} 
                        onChange={() => handleMemberToggle(u._id)} 
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 select-none">{u.name} <span className="text-slate-400">({u.email})</span></span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-[#27272a] mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#27272a] rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
