import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Paperclip, Download, Trash2, FileText, FileImage, FileCode, Archive, CheckCircle2, Circle, MessageSquare, Send } from 'lucide-react';
import { Button } from './ui/Button';
import api from '../lib/axios';
import { format } from 'date-fns';

const TaskModal = ({ isOpen, onClose, task, onTaskUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Subtasks and Comments State
  const [newSubtask, setNewSubtask] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      fetchComments();
    }
  }, [isOpen, task]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await api.get(`/api/comments/${task._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/api/comments/${task._id}`, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  const handleAddSubtask = async (e) => {
    if (e.key === 'Enter' && newSubtask.trim()) {
      e.preventDefault();
      try {
        const updatedSubtasks = [...(task.subtasks || []), { title: newSubtask.trim(), isCompleted: false }];
        const { data: updatedTask } = await api.put(`/api/tasks/${task._id}`, { subtasks: updatedSubtasks });
        onTaskUpdate(updatedTask);
        setNewSubtask('');
      } catch (err) {
        console.error('Failed to add subtask', err);
      }
    }
  };

  const handleToggleSubtask = async (idx) => {
    try {
      const updatedSubtasks = [...(task.subtasks || [])];
      updatedSubtasks[idx].isCompleted = !updatedSubtasks[idx].isCompleted;
      const { data: updatedTask } = await api.put(`/api/tasks/${task._id}`, { subtasks: updatedSubtasks });
      onTaskUpdate(updatedTask);
    } catch (err) {
      console.error('Failed to toggle subtask', err);
    }
  };

  if (!isOpen || !task) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10000000) {
      setError('File must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newAttachment = {
        name: uploadRes.data.name,
        url: uploadRes.data.url,
        type: uploadRes.data.type,
        size: uploadRes.data.size,
      };

      const updatedAttachments = [...(task.attachments || []), newAttachment];
      
      const { data: updatedTask } = await api.put(`/api/tasks/${task._id}`, { attachments: updatedAttachments });
      onTaskUpdate(updatedTask);
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
      e.target.value = null; // Reset input
    }
  };

  const handleRemoveAttachment = async (attachmentUrl) => {
    try {
      const updatedAttachments = task.attachments.filter(a => a.url !== attachmentUrl);
      const { data: updatedTask } = await api.put(`/api/tasks/${task._id}`, { attachments: updatedAttachments });
      onTaskUpdate(updatedTask);
    } catch (err) {
      console.error('Failed to remove attachment', err);
    }
  };

  const getFileIcon = (type) => {
    if (!type) return <FileText size={24} className="text-slate-500" />;
    if (type.includes('image')) return <FileImage size={24} className="text-blue-500" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive size={24} className="text-amber-500" />;
    if (type.includes('javascript') || type.includes('json') || type.includes('text/plain')) return <FileCode size={24} className="text-emerald-500" />;
    return <FileText size={24} className="text-slate-500" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-[#27272a] flex justify-between items-center bg-slate-50 dark:bg-[#111113]">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Task Details</h3>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{task.title}</h2>
            <div className="flex items-center space-x-4 mb-6">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-[#27272a] dark:text-slate-300`}>
                {task.status}
              </span>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-[#27272a] dark:text-slate-300`}>
                {task.priority} Priority
              </span>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-[#1f1f22] p-4 rounded-xl border border-slate-100 dark:border-[#27272a]">
                {task.description}
              </p>
            </div>

            {/* Subtasks Section */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                <CheckCircle2 size={16} className="mr-2" /> Subtasks
              </h4>
              
              {/* Progress Bar */}
              {(task.subtasks?.length > 0) && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#27272a] rounded-full h-1.5">
                    <div 
                      className="bg-primary-500 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.round((task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-3">
                {task.subtasks?.map((subtask, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-[#1f1f22] rounded-lg group transition-colors">
                    <button onClick={() => handleToggleSubtask(idx)} className="text-slate-400 hover:text-primary-500 transition-colors">
                      {subtask.isCompleted ? <CheckCircle2 size={18} className="text-primary-500" /> : <Circle size={18} />}
                    </button>
                    <span className={`text-sm flex-1 ${subtask.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Add a new subtask and press Enter..." 
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={handleAddSubtask}
                className="w-full bg-slate-50 dark:bg-[#1f1f22] border border-slate-200 dark:border-[#27272a] rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              />
            </div>

            {/* Attachments Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <Paperclip size={16} className="mr-2" /> Attachments
                </h4>
                <label className="cursor-pointer">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                    {uploading ? 'Uploading...' : 'Add file'}
                  </span>
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>
              
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(!task.attachments || task.attachments.length === 0) && (
                  <p className="text-sm text-slate-400 col-span-2">No attachments yet.</p>
                )}
                {task.attachments?.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 dark:border-[#27272a] rounded-xl hover:bg-slate-50 dark:hover:bg-[#1f1f22] transition-colors">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="flex-shrink-0 bg-slate-100 dark:bg-[#27272a] p-2 rounded-lg">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(file.uploadedAt), 'MMM d, yyyy')} • {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                      <a href={`${import.meta.env.VITE_API_URL || ''}${file.url}`} target="_blank" rel="noreferrer" download className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors">
                        <Download size={16} />
                      </a>
                      <button onClick={() => handleRemoveAttachment(file.url)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                <MessageSquare size={16} className="mr-2" /> Comments
              </h4>
              <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {loadingComments ? (
                  <p className="text-sm text-slate-500 text-center py-2">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-2">No comments yet. Start the discussion!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 dark:text-primary-400 font-semibold text-xs">
                          {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 bg-slate-50 dark:bg-[#1f1f22] p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-[#27272a]">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{comment.user?.name || 'Unknown'}</span>
                          <span className="text-[10px] text-slate-400">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleAddComment} className="flex space-x-2 relative">
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#1f1f22] border border-slate-200 dark:border-[#27272a] rounded-xl pl-4 pr-12 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
