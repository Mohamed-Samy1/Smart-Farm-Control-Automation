
const { Farm, Threshold } = require('../models/farm');
const User = require('../models/user');

// Add sensor thresholds
exports.addSensorThresholds = async (req, res) => {
  try {
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
exports.addFarm = async (req, res) => {
  try {
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

// Get a farm by ID
exports.getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('plants._id', 'name life_cycle');
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
    const farms = await Farm.find().populate('plants._id', 'name life_cycle');
    return res.status(200).json(farms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get farms." });
  }
};

// Update a farm by ID
exports.updateFarmById = async (req, res) => {
  try {
    const { serialNumber, type, sensors, plants, isDisabled } = req.body;
    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      { serialNumber, type, sensors, plants, isDisabled },
      { new: true }
    );
    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }
    return res.status(200).json(farm);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update farm." });
  }
};

// Delete a farm by ID
exports.deleteFarmById = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (!farm) {
      return res.status(404).json({ error: "Farm not found." });
    }
    return res.status(200).json({ message: "Farm deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete farm." });
  }
};

// NEW FUNCTIONS  8/5/203

//Add Farm to user
exports.addFarmToUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const farm_serialNumber = req.body.serialNumber;
    const farm_name = req.body.name;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const farm = await Farm.findOne({ serialNumber: farm_serialNumber });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    if (user.farms.find(farm => farm._id.toString() === farm._id.toString())) {
      return res.status(400).json({ message: 'Farm already added to user' });
    }

    user.farms.push({ _id: farm._id });
    farm.name = farm_name;
    
    await user.save();

    res.status(200).json({ message: 'Farm added to user' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Get farms (names, plants count) by user ID
exports.getFarmsByUserId = async (req, res) => {
  try {
    const farms = await Farm.find({ user_id: req.params.id })
                             .select('name plants.plant_count');
    res.status(200).json({ farms });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};