import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Paperclip, Download, Trash2, FileText, FileImage, FileCode, Archive } from 'lucide-react';
import { Button } from './ui/Button';
import api from '../lib/axios';
import { format } from 'date-fns';

const TaskModal = ({ isOpen, onClose, task, onTaskUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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

            {/* Attachments Section */}
            <div>
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
                      <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noreferrer" download className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors">
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
