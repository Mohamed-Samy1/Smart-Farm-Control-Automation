const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    unique: [true, "There is a farm with this serial number already."],
    required: [true, "Please enter the serial number of the farm."],
  },
  name: {
    type: String,
    default: "New Farm",
  },
  type: {
    type: String,
    required: [true, "Please enter the type of the farm."],
  },
  plants: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant'
      },
      plant_count: {
        type: Number,
        required: true,
      },
      plant_health: {
        isDead: {
          type: Boolean,
          default: false,
        },
        harvest_date: {
          type: Date,
          required: true,
        }
      }
    }
  ],
  isDisabled: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });


exports.Farm = mongoose.model("Farm", farmSchema);
exports.farmSchema = farmSchema;