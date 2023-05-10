const SERVER_IP = "http://192.168.2.10";

const light_on = () => {
  fetch(`${SERVER_IP}:3000/light_on`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.text())
    .then((text) => console.log(text))
    .catch((error) => console.error("Error:", error));
};

const light_off = () => {
  fetch(`${SERVER_IP}:3000/light_off`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.text())
    .then((text) => console.log(text))
    .catch((error) => console.error("Error:", error));
};

const control_fan = (data) => {
  fetch(`${SERVER_IP}:3000/fan_control`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: String(data) }),
  })
    .then((response) => response.text())
    .then((text) => console.log(text))
    .catch((error) => console.error("Error:", error));
};

const get_heat_data = async () => {
  try {
    // Send the GET request to the /get_heat_data endpoint
    const response = await fetch(`${SERVER_IP}:3000/get_heat_data`);

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Handle the data here
      // console.log(data);
      return data;
    } else {
      console.error(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
};

const get_current_heat = async () => {
  try {
    // Send the GET request to the /get_heat_data endpoint
    const response = await fetch(`${SERVER_IP}:3000/get_heat_current`);

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Handle the data here
      // console.log(data);
      return data;
    } else {
      console.error(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
};

const get_light_data = async () => {
  try {
    // Send the GET request to the /get_light_data endpoint
    const response = await fetch(`${SERVER_IP}:3000/get_light_data`);

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Handle the data here
      // console.log("test light data", data);
      return data;
    } else {
      console.error(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
};

const IOTservice = {
  light_on,
  light_off,
  control_fan,
  get_heat_data,
  get_current_heat,
  get_light_data,
};

export default IOTservice;
