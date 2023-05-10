import { SafeAreaView, StyleSheet, View, Text, Image } from "react-native";
import React, { Component, useState, useEffect } from "react";
import { SegmentedButtons } from "react-native-paper";

import CircularSlider from "rn-circular-slider";
import Toggle from "../../components/ToggleButton/ToggleButton";

import IOTservice from "../../constants/iot.service";

const fanIcon = require("../../assets/icons/roomDevice/window.png");

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

const Fans = ({ initialValue }) => {
  const [state, setState] = React.useState("");
  const [value, setValue] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 40, color: "#FFFFFF" }}>Fans</Text>
      </View>
      <SafeAreaView style={styles.selectionContainer}>
        <SegmentedButtons
          value={state}
          onValueChange={setState}
          buttons={[
            {
              value: "comfort",
              label: "Comfort",
              checkedColor: "#7E84ED",
              uncheckedColor: "#3FE3EB",
            },
            {
              value: "cool",
              label: "Cool",
              checkedColor: "#7E84ED",
              uncheckedColor: "#3FE3EB",
            },
            {
              value: "cold",
              label: "Cold",
              checkedColor: "#7E84ED",
              uncheckedColor: "#3FE3EB",
            },
          ]}
        />
      </SafeAreaView>
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
        <View style={styles.speed}>
          <Text style={{ fontSize: 30, color: "#3FE3EB" }}>Speed</Text>
          <Image
            source={fanIcon}
            style={{ marginLeft: 8, height: 40, width: 40 }}
          />
        </View>
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
  selectionContainer: {
    alignItems: "center",
    margin: 10,
  },
  header: {
    marginTop: 10,
    padding: 0,
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#FFFFFF",
    backgroundColor: "#3FE3EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  controller: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    alignItems: "center",
    marginTop: 15,
    padding: 30,
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
  speed: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default Fans;
