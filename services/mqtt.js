const mqtt = require("mqtt");
const { Data } = require("../models/data");
const { Farm } = require("../models/farm");

async function saveSensorData(receivedData) {
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
    } = receivedData;

    // Find the farm with the provided serialNumber
    const farm = await Farm.findOne({ serialNumber });
    if (!farm) {
      throw new Error(`Farm with serial number ${serialNumber} not found`);
    }

    // Update the farm document with the latest sensor data
    await Data.updateOne(
      { serialNumber },
      {
        $set: {
          paired,
          T_temperature: T_temperature,
          E_temperature: E_temperature,
          E_co2: E_co2,
          E_lightLVL: E_lightLVL,
          E_humidity: E_humidity,
          T_Waterlvl: T_Waterlvl,
          T_PH: T_PH,
          T_EC: T_EC,
        },
      },
      { upsert: true }
    );

    console.log(
      `Sensor data saved successfully for serial number ${serialNumber}`
    );
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

  //The fan is set to ON when the recived E_humidity or E_temperature exceeds the threshold
  const E_HUMIDITY_THRESHOLD = 60;
  const E_TEMPERATURE_THRESHOLD = 27;
  let check_e_fan = (receivedData) => {
    if (
      receivedData["E_humidity"] > E_HUMIDITY_THRESHOLD ||
      receivedData["E_temperature"] > E_TEMPERATURE_THRESHOLD
    ) {
      publishForSensor(`e_fan/${receivedData.serialNumber}`, "1");
      console.log("Fan        --> ON");
    } else {
      publishForSensor(`e_fan/${receivedData.serialNumber}`, "0");
      console.log("Fan        --> OFF");
    }
  };

  // The valve is set to ON when the recived T_Waterlvl exceeds the threshold
  const T_WATERLEVEL_THRESHOLD = 5;
  let check_t_valve = (receivedData) => {
    if (receivedData["T_Waterlvl"] < T_WATERLEVEL_THRESHOLD) {
      publishForSensor(`t_valve/${receivedData.serialNumber}`, "1");
      console.log("Valve      --> ON");
    } else {
      publishForSensor(`t_valve/${receivedData.serialNumber}`, "0");
      console.log("Valve      --> OFF");
    }
  };

  let pump1Time = 0;
  let pump2Time = 0;

  function handlePumps(receivedData) {
    const currentTime = new Date().getTime();

    // Check the value of T_EC
    if (receivedData["T_EC"] > 2000) {
      // If T_EC is greater than 2000, publish '1' on topic 'pump3'
      client.publish(`pump3/${receivedData.serialNumber}`, "1");
      console.log("Pump 3     --> ON");
    } else {
      client.publish(`pump3/${receivedData.serialNumber}`, "0");
      console.log("Pump 3     --> OFF");
    }

    // Check the value of T_PH
    if (receivedData["T_PH"] < 5) {
      // If T_PH is less than 5, check if 5 minutes have passed since the last time we published to pump1
      if (currentTime - pump1Time >= 5 * 60 * 1000) {
        // If 5 minutes have passed, publish '1' on topic 'pump1' and update the pump1Time variable
        client.publish(`pump1/${receivedData.serialNumber}`, "1");
        console.log("Pump 1     --> ON");
        console.log("Pump 2     --> OFF");
        pump1Time = currentTime;
      } else {
        client.publish(`pump1/${receivedData.serialNumber}`, "0");
        client.publish(`pump2/${receivedData.serialNumber}`, "0");
        console.log("Pump 1     --> OFF");
        console.log("Pump 2     --> OFF");
      }
    } else if (receivedData["T_PH"] > 6) {
      // If T_PH is greater than 6, check if 5 minutes have passed since the last time we published to pump2
      if (currentTime - pump2Time >= 5 * 60 * 1000) {
        // If 5 minutes have passed, publish '1' on topic 'pump2' and update the pump2Time variable
        client.publish(`pump2/${receivedData.serialNumber}`, "1");
        console.log("Pump 2     --> ON");
        console.log("Pump 1     --> OFF");
        pump2Time = currentTime;
      } else {
        client.publish(`pump1/${receivedData.serialNumber}`, "0");
        client.publish(`pump2/${receivedData.serialNumber}`, "0");
        console.log("Pump 1     --> OFF");
        console.log("Pump 2     --> OFF");
      }
    } else {
      client.publish(`pump1/${receivedData.serialNumber}`, "0");
      client.publish(`pump2/${receivedData.serialNumber}`, "0");
      console.log("Pump 1 and Pump 2   --> OFF");
    }
  }

  // Pump Logic

  function tPumpOperation(receivedData) {
    let isPumpOn = false;
  
    function turnOffPump() {
      client.publish(`t_pump/${receivedData.serialNumber}`, "0", { qos: 1 }, (err) => {
        if (err) {
          console.error("Error publishing '0':", err);
        } else {
          console.log("Pump      --> OFF");
          isPumpOn = false;
        }
      });
    }
  
    function turnOnPump() {
      client.publish(`t_pump/${receivedData.serialNumber}`, "1", { qos: 1 }, (err) => {
        if (err) {
          console.error("Error publishing '1':", err);
        } else {
          console.log("Pump      --> ON");
          isPumpOn = true;
        }
      });
    }
  
    turnOnPump();
  
    setTimeout(() => {
      turnOffPump();
    }, 120000);
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
      let receivedData = JSON.parse(message);
      console.log("===================================================");
      console.log("                     AUTOMATIC");
      console.log("===================================================");
      console.log(`                     ${receivedData.serialNumber}`);

      // The t_pump and t_air, and e_light are always ON
      // publishForSensor(`t_pump/${receivedData.serialNumber}`, "1");
      // console.log("Tank Pump  --> ON");

      publishForSensor(`t_air/${receivedData.serialNumber}`, "1");
      console.log("Air Tank   --> ON");

      publishForSensor(`e_light/${receivedData.serialNumber}`, "1");
      console.log("Light   --> ON");

      check_e_fan(receivedData);
      check_t_valve(receivedData);
      handlePumps(receivedData);
      //tPumpOperation(receivedData);
      //checkLightStatus(receivedData);
      console.log(receivedData);
      saveSensorData(receivedData);
    });
  }

  function publishForSensor(topic, data) {
    client.publish(topic, data);
  }

  subscribeToMainTopic("hyrda-main");
}

module.exports = { initializeMQTT };

// Example of published sensors data for a farm
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

//remove old data each period of time from data collection
// async function removeOldData(receivedData) {
//   try {
//     const currentTime = new Date();
//     const sevenMinutesAgo = new Date(currentTime.getTime() - 7 * 60 * 1000);

//     const result = await Data.deleteMany({
//       createdAt: { $lte: sevenMinutesAgo },
//       serialNumber: receivedData.serialNumber,
//     });
//     console.log(`${result.deletedCount} documents removed for serial number ${receivedData.serialNumber}`);
//   } catch (error) {
//     console.error("Error removing old data:", error);
//   }
// }
