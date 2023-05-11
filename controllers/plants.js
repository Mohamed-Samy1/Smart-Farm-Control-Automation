
const Plant = require('../models/plant');

const Farm = require('../models/farm');

// Add a new plant
exports.addPlant = async (req, res) => {
  try {
    const { name, life_cycle } = req.body;
    const plant = await Plant.create({ name, life_cycle });
    return res.status(201).json(plant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add plant." });
  }
};

// Delete a plant by ID
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    return res.status(200).json({ message: "Plant deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete plant." });
  }
};

// Update a plant by ID
exports.updatePlant = async (req, res) => {
  try {
    const { name, life_cycle } = req.body;
    const plant = await Plant.findByIdAndUpdate(
      req.params.id,
      { name, life_cycle },
      { new: true }
    );
    if (!plant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    return res.status(200).json(plant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update plant." });
  }
};

exports.getPlantByFarmAndName = async (req, res) => {
  try {
    // Find the farm in the database by serialNumber
    const farm_serialNumber = req.body.serialNumber;
    const farm = await Farm.findOne({ serialNumber: farm_serialNumber }).populate('plants._id', 'name life_cycle');

    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Find the plant in the farm by name
    const plantName = req.body.plantName;
    const plantObj = farm.plants.find(plantObj => plantObj._id.name === plantName);

    if (!plantObj) {
      return res.status(404).json({ error: "Plant not found in the farm." });
    }

    // Extract the plant object from the plantObj and return it in the response
    const plant = {
      name: plantObj._id.name,
      life_cycle: plantObj._id.life_cycle,
      plant_count: plantObj.plant_count,
      harvest_date: plantObj.plant_health.harvest_date
    };

    return res.status(200).json(plant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get plant." });
  }
};


// ADD ENDPOINT TO GET ALL PLANTS (NAMES ONLY)
exports.getAllPlantNames = async (req, res) => {
  try {
    const plantNames = await Plant.find({}, 'name');

    return res.status(200).json(plantNames);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get plant names." });
  }
};

// MODIFY ENDPOINT TO GET ALL PLANTS (NAME, COUNT, HARVEST_DATE)  ??

exports.getAllPlantsByFarm = async (req, res) => {
  try {
    // Find the farm in the database by serialNumber
    const farm_serialNumber = req.body.serialNumber;
    const farm = await Farm.findOne({ serialNumber: farm_serialNumber }).populate('plants._id', 'name life_cycle');

    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Create an array of plant objects with name, count, and harvest date
    const plants = farm.plants.map(plantObj => {
      return {
        name: plantObj._id.name,
        plant_count: plantObj.plant_count,
        harvest_date: plantObj.plant_health.harvest_date
      }
    });

    return res.status(200).json(plants);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get plants." });
  }
};

exports.addPlantToFarm = async (req, res) => {
  try {
    // Find the farm in the database by serialNumber
    const farm_serialNumber = req.body.serialNumber;
    const farm = await Farm.findOne({ serialNumber: farm_serialNumber });

    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Find the plant in the database by name
    const plantName = req.body.plantName;
    const plant = await Plant.findOne({ name: plantName });

    if (!plant) {
      return res.status(404).json({ error: "Plant not found." });
    }

    // Add the plant to the farm and save the farm
    const newPlant = {
      _id: plant._id,
      plant_count: req.body.plant_count,
      plant_health: {
        harvest_date: new Date(Date.now() + (plant.life_cycle * 24 * 60 * 60 * 1000)),
      },
    };

    farm.plants.push(newPlant);
    await farm.save();

    return res.status(200).json(farm);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add plant to farm." });
  }
};

// get an array of objects of plants (names), and harvest date of each plant in a specific farm
exports.getPlantsAndHarvestDates = async (req, res) => {
  try {
    // Find the farm in the database by serialNumber
    const farm_serialNumber = req.body.serialNumber;
    const farm = await Farm.findOne({ serialNumber: farm_serialNumber }).populate('plants._id', 'name life_cycle');

    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Extract the plant names and harvest dates from the farm object
    const plantsAndHarvestDates = farm.plants.map(plantObj => {
      return {
        name: plantObj._id.name,
        harvest_date: plantObj.plant_health.harvest_date
      }
    });

    return res.status(200).json(plantsAndHarvestDates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get plants and harvest dates." });
  }
};