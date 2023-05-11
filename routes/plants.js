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
router.get('/getPlantByFarmAndName', plantsController.getPlantByFarmAndName);

// Add plant to user farm
router.post('/addPlantToFarm', plantsController.addPlantToFarm);

// get an array of objects of plants (names), and harvest date of each plant in a specific farm
router.get('/getPlantsAndHarvestDates', plantsController.getPlantsAndHarvestDates);

// GET ALL PLANTS (NAMES ONLY)
router.get('/getAllPlantNames', plantsController.getAllPlantNames);

// getAllPlantsByFarm
router.get('/getAllPlantsByFarm', plantsController.getAllPlantsByFarm)

module.exports = router;