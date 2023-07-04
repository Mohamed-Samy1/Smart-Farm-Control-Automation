const express = require('express');
const router = express.Router();
const plantsController = require('../controllers/plants');

// Add a new plant
router.post('/', plantsController.addPlant);

// Delete a plant by ID
router.delete('/:id', plantsController.deletePlant);

// Update a plant by ID
router.put('/:id', plantsController.updatePlant);

// Get a plant by ID
router.post('/getPlantByFarmAndName', plantsController.getPlantByFarmAndName);

// Add plant to user farm
router.post('/addPlantToFarm', plantsController.addPlantToFarm);

// get an array of objects of plants (names), and harvest date of each plant in a specific farm
router.get('/getPlantsAndHarvestDates', plantsController.getPlantsAndHarvestDates);

// GET ALL PLANTS (NAMES ONLY)
router.get('/getAllPlantNames', plantsController.getAllPlantNames);

// getAllPlantsByFarm
router.post('/getAllPlantsByFarm', plantsController.getAllPlantsByFarm);

// Check the plant health using the camera
router.get('/checkPlantHealthByCamera', plantsController.checkPlantHealthByCamera);

/* 
Get an array of objects that has the following:
1) serialNumber of each farm the user has
2) name of each plant in these farms
3) plant_count of each plant in these farms
*/
router.get('/getArrayOfFarmsWithInfoForUser', plantsController.getArrayOfFarmsWithInfoForUser);

module.exports = router;