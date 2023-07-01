const mqtt = require("mqtt");
const { Data } = require("../models/data");
const { Farm } = require("../models/farm");

async function saveSensorData(data) {
  try {
    // Extract the relevant fields from the received data
    const {
      serialNumber,
      paired,
      E_humidity,
      E_temperature,
      E_co2,
      E_lightLVL,
      T_temperature,
      T_Waterlvl,
      T_PH,
      T_EC,
    } = data;

    // Find the farm with the provided serialNumber
    const farm = await Farm.findOne({ serialNumber });
    if (!farm) {
      throw new Error(`Farm with serial number ${serialNumber} not found`);
    }

    // Create a new Data document and save it to the database
    const newData = new Data({
      farmID: farm._id,
      serialNumber,
      paired,
      E_humidity,
      E_temperature,
      E_co2,
      E_lightLVL,
      T_temperature,
      T_Waterlvl,
      T_PH,
      T_EC,
    });
    await newData.save();
    console.log("Sensor data saved to the database");
  } catch (error) {
    console.error("Error saving sensor data:", error);
  }
}

// Main MQTT Function

function initializeMQTT() {
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
  });

  client.on("error", function (error) {
    console.error("Error connecting to HiveMQ Cloud:", error);
  });

  //el fan teshtaghal law el e_temp aw el e_humidity twsal threshold
  const E_HUMIDITY_THRESHOLD = 60;
  const E_TEMPERATURE_THRESHOLD = 27;
  let check_e_fan = (received) => {
    if (
      received["E_humidity"] > E_HUMIDITY_THRESHOLD ||
      received["E_temperature"] > E_TEMPERATURE_THRESHOLD
    ) {
      publishForSensor("e_fan", "1");
      console.log("Fan    --> ON");
    } else {
      publishForSensor("e_fan", "0");
      console.log("Fan     --> OFF");
    }
  };

  // el valve teshtaghal lma el water level ywsal lel threshold
  const T_WATERLEVEL_THRESHOLD = 5;
  let check_t_valve = (received) => {
    if (received["T_Waterlvl"] < T_WATERLEVEL_THRESHOLD) {
      publishForSensor("t_valve", "1");
      console.log("Valve  --> ON");
    } else {
      publishForSensor("t_valve", "0");
      console.log("Valve  --> OFF");
    }
  };

  let pump1Time = 0;
  let pump2Time = 0;

  function handlePumps(data) {
    const currentTime = new Date().getTime();

    // Check the value of T_EC
    if (data["T_EC"] > 2000) {
      // If T_EC is greater than 2000, publish '1' on topic 'pump3'
      client.publish("pump3", "1");
      console.log("Pump 3 --> ON");
    } else {
      client.publish("pump3", "0");
      console.log("Pump 3 --> OFF");
    }

    // Check the value of T_PH
    if (data["T_PH"] < 5) {
      // If T_PH is less than 5, check if 5 minutes have passed since the last time we published to pump1
      if (currentTime - pump1Time >= 5 * 60 * 1000) {
        // If 5 minutes have passed, publish '1' on topic 'pump1' and update the pump1Time variable
        client.publish("pump1", "1");
        console.log("Pump 1 --> ON");
        console.log("Pump 2 --> OFF");
        pump1Time = currentTime;
      } else {
        client.publish("pump1", "0");
        client.publish("pump2", "0");
        console.log("Pump 1 --> OFF");
        console.log("Pump 2 --> OFF");
      }
    } else if (data["T_PH"] > 6) {
      // If T_PH is greater than 6, check if 5 minutes have passed since the last time we published to pump2
      if (currentTime - pump2Time >= 5 * 60 * 1000) {
        // If 5 minutes have passed, publish '1' on topic 'pump2' and update the pump2Time variable
        client.publish("pump2", "1");
        console.log("Pump 2 --> ON");
        console.log("Pump 1 --> OFF");
        pump2Time = currentTime;
      } else {
        client.publish("pump1", "0");
        client.publish("pump2", "0");
        console.log("Pump 1 --> OFF");
        console.log("Pump 2 --> OFF");      }
    } else {
      client.publish("pump1", "0");
      client.publish("pump2", "0");
      console.log("Pump 1 and Pump 2 --> OFF");
    }
  }

  //Check Light status
  function checkLightStatus() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    //If it's between 7 PM and 2 AM
    if (currentHour >= 19 || currentHour <= 2) {
      client.publish("e_light", "1");
      console.log("Light --> ON");
    } else {
      client.publish("e_light", "0");
      console.log("Light --> OFF");
    }
  }

  //remove old data each period of time from data collection
  async function removeOldData() {
    try {
      const currentTime = new Date();
      const sevenMinutesAgo = new Date(currentTime.getTime() - 7 * 60 * 1000);
  
      const result = await Data.deleteMany({ createdAt: { $lte: sevenMinutesAgo } });
      console.log(`${result.deletedCount} documents removed`);
    } catch (error) {
      console.error("Error removing old data:", error);
    }
  }

  function subscribeToMainTopic(topic) {
    // Subscribe to the topic
    client.subscribe(topic, function (err) {
      if (err) {
        console.log("Error subscribing to topic:", err);
      } else {
        console.log("Subscribed to topic" + " " + topic);
      }
    });

    // Log messages received on the topic
    client.on("message", function (topic, message) {
      let received = JSON.parse(message);
      //console.log(received["E_humidity"]);
      console.log('===============================')

      //check_e_light(received);

      // el pump wel air dayman shaghaleen
      publishForSensor("t_pump", "1");
      console.log("Tank Pump --> ON");

      publishForSensor("t_air", "1");
      console.log("Air Tank  --> ON");

      check_e_fan(received);
      check_t_valve(received);
      handlePumps(received);
      checkLightStatus();
      saveSensorData(received);
      removeOldData();
    });
  }

  function publishForSensor(topic, data) {
    client.publish(topic, data);
  }


  subscribeToMainTopic("hyrda-main");
}

module.exports = { initializeMQTT };




  // // el e_light testaghal lma el light twsal lel threshold
  // const E_LIGHTLEVEL_THRESHOLD = 5;
  // let check_e_light = (received) => {
  //   if (received["E_lightLVL"] < E_LIGHTLEVEL_THRESHOLD) {
  //     publishForSensor("e_light", "1");
  //     console.log("Light  --> ON");
  //   } else {
  //     publishForSensor("e_light", "0");
  //     console.log("Light  --> OFF");
  //   }
  // };


  // {
  //   "serialNumber": "hCsdkfjcx2",
  //   "paired": true,
  //   "T_temperature": 25,
  //   "E_temperature": 25,
  //   "E_co2": 450,
  //   "E_lightLVL": 80,
  //   "E_humidity": 30,
  //   "T_Waterlvl": 7.2,
  //   "T_PH": 6.8,
  //   "T_EC": 2400
  // }