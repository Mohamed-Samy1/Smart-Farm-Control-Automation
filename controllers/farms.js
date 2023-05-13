const jwt = require('jsonwebtoken');

const { Farm, Threshold } = require('../models/farm');
const { User } = require("../models/user");

// Add sensor thresholds
exports.addSensorThresholds = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { farm_id, sensorType, threshold_min, threshold_max } = req.body;
    
    // Check if the farm exists
    const farm = await Farm.findById(farm_id);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }
    
    // Create the threshold object
    const threshold = await Threshold.create({ sensorType, threshold_min, threshold_max });
    
    // Add the threshold object to the farm's sensors object
    farm.sensors[sensorType] = threshold._id;
    await farm.save();
    
    return res.status(201).json(threshold);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add sensor thresholds." });
  }
};

// Update sensor thresholds by sensor type
exports.updateSensorThresholds = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { farm_id, sensorType, threshold_min, threshold_max } = req.body;

    // Check if the farm exists
    const farm = await Farm.findById(farm_id);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Check if the sensor type exists in the farm's sensors object
    if (!farm.sensors[sensorType]) {
      return res.status(404).json({ error: "Sensor type not found." });
    }

    // Find the threshold object and update its values
    const threshold = await Threshold.findByIdAndUpdate(
      farm.sensors[sensorType], 
      { threshold_min, threshold_max }, 
      { new: true }
    );
    if (!threshold) {
      return res.status(404).json({ error: "Threshold not found." });
    }

    return res.status(200).json(threshold);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update sensor thresholds." });
  }
};

// Add a new farm
exports.createNewFarm = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const farm = new Farm({
      serialNumber: req.body.serialNumber,
      type: req.body.type,
    });

    await farm.save();

    res.json({ message: 'Farm created successfully', farm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFarmBySerialNumber = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

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

// Get all farms
exports.getAllFarms = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const farms = await Farm.find().populate('plants._id', 'name life_cycle');
    return res.status(200).json(farms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get farms." });
  }
};

exports.updateFarmOfUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the farm in the user's farms array by serialNumber
    const farm_serialNumber = req.body.serialNumber;
    const farmIndex = user.farms.findIndex(farm => farm.serialNumber === farm_serialNumber);

    if (farmIndex === -1) {
      return res.status(404).json({ error: "Farm not found." });
    }

    // Update the farm in the user's farms array and save the user
    const farm = user.farms[farmIndex];
    farm.type = req.body.type;
    farm.sensors = req.body.sensors;
    farm.plants = req.body.plants;
    farm.isDisabled = req.body.isDisabled;
    await user.save();

    return res.status(200).json(farm);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update farm." });
  }
};

exports.deleteFarmFromUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

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

// NEW FUNCTIONS  8/5/203

//ADD FARM TO USER USING JWT TOKEN
exports.addFarmToUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing." });
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    const farm_serialNumber = req.body.serialNumber;
    const farm_name = req.body.name;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const farm = await Farm.findOne({ serialNumber: farm_serialNumber });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check if the farm is already owned by another user
    const otherUser = await User.findOne({ 'farms.farm': farm._id, '_id': { $ne: userId } });
    if (otherUser) {
      return res.status(400).json({ message: 'Farm already assigned to another user' });
    }

    // Check if the farm is already owned by the current user
    const farmIndex = user.farms.findIndex(f => f.farm.toString() === farm._id.toString());
    if (farmIndex !== -1) {
      return res.status(400).json({ message: 'Farm already added to user' });
    }

    user.farms.push({
      farm: farm._id,
      user: userId
    });

    farm.user = userId;
    farm.name = farm_name;

    await user.save();
    await farm.save();

    res.status(200).json({ message: 'Farm added to user' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
};

//GET ALL FARMS OF THE USER, ALSO INCLUDE THE COUNT OF EACH PLANT
exports.getFarmsAndPlantsCount = async (req, res) => {
  try {
    
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const farms = await Farm.find({ user_id: userId })
                             .select('name plants.plant_count');
    res.status(200).json({ farms });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Take the user token, send back all his farms and names of this farms
exports.getFarmsNamesAndSerialNumForUser = async (req, res) => {
  try {
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing." });
    }

    const token = authHeader.split(' ')[1];

    // Verify the JWT token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.secret);
    const userId = decodedToken.id;

    // Find the user in the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find all the farms that belong to the user
    const farms = await Farm.find({ _id: { $in: user.farms.map(f => f.farm) } }, { serialNumber: 1, name: 1 });

    return res.status(200).json({ farms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get farms." });
  }
};