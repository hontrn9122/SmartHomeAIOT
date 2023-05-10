import { StyleSheet, View, Text } from "react-native";
import React, { Component, useState, useEffect } from "react";

import CircularSlider from "rn-circular-slider";
import Toggle from "../../components/ToggleButton/ToggleButton";

import IOTservice from "../../constants/iot.service";

let lastRequestTime = 0;
let pendingRequest = null;

const handleFan = (data) => {
  const currentTime = Date.now();

  console.log(
    data,
    "-->",
    currentTime,
    "----",
    lastRequestTime,
    "---:",
    currentTime - lastRequestTime
  );
  if (currentTime - lastRequestTime >= 2000) {
    sendRequest(data);
    lastRequestTime = currentTime;
  } else {
    if (pendingRequest) {
      clearTimeout(pendingRequest);
    }

    pendingRequest = setTimeout(() => {
      sendRequest(data);
      lastRequestTime = Date.now();
      pendingRequest = null;
    }, 2000);
  }
};

const sendRequest = (data) => {
  IOTservice.control_fan(data);
};

const Fans = ({ state }) => {
  const [value, setValue] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 40 }}>Fans</Text>
      </View>
      <View style={styles.controller}>
        <CircularSlider
          step={1}
          min={0}
          max={100}
          value={value}
          onChange={(value) => {
            setValue(value);
            handleFan(value);
          }}
          contentContainerStyle={styles.contentContainerStyle}
          strokeWidth={15}
          buttonBorderColor="#3FE3EB"
          buttonFillColor="#fff"
          buttonStrokeWidth={10}
          openingRadian={Math.PI / 3}
          buttonRadius={10}
          linearGradient={[
            { stop: "0%", color: "#3FE3EB" },
            { stop: "100%", color: "#7E84ED" },
          ]}
        >
          <Text style={styles.value}>{value}</Text>
        </CircularSlider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",

    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  controller: {
    padding: 50,
  },
  contentContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontWeight: "500",
    fontSize: 32,
    color: "#3FE3EB",
  },
});

export default Fans;
