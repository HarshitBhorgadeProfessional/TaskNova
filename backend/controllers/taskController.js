const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('assignedTo', 'name email').populate('project', 'title').populate('createdBy', 'name');
    } else {
      // Member sees assigned tasks
      tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedTo', 'name email').populate('project', 'title').populate('createdBy', 'name');
    }
    res.json(tasks);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate, status } = req.body;

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      priority: priority || 'Medium',
      dueDate,
      status: status || 'Pending',
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    
    const populatedTask = await Task.findById(createdTask._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .populate('createdBy', 'name');

    // Create Activity Log
    await ActivityLog.create({
      task: createdTask._id,
      project: createdTask.project,
      user: req.user._id,
      action: 'created task',
      details: createdTask.title
    });

    // Create Notification using helper
    const io = req.app.get('io');
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await sendNotification(
        io,
        assignedTo,
        `${req.user.name} assigned you a new task: ${createdTask.title}`,
        'Task',
        '/tasks',
        'taskAssigned'
      );
    }

    // Emit socket event
    if (io) io.emit('taskCreated', populatedTask);

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, status, attachments, subtasks } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Admins can update anything. Members can only update status, attachments, or subtasks if it's their task.
    if (req.user.role !== 'Admin') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this task');
      }
      task.status = status || task.status;
      if (attachments) task.attachments = attachments;
      if (subtasks) task.subtasks = subtasks;
    } else {
      task.title = title || task.title;
      task.description = description || task.description;
      if (assignedTo !== undefined) task.assignedTo = assignedTo; 
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.status = status || task.status;
      if (attachments) task.attachments = attachments;
      if (subtasks) task.subtasks = subtasks;
    }

    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .populate('createdBy', 'name');

    // Create Activity Log
    await ActivityLog.create({
      task: updatedTask._id,
      project: updatedTask.project,
      user: req.user._id,
      action: 'updated task',
      details: updatedTask.title
    });

    const io = req.app.get('io');

    // Notify assigned user if admin changed their task
    if (req.user.role === 'Admin' && updatedTask.assignedTo && updatedTask.assignedTo.toString() !== req.user._id.toString()) {
      await sendNotification(
        io,
        updatedTask.assignedTo,
        `Admin ${req.user.name} updated your task: ${updatedTask.title}`,
        'Task',
        '/tasks',
        'projectUpdates'
      );
    }

    // Notify admin if member completes or updates task
    if (req.user.role === 'Member' && updatedTask.createdBy) {
      await sendNotification(
        io,
        updatedTask.createdBy,
        `${req.user.name} updated task status to ${updatedTask.status}: ${updatedTask.title}`,
        'Task',
        '/tasks',
        'projectUpdates'
      );
    }

    // Emit socket event
    if (io) io.emit('taskUpdated', populatedTask);

    res.json(populatedTask);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      
      // Emit socket event
      const io = req.app.get('io');
      if (io) io.emit('taskDeleted', req.params.id);

      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
