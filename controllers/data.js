const { Data } = require("../models/data");
const { Farm } = require("../models/farm");

const { getAuthenticatedUser } = require("../utils/authorization");

const moment = require("moment");

// Get all data
exports.getAllData = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    // Find all the documents in the Data collection
    const data = await Data.find();

    // Return the data as a JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all data of a specific farm
exports.getFarmData = async (req, res) => {
  try {
    // Authenticate the user
    const user = await getAuthenticatedUser(req);

    // Get the serialNumber from the request body
    const { serialNumber } = req.body;

    // Find the farm with the provided serialNumber
    const farm = await Farm.findOne({ serialNumber });

    // Check if the farm exists and belongs to the authenticated user
    if (
      !farm ||
      !user.farms.some((f) => f.farm.toString() === farm._id.toString())
    ) {
      return res
        .status(404)
        .json({ message: "Farm with this serialNumber was not found." });
    }

    // Find the data documents associated with the farm
    const data = await Data.find({ farmID: farm._id });

    // Send the data documents as the response
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred retreiving the farm data." });
  }
};
