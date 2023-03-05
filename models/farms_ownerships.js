const mongoose = require('mongoose');

const farmsOwnersSchema = new mongoose.Schema({
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

exports.FarmsOwnerships = mongoose.model("FarmsOwnerships", farmsOwnersSchema);
exports.farmsOwnersSchema = farmsOwnersSchema;