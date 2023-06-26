const express = require('express');
const router = express.Router();

const farmsController = require('../controllers/farms');

// Create a new farm
router.post('/', farmsController.createNewFarm);

// Get a farm by ID
router.get('/getFarmBySerialNumber', farmsController.getFarmBySerialNumber);

// Get all farms [ In General ]
router.get('/', farmsController.getAllFarms);

// Update a farm by ID
router.put('/updateFarmOfUser', farmsController.updateFarmOfUser);

// Delete a farm by ID
router.delete('/deleteFarmFromUser', farmsController.deleteFarmFromUser);

//Add Farm to user
router.put('/addFarmToUser', farmsController.addFarmToUser);

// Take the user token, send back all his farms, names of this farms, plants included in those farms
router.get('/getEverythingAboutUserFarms', farmsController.getEverythingAboutUserFarms);

module.exports = router;