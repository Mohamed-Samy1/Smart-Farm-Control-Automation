

const { Alert } = require('../models/alert');

// Add alert with farm ID
exports.addAlert = async (req, res) => {
  try {
    const { type, message } = req.body;
    const alert = await Alert.create({ 
      farm_id: req.params.farm_id, 
      type, 
      message, 
      isAcknowledged: false 
    });
    return res.status(201).json(alert);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add alert." });
  }
};

// Get alert by ID
exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('farm_id', 'serialNumber');
    if (!alert) {
      return res.status(404).json({ error: "Alert not found." });
    }
    return res.status(200).json(alert);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get alert." });
  }
};

// Get all alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('farm_id', 'serialNumber');
    return res.status(200).json(alerts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get alerts." });
  }
};

// Get all unacknowledged alerts
exports.getUnacknowledgedAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isAcknowledged: false }).populate('farm_id', 'serialNumber');
    return res.status(200).json(alerts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get unacknowledged alerts." });
  }
};

// Get all acknowledged alerts
exports.getAcknowledgedAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ isAcknowledged: true }).populate('farm_id', 'serialNumber');
    return res.status(200).json(alerts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get acknowledged alerts." });
  }
};

// Delete alert by ID
exports.deleteAlertById = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found." });
    }
    return res.status(200).json({ message: "Alert deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete alert." });
  }
};