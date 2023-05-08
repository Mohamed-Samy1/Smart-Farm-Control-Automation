const mongoose = require("mongoose");

// The threshold schema
const thresholdSchema = new mongoose.Schema({
  sensorType: {
    type: String,
    required: [true, "Please enter the sensor type."],
  },
  threshold_min: {
    type: Number,
    required: [true, "Please enter the minimum threshold value."],
  },
  threshold_max: {
    type: Number,
    required: [true, "Please enter the maximum threshold value."],
  },
}, { timestamps: true });

// The data schema
const dataSchema = new mongoose.Schema({
  farm_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  sensors: {
    waterTemp: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the water temperature sensor reading."],
    },
    environmentTemp: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the environment temperature sensor reading."],
    },
    co2: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the CO2 sensor reading."],
    },
    light: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the light sensor reading."],
    },
    uvIndex: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the UV index sensor reading."],
    },
    humidity: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the humidity sensor reading."],
    },
    waterLevel: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the water level sensor reading."],
    },
    ph: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the pH sensor reading."],
    },
    electricalConductivity: {
      type: Number,
      ref: "Threshold",
      required: [true, "Please enter the electrical conductivity sensor reading."],
    },
  }
}, { timestamps: true });

exports.Threshold = mongoose.model("Threshold", thresholdSchema);
exports.thresholdSchema = thresholdSchema;

exports.Data = mongoose.model("Data", dataSchema);
exports.dataSchema = dataSchema;