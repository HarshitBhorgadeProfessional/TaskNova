import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/axios';
import { Plus, Trash2, Edit2, Paperclip, MoreVertical, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';

import CreateTaskModal from '../components/CreateTaskModal';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/api/tasks');
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    import('../lib/socket').then(({ default: socket }) => {
      socket.connect();
      
      socket.on('taskCreated', (newTask) => {
        setTasks(prev => {
          if (!prev.find(t => t._id === newTask._id)) return [...prev, newTask];
          return prev;
        });
      });

      socket.on('taskUpdated', (updatedTask) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        setSelectedTask(prev => prev?._id === updatedTask._id ? updatedTask : prev);
      });

      socket.on('taskDeleted', (taskId) => {
        setTasks(prev => prev.filter(t => t._id !== taskId));
        setSelectedTask(prev => prev?._id === taskId ? null : prev);
      });

      return () => {
        socket.off('taskCreated');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
      };
    });
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleDelete = async (taskId) => {
    if(window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/api/tasks/${taskId}`);
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  const priorityColors = {
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  };

  const statusColors = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="p-8 text-slate-500">Loading Tasks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Tasks</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your team's work</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-slate-200 transition-shadow"
            />
          </div>
          <Button variant="outline" className="hidden sm:flex">
            <Filter size={16} className="mr-2" /> Filter
          </Button>
          {user?.role === 'Admin' && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={16} className="mr-2" /> New Task
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1f1f22] border-b border-slate-200 dark:border-[#27272a] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#27272a]">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No tasks found. Create one to get started.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task._id} onClick={() => setSelectedTask(task)} className="hover:bg-slate-50 dark:hover:bg-[#1f1f22] transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
                          {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">{task.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{task.project?.title || 'No Project'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {task.assignedTo ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-xs font-bold">
                            {task.assignedTo.name.charAt(0)}
                          </div>
                          <span className="text-sm text-slate-700 dark:text-slate-300">{task.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No Date'}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className={`text-sm font-medium border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer ${statusColors[task.status]}`}
                        disabled={user?.role !== 'Admin' && (!task.assignedTo || task.assignedTo._id !== user?._id)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Attachments">
                          <Paperclip size={16} />
                        </button>
                        {user?.role === 'Admin' && (
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <TaskModal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        task={selectedTask}
        onTaskUpdate={handleTaskUpdate}
      />
      
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
};

export default Tasks;
