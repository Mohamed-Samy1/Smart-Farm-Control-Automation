const mqtt = require("mqtt");
const { Data } = require("../models/data");
const { Farm } = require("../models/farm");

 // MQTT Broker configuration
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
  console.log("Manual control is now On.");
});

client.on("error", function (error) {
  console.error("Error connecting to HiveMQ Cloud:", error);
});
// Endpoint to handle manual control of devices
exports.manualControl =  (req, res) => {
  const { serialNumber, device, state } = req.body;

  // Check if the device and state fields are present in the request body
  if (!device || !state) {
    return res.status(400).send("Device and state fields are required");
  }

  // Publish a message to the relevant MQTT topic based on the device and state
  const topic = `${device}/${receivedData.serialNumber}/`;
  const message = state === "on" ? "1" : "0";
  client.publish(topic, message, (err) => {
    if (err) {
      console.error(`Error publishing message to topic ${topic}:`, err);
      return res.status(500).send("Error publishing message to MQTT broker");
    }
    console.log(`Published message ${message} to topic ${topic}`);
    return res.status(200).send(`Successfully turned ${state} ${device}`);
  });
};

// Start the Express server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});