const express = require('express');
const router = express.Router();

const farmsController = require('../controllers/farms');

// Create a new farm
router.post('/', farmsController.createNewFarm);

// Add sensor thresholds
router.post('/thresholds', farmsController.addSensorThresholds);

// Update sensor thresholds
router.put('/thresholds', farmsController.updateSensorThresholds);

// Get a farm by ID
router.get('/getFarmBySerialNumber', farmsController.getFarmBySerialNumber);

// Get all farms
router.get('/', farmsController.getAllFarms);

// Update a farm by ID
router.put('/updateFarmOfUser', farmsController.updateFarmOfUser);

// Delete a farm by ID
router.delete('/deleteFarmFromUser', farmsController.deleteFarmFromUser);

//Get farms (names, plants count) by user ID
router.get('/getFarmsAndPlantsCount', farmsController.getFarmsAndPlantsCount);

//Add Farm to user
router.put('/addFarmToUser', farmsController.addFarmToUser);

module.exports = router;