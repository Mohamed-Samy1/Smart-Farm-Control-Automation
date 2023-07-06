const { Data } = require("../models/data");
const { Farm } = require("../models/farm");
// MQTT Broker configuration
HOST = "3948b6d4473247128a6249a0b03cf45d.s2.eu.hivemq.cloud"
MQTTPORT = 8883
PROTOCOL = "mqtts"
USERNAME = "Samy1"
PASSWORD = "RabnaYostor321@"

const options = {
  host: HOST,
  port: MQTTPORT,
  protocol: PROTOCOL,
  username: "Samy1",
  password: PASSWORD,
};
const mmmqqt = (options, flag)=>{
const mqtt = require("mqtt");

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on("connect", function () {
  console.log("Connected to HiveMQ");
});

client.on("error", function (error) {
  console.error("Error connecting to HiveMQ Cloud:", error);
});

client.publish(`t_pump/QQHCFkjncdx`,flag, { qos: 1 }, (err) => {
  if (err) {
    console.error("Error publishing '0':", err);
  } else {
    console.log("Pump      --> OFF");
  }
});
}
const cron = require('node-cron');
// ...

// Schedule tasks to be run on the server.
cron.schedule('2-59/3 * * * *', function() {
  console.log('running a task every minute');
  mmmqqt(options, "0")

});
// cron.schedule('*/3 * * * *', function() {
//   console.log('running a task every minute');
//   mmmqqt(options)
// });