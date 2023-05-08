const { Data } = require('../models/data');
const moment = require('moment');

// Add Data
exports.addData = async (req, res) => {
  try {
    const { 
      waterTemp, 
      environmentTemp, 
      phSensor, 
      waterLevel, 
      uvIndex, 
      co2, 
      humidity, 
      lightSensor
    } = req.body;

    const data = await Data.create(
      { 
        farm_id: req.params.farm_id, 
        waterTemp, 
        environmentTemp, 
        phSensor, 
        waterLevel, 
        uvIndex, 
        co2, 
        humidity, 
        lightSensor 
      });
      
    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add data." });
  }
};

// Get all data
exports.getAllData = async (req, res) => {
  try {
    const data = await Data.find().populate('farm_id', 'serialNumber');
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get data." });
  }
};

// Delete data by ID
exports.deleteDataById = async (req, res) => {
  try {
    const data = await Data.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "Data not found." });
    }
    return res.status(200).json({ message: "Data deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete data." });
  }
};

// Get data of last day
exports.getDataLastDay = async (req, res) => {
  try {
    const data = await Data.find({
      createdAt: {
        $gte: moment().subtract(1, 'day').toDate(),
        $lte: moment().toDate()
      }
    }).populate('farm_id', 'serialNumber');
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get data." });
  }
};

// Get data of last week
exports.getDataLastWeek = async (req, res) => {
  try {
    const data = await Data.find({
      createdAt: {
        $gte: moment().subtract(1, 'week').toDate(),
        $lte: moment().toDate()
      }
    }).populate('farm_id', 'serialNumber');
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get data." });
  }
};

// Get data of last month
exports.getDataLastMonth = async (req, res) => {
  try {
    const data = await Data.find({
      createdAt: {
        $gte: moment().subtract(1, 'month').toDate(),
        $lte: moment().toDate()
      }
    }).populate('farm_id', 'serialNumber');
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get data." });
  }
};

// Get all data of a specific farm
exports.getFarmAllSensorData = async (req, res) => {
  try {
    const farmSerialNumber = req.body.serialNumber;

    const farmData = await Data.findOne({ serialNumber: farmSerialNumber })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate('farm_id', 'serialNumber name type');

    if (!farmData) {
      return res.status(404).json({ message: 'Farm data not found' });
    }

    res.status(200).json({ sensorData: farmData.sensors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};