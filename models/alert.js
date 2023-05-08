const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  farm_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farms'
  },
  type: String,
  message: String,
  isAcknowledged: Boolean
}, { timestamps: true });

exports.Alert = mongoose.model("Alert", alertSchema);
exports.alertSchema = alertSchema;