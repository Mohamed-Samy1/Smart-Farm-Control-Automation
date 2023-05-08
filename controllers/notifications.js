
const { Notification } = require('../models/notification');

// Add notification
exports.addNotification = async (req, res) => {
  try {
    const { user_id, message } = req.body;
    const notification = await Notification.create({ user_id, message, isRead: false });
    return res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add notification." });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('user_id', 'name email');
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    return res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get notification." });
  }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('user_id', 'name email');
    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get notifications." });
  }
};

// Delete notification by ID
exports.deleteNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }
    return res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete notification." });
  }
};