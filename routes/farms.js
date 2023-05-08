const express = require('express');
const router = express.Router();

const farmsController = require('../controllers/farms');

// Add a new farm
router.post('/', farmsController.addFarm);

// Add sensor thresholds
router.post('/thresholds', farmsController.addSensorThresholds);

// Update sensor thresholds
router.put('/thresholds', farmsController.updateSensorThresholds);

// Get a farm by ID
router.get('/:id', farmsController.getFarmById);

// Get all farms
router.get('/', farmsController.getAllFarms);

// Update a farm by ID
router.put('/:id', farmsController.updateFarmById);

// Delete a farm by ID
router.delete('/:id', farmsController.deleteFarmById);

//Get farms (names, plants count) by user ID
router.get('/userFarms/:id', farmsController.getFarmsByUserId);

//Add Farm to user
router.post('/userFarms/:id', farmsController.addFarmToUser);

module.exports = router;