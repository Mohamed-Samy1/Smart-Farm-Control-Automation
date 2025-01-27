const jwt = require('jsonwebtoken');

const { Farm, Threshold } = require('../models/farm');
const { User } = require("../models/user");

const { getAuthenticatedUser } = require('../utils/authorization');

// Create a new farm
exports.createNewFarm = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    const farm = new Farm({
      serialNumber: req.body.serialNumber,
      type: req.body.type,
    });

    await farm.save();

    res.json({ message: 'Farm created successfully', farm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getFarmBySerialNumber = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    const farm_serialNumber = req.body.serialNumber;
    const farm = await Farm.findOne({ serialNumber: farm_serialNumber }).populate('plants._id', 'name life_cycle');
    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }
    return res.status(200).json(farm);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get farm." });
  }
};

// Get all farms [ In General ]
exports.getAllFarms = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    const farms = await Farm.find().populate('plants._id', 'name life_cycle');
    return res.status(200).json(farms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get farms." });
  }
};

exports.updateFarmOfUser = async (req, res) => {
  try {
    
    const user = await getAuthenticatedUser(req);

    // Find the farm in the user's farms array by serialNumber
    const farm_serialNumber = req.body.serialNumber;
    const farm = user.farms.find(farm => farm.serialNumber === farm_serialNumber);

    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Update the farm
    farm.type = req.body.type;
    farm.sensors = req.body.sensors;
    farm.plants = req.body.plants;
    farm.isDisabled = req.body.isDisabled;
    await user.save();

    return res.status(200).json({ message: "Farm updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update farm." });
  }
};

exports.deleteFarmFromUser = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    // Find the farm in the user's farms array by serialNumber
    const farm_serialNumber = req.body.serialNumber;
    const farmIndex = user.farms.findIndex(farm => farm.serialNumber === farm_serialNumber);

    if (farmIndex === -1) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Delete the farm from the user's farms array and save the user
    user.farms.splice(farmIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Farm deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete farm." });
  }
};

// NEW FUNCTIONS  8/5/2023

//ADD FARM TO USER USING JWT TOKEN
exports.addFarmToUser = async (req, res) => {
  try {

    const user = await getAuthenticatedUser(req);

    const farm_serialNumber = req.body.serialNumber;
    const farm_name = req.body.name;

    const farm = await Farm.findOne({ serialNumber: farm_serialNumber });
    if (!farm) {
      return res.status(404).json({ error: 'Farm not found' });
    }

    // Check if the farm is already owned by another user
    const otherUser = await User.findOne({ 'farms.farm': farm._id, '_id': { $ne: user._id } });
    if (otherUser) {
      return res.status(400).json({ error: 'Farm already assigned to another user' });
    }

    // Check if the farm is already owned by the current user
    const farmIndex = user.farms.findIndex(f => f.farm.toString() === farm._id.toString());
    if (farmIndex !== -1) {
      return res.status(400).json({ error: 'Farm already added to user' });
    }

    user.farms.push({
      farm: farm._id,
      user: user._id
    });

    farm.user = user._id;
    farm.name = farm_name;

    await user.save();
    await farm.save();

    res.status(200).json({ message: 'Farm added to user' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
};


// Take the user token, send back all his farms and names of this farms
exports.getEverythingAboutUserFarms = async (req, res) => {
  try {
    
    const user = await getAuthenticatedUser(req);

    // Find all the farms that belong to the user and populate the plants field
    const farms = await Farm.find({ _id: { $in: user.farms.map(f => f.farm) } })
      .populate({
        path: 'plants._id',
        select: 'name'
      })
      .select('serialNumber name plants');

    // Map the plants array to only include the name and plant_count fields
    const mappedFarms = farms.map(farm => {
      const mappedPlants = farm.plants.map(plant => {
        return {
          name: plant._id.name,
          plant_count: plant.plant_count
        };
      });
      return {
        _id: farm._id,
        serialNumber: farm.serialNumber,
        name: farm.name,
        plants: mappedPlants
      };
    });

    // Add the farms_count field to the JSON response
    const farms_count = user.farms.length;
    const response = { farms: mappedFarms, farms_count };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get farms." });
  }
};