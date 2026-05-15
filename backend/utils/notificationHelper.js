const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Creates a notification in the database and emits a socket event
 * @param {Object} io - Socket.io instance
 * @param {String} userId - User ID to receive the notification
 * @param {String} message - Notification text
 * @param {String} type - Type of notification ('Task', 'Comment', 'System', 'Mention')
 * @param {String} link - Optional link to related resource
 * @param {String} preferenceKey - Key in user.preferences to check (e.g. 'taskAssigned')
 */
const sendNotification = async (io, userId, message, type = 'System', link = '', preferenceKey = null) => {
  try {
    // Check user preferences if preferenceKey is provided
    if (preferenceKey) {
      const user = await User.findById(userId);
      if (user && user.preferences && user.preferences[preferenceKey] === false) {
        return; // User has disabled this type of notification
      }
    }

    const notification = await Notification.create({
      user: userId,
      message,
      type,
      link
    });

    if (io) {
      // We don't have per-user socket rooms set up currently, 
      // but we can emit to all and let the client filter, OR better:
      // In a real app we'd emit to a specific room, e.g. `user_${userId}`.
      // Since we just have a general broadcast, we'll emit and the client will check `userId`
      io.emit('newNotification', notification);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = { sendNotification };
