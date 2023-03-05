const mongoose = require('mongoose');

const itemOwnersSchema = new mongoose.Schema({
  prevOwner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter the previous user ID!"],
    ref: 'User'
  },
  nextOwner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter the next user ID!"],
    ref: 'User'
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter the item ID that ownership was changed!"],
    ref: 'Item'
  },
  item_serialNumber: {
    type: String,
    required: [true, "Please enter the Serial number of the item that ownership was changed!"]
  },
  prevOwner_name: {
    type: String,
    required: [true, "Please enter the previous user name!"],
    ref: 'User'
  },
  nextOwner_name: {
    type: String,
    required: [true, "Please enter the next user name!"],
    ref: 'User'
  },
  farm_officalNumber: {
    type: String,
    required: [true, "Please enter the farm's offical number!"]
  }
}, { timestamps: true }
);

exports.ItemsOwnerships = mongoose.model("ItemsOwnerships", itemOwnersSchema);
exports.itemOwnersSchema = itemOwnersSchema;