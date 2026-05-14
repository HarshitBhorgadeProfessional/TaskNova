const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
