const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications');

// Add a new notification
router.post('/', notificationsController.addNotification);

// Get a notification by ID
router.get('/:id', notificationsController.getNotificationById);

// Get all notifications
router.get('/', notificationsController.getAllNotifications);

// Delete a notification by ID
router.delete('/:id', notificationsController.deleteNotificationById);

module.exports = router;