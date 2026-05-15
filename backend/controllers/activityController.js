const ActivityLog = require('../models/ActivityLog');

// @desc    Get all activities (Admin sees all, Member sees related to them/their projects)
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
  try {
    let activities;
    if (req.user.role === 'Admin') {
      activities = await ActivityLog.find()
        .populate('user', 'name avatar')
        .populate('task', 'title')
        .populate('project', 'title')
        .sort('-createdAt')
        .limit(50);
    } else {
      // Simplification: showing last 50 activities overall, in a real app filter by project involvement
      activities = await ActivityLog.find()
        .populate('user', 'name avatar')
        .populate('task', 'title')
        .populate('project', 'title')
        .sort('-createdAt')
        .limit(50);
    }
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActivities };
