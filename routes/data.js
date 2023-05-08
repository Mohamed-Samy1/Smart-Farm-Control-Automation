const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data');

// Add data
router.post('create/:farm_id', dataController.addData);

// Get all data
router.get('/', dataController.getAllData);

// Delete data by ID
router.delete('/:id', dataController.deleteDataById);

// Get data of last day
router.get('/last-day', dataController.getDataLastDay);

// Get data of last week
router.get('/last-week', dataController.getDataLastWeek);

// Get data of last month
router.get('/last-month', dataController.getDataLastMonth);

// Get all data of a specific farm
router.post('/getFarmAllSensorData', dataController.getFarmAllSensorData);


module.exports = router;