const mongoose = require("mongoose");

// The data schema
const dataSchema = new mongoose.Schema({
  farmID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  serialNumber: {
    type: String,
    required: [true, "Please enter the serial number of the device."]
  },
  paired: {
    type: Boolean,
    required: [true, "Please state if the device is paired or not."]
  },
  control: {
    type: String,
    required: [true, "Please enter the control type."]
  },
  T_temperature: {
    type: Number,
    required: [true, "Please enter the water temperature sensor reading."],
  },
  E_temperature: {
    type: Number,
    required: [true, "Please enter the environment temperature sensor reading."],
  },
  E_co2: {
    type: Number,
    required: [true, "Please enter the CO2 sensor reading."],
  },
  E_lightLVL: {
    type: Number,
    required: [true, "Please enter the light sensor reading."],
  },
  E_humidity: {
    type: Number,
    required: [true, "Please enter the humidity sensor reading."],
  },
  T_Waterlvl: {
    type: Number,
    required: [true, "Please enter the water level sensor reading."],
  },
  T_PH: {
    type: Number,
    required: [true, "Please enter the T_PH sensor reading."],
  },
  T_EC: {
    type: Number,
    required: [true, "Please enter the electrical conductivity sensor reading."],
  }
  
}, { timestamps: true });

exports.Data = mongoose.model("Data", dataSchema);
exports.dataSchema = dataSchema;