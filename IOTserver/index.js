const express = require("express");
const mqtt = require("mqtt");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Adafruit IO credentials
const username = "thanhthien412";
const key = "aio_uguT767kjg6Fsfv9WRoOBavNMa57";

// Topics to subscribe to
const topics = [
  `${username}/feeds/room1-slash-light`,
  `${username}/feeds/heat`,
];

// Connect to Adafruit IO using MQTT
const client = mqtt.connect("mqtts://io.adafruit.com", {
  username: username,
  password: key,
});

client.on("connect", () => {
  console.log("Connected to Adafruit IO");

  // Subscribe to multiple topics
  client.subscribe(topics);
});

client.on("message", (topic, message) => {
  // Handle messages received on subscribed topics
  if (topics.includes(topic)) {
    console.log(`Received message on ${topic}: ${message}`);
  }
});

function light_on(res) {
  // Publish message to the specified topic
  client.publish(username + "/feeds/room1-slash-light", "1", {}, (err) => {
    if (err) {
      res.status(500).send(`Failed to publish message: ${err.message}`);
    } else {
      res.send(`Published state 1 to topic "room1-slash-light"`);
    }
  });
}

function light_off(res) {
  // Publish state to the room1-slash-light feed
  client.publish(username + "/feeds/room1-slash-light", "0", {}, (err) => {
    if (err) {
      res.status(500).send(`Failed to publish state: ${err.message}`);
    } else {
      res.send(`Published state 0 to topic "room1-slash-light"`);
    }
  });
}

function fan_control(req, res) {
  // Publish message to the specified topic
  client.publish(
    username + "/feeds/room1-slash-fan",
    req.body.data,
    {},
    (err) => {
      if (err) {
        res.status(500).send(`Failed to publish message: ${err.message}`);
      } else {
        res.send(`Published state ${req.body.data} to topic "room1-slash-fan"`);
      }
    }
  );
}

async function get_heat_data(res) {
  // Import the node-fetch module
  const fetch = (await import("node-fetch")).default;

  // Construct the URL for the feed
  const url = `https://io.adafruit.com/api/v2/${username}/feeds/heat/data?limit=10`;

  // Set the request headers
  const headers = {
    "X-AIO-Key": key,
  };

  try {
    // Send the GET request
    const response = await fetch(url, { headers });

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();
      res.json(data);
    } else {
      res.status(500).send(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    res.status(500).send(`An error occurred: ${err.message}`);
  }
}

async function get_heat_current(res) {
  // Import the node-fetch module
  const fetch = (await import("node-fetch")).default;

  // Construct the URL for the feed
  const url = `https://io.adafruit.com/api/v2/${username}/feeds/heat/data?limit=1`;

  // Set the request headers
  const headers = {
    "X-AIO-Key": key,
  };

  try {
    // Send the GET request
    const response = await fetch(url, { headers });

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();
      res.json(data);
    } else {
      res.status(500).send(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    res.status(500).send(`An error occurred: ${err.message}`);
  }
}

async function get_light_data(res) {
  // Import the node-fetch module
  const fetch = (await import("node-fetch")).default;

  // Construct the URL for the feed
  const url = `https://io.adafruit.com/api/v2/${username}/feeds/light/data?limit=1`;

  // Set the request headers
  const headers = {
    "X-AIO-Key": key,
  };

  try {
    // Send the GET request
    const response = await fetch(url, { headers });

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();
      res.json(data);
    } else {
      res.status(500).send(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    res.status(500).send(`An error occurred: ${err.message}`);
  }
}

// ----------------------------------- Light Toggle
app.post("/light_on", (req, res) => {
  light_on(res);
});

app.post("/light_off", (req, res) => {
  light_off(res);
});

// ----------------------------------- Fan Control
app.post("/fan_control", (req, res) => {
  fan_control(req, res);
});

// ----------------------------------- Heat and Light sensor
app.get("/get_heat_data", (req, res) => {
  get_heat_data(res);
});

app.get("/get_heat_current", (req, res) => {
  get_heat_current(res);
});

app.get("/get_light_data", (req, res) => {
  get_light_data(res);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
