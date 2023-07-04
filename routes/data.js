const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data');

// Get all data
router.get('/', dataController.getAllData);

// Get all data of a specific farm
router.post('/', dataController.getFarmData);

// Handle manual control of devices
router.post('/manualControl', dataController.manualControl);

module.exports = router;