import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/axios';
import { Plus, Trash2, Edit2, Paperclip, MoreVertical, Search, Filter, LayoutList, KanbanSquare } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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
  const [viewMode, setViewMode] = useState('list');

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

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      const task = tasks.find(t => t._id === draggableId);
      if (user?.role !== 'Admin' && (!task.assignedTo || task.assignedTo._id !== user?._id)) {
        alert('Not authorized to move this task');
        return;
      }
      
      const newStatus = destination.droppableId;
      setTasks(prev => prev.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));
      
      try {
        await api.put(`/api/tasks/${draggableId}`, { status: newStatus });
      } catch (error) {
        console.error('Failed to update status', error);
        fetchTasks(); // Revert on failure
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
          <div className="hidden sm:flex bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-lg p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md flex items-center transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-[#27272a] text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              title="List View"
            >
              <LayoutList size={16} />
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md flex items-center transition-colors ${viewMode === 'board' ? 'bg-slate-100 dark:bg-[#27272a] text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              title="Board View"
            >
              <KanbanSquare size={16} />
            </button>
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

      {viewMode === 'list' ? (
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
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar items-start min-h-[500px]">
            {['Pending', 'In Progress', 'Completed'].map(status => {
              const columnTasks = filteredTasks.filter(t => t.status === status);
              return (
                <div key={status} className="flex-shrink-0 w-80 flex flex-col bg-slate-50/50 dark:bg-[#111113]/50 border border-slate-200/60 dark:border-[#27272a]/60 rounded-2xl">
                  <div className="p-4 border-b border-slate-200 dark:border-[#27272a] flex justify-between items-center bg-slate-50/80 dark:bg-[#18181b]/80 rounded-t-2xl">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        status === 'Pending' ? 'bg-amber-500' : 
                        status === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}></div>
                      {status}
                    </h3>
                    <span className="text-xs font-medium bg-slate-200 dark:bg-[#27272a] text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                  </div>
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef}
                        className={`flex-1 p-3 space-y-3 min-h-[150px] transition-colors rounded-b-2xl ${snapshot.isDraggingOver ? 'bg-slate-100/50 dark:bg-[#1f1f22]/50' : ''}`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                                className={`bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] p-4 rounded-xl shadow-sm cursor-pointer group ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500/20' : 'hover:shadow-md hover:border-primary-500/30'} transition-all`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                  </span>
                                  {task.attachments?.length > 0 && (
                                    <Paperclip size={14} className="text-slate-400" />
                                  )}
                                </div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 leading-snug">{task.title}</h4>
                                {task.description && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                                )}
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-[#27272a]">
                                  {task.assignedTo ? (
                                    <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-[10px] font-bold border border-white dark:border-[#18181b]" title={task.assignedTo.name}>
                                      {task.assignedTo.name.charAt(0)}
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#27272a] border border-dashed border-slate-300 dark:border-slate-600"></div>
                                  )}
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No Date'}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
      
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
