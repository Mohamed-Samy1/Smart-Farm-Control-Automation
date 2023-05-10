
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

// Get a plant by ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found." });
    }
    return res.status(200).json(plant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get plant." });
  }
};


//  1-  USE USER TOKEN INSTEAD OF USER ID
//  2-  USE SERIAL NUMBER IN REQUEST BODY
//  3-  USE THE NAME OF THE PLANT TO ADD IT IN REQUEST BODY
//  4-  USE THE PLANT COUNT IN REQUEST BODY

// ADD ENDPOINT TO GET ALL PLANTS (NAMES ONLY)
// MODIFY ENDPOINT TO GET ALL PLANTS (NAME, COUNT, HARVEST_DATE)


// Add plant to user farm
exports.addPlantToFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const plant = await Plant.findOne({ name: plant_name });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    const newPlant = {
      _id: plant._id,
      plant_count: req.body.plant_count,
      plant_health: {
        harvest_date: new Date(Date.now() + (plant.life_cycle * 24 * 60 * 60 * 1000)),
      },
    };

    farm.plants.push(newPlant);
    await farm.save();

    res.status(200).json({ message: 'Plant added successfully', farm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// get an array of objects of plants (names), and harvest date of each plant in a specific farm
exports.getPlantsByFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('plants._id');

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const plants = farm.plants.map((plant) => {
      return {
        name: plant._id.name,
        harvest_date: plant.plant_health.harvest_date
      };
    });

    res.status(200).json({ plants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};