var mqtt = require('mqtt');

var options = {
    host: process.env.HOST,
    port: process.env.MQTTPORT,
    protocol: process.env.PROTOCOL,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
}

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message: from', topic);
    console.log(message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe('Temp');

// publish message 'Hello' to topic 'my/test/topic'
//client.publish('Temp', 'Hello from node.js');



//////////////////////////////////////////////////////////////////////


// Define a function for subscribing to a topic for a user
function subscribeForUser(username) {
  const topicPrefix = `my-farm/temperature/${username}/`;
  const topicFilter = `${topicPrefix}+`;
  client.subscribe(topicFilter, (error) => {
    if (error) {
      console.log(`Error subscribing to topic filter "${topicFilter}": ${error}`);
    } else {
      console.log(`Subscribed to topic filter "${topicFilter}"`);
    }
  });
}

// Define a function for publishing data for a user's sensor
// function publishForSensor(username, sensorId, data) {
//   const topic = `my-farm/temperature/${username}/${sensorId}`;
//   client.publish(topic, data);
//   console.log("Published Data.");
// }

// Subscribe to the "my-farm/temperature/+" topic to receive data from all sensors
client.subscribe('my-farm/temperature/+', (error) => {
  if (error) {
    console.log(`Error subscribing to topic "my-farm/temperature/+": ${error}`);
  } else {
    console.log('Subscribed to topic "my-farm/temperature/+"');
  }
});

// Subscribe to the "my-farm/temperature/mohamed/+" topic to receive data from Jane's sensors
subscribeForUser('mohamed');

// Publish some data for Mohamed's sensor1
//publishForSensor('mohamed', 'sensor1', '25.0');

// Publish some data for Mohamed's sensor2
//publishForSensor('mohamed', 'sensor2', '26.5');

function publishTemperature(username, sensorId, temperature) {
    const topic = `my-farm/temperature/${username}/${sensorId}`;
    const message = temperature;
    client.publish(topic, JSON.stringify(message), { qos: 1 }, (error) => {
      if (error) {
        console.log(`Error publishing message on topic "${topic}": ${error}`);
      } else {
        console.log(`Published message on topic "${topic}": ${JSON.stringify(message)}`);
      }
    });
  }
  
  // Publish temperature data for mohamed's sensor1
  publishTemperature('mohamed', 'sensor1', 19.5);