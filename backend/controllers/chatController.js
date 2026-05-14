const Message = require('../models/Message');

// @desc    Get all chat messages
// @route   GET /api/chat
// @access  Private
const getMessages = async (req, res) => {
  try {
    // Fetch last 100 messages, newest first, then reverse to show chronologically
    const messages = await Message.find()
      .populate('sender', 'name avatar role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages };
