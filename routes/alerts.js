const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alerts');

// Add alert
router.post('create/:farm_id', alertController.addAlert);

// Get alert by ID
router.get('/:id', alertController.getAlertById);

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get all unacknowledged alerts
router.get('/unacknowledged', alertController.getUnacknowledgedAlerts);

// Get all acknowledged alerts
router.get('/acknowledged', alertController.getAcknowledgedAlerts);

// Delete alert by ID
router.delete('/:id', alertController.deleteAlertById);

module.exports = router;
