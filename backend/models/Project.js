const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  teamMembers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Archived'],
    default: 'Active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
