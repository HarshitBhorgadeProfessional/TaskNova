const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Get comments for a task
// @route   GET /api/comments/:taskId
// @access  Private
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId }).populate('user', 'name avatar');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to a task
// @route   POST /api/comments/:taskId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: req.params.taskId,
      user: req.user._id,
      text
    });

    // Notify assigned user if someone else commented
    const io = req.app.get('io');
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      await sendNotification(
        io,
        task.assignedTo,
        `${req.user.name} commented on your task: ${task.title}`,
        'Comment',
        '/tasks',
        'projectUpdates'
      );
    }

    await ActivityLog.create({
      task: task._id,
      project: task.project,
      user: req.user._id,
      action: 'added a comment',
      details: text.substring(0, 50) + (text.length > 50 ? '...' : '')
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name avatar');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, addComment };
