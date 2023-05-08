const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name of the plant."],
    unique: true
  },
  life_cycle: Number
}, { timestamps: true });

exports.Plant = mongoose.model("Plant", plantSchema);
exports.plantSchema = plantSchema;