const { Data } = require("../models/data");
const { Farm } = require("../models/farm");

const { getAuthenticatedUser } = require("../utils/authorization");

const { initializeMQTT } = require("../services/mqtt");


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
    res.status(500).json({
      error:
        "Could not get the data, please check if you passed the correct token",
    });
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
    const data = await Data.find({ serialNumber: serialNumber });

    // Send the data documents as the response
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred retreiving the farm data." });
  }
};

// Endpoint to handle manual control of devices
exports.manualControl = async (req, res, next) => {

  const mqtt = require("mqtt");

  // MQTT Credentials and connection
  const options = {
    host: process.env.HOST,
    port: process.env.MQTTPORT,
    protocol: process.env.PROTOCOL,
    username: "Samy1",
    password: process.env.PASSWORD,
  };

  // initialize the MQTT client
  var client = mqtt.connect(options);

  // setup the callbacks
  client.on("connect", function () {
    console.log("Connected to HiveMQ");
  });

  client.on("error", function (error) {
    console.error("Error connecting to HiveMQ Cloud:", error);
  });

  function subscribeToMainTopic(topic) {
    // Subscribe to the topic
    client.subscribe(topic, function (err) {
      if (err) {
        console.log("Error subscribing to topic:", err);
      } else {
        console.log("Subscribed to topic" + " " + topic);
      }
    });
  }

  const { serialNumber, device, state, isAuto } = req.body;

  if (!isAuto) {
    client.unsubscribe("hydra-main");
    console.log('Unsubscribed to hydra-main, Manual Control is now On.');
    
    // Check if the device and state fields are present in the request body
    if (!device || !state || !serialNumber) {
      return res
        .status(400)
        .send("Serial Number, Device, and state fields are required");
    }
    // Publish a message to the relevant MQTT topic based on the device and state
    const topic = `${device}/${serialNumber}/`;
    const message = state === "on" ? "1" : "0";
    client.publish(topic, message, (err) => {
      if (err) {
        console.error(`Error publishing message to topic ${topic}:`, err);
        return res.status(500).send("Error publishing message to MQTT broker");
      }
      console.log(`Published message ${message} to topic ${topic}`);
      return res.status(200).send(`Successfully turned ${state} ${device}`);
    });
  } else if (isAuto) {
    initializeMQTT(isAuto);
    console.log('Subscribed to hydra-main, Automatic Control is now On.');
    next();
  }
};
