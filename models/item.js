const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    unique: true,
    required: [true, "Please enter the serial number of the item!"]
  },
  name: {
    type: String,
    required: [true, "Please enter the item name!"]
  },
  isIOT: {
    type: Boolean,
    required: [true, "Please answer if the item is an IOT device!"]
  },
  isPlant: {
    type: Boolean,
    required: [true, "Please enter if the item is a plant!"]
  },
  isDisabled:{
    type: Boolean,
    required: [true, "Please enter is the item disabled!"]
  },
  category: {
    type: String,
    required: [true, "Please enter the category of the item!"]
  }
}, { timestamps: true }
);

exports.Item = mongoose.model("Item", itemSchema);
exports.itemSchema = itemSchema;