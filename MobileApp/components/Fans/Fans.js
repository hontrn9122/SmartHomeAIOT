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

const createFanInterval = (value, time) => {
  handleFan(value)
  return setInterval(() => {handleFan(value)}, time)
}

const sendRequest = (data) => {
  IOTservice.control_fan(data);
};

const Fans = ({ initialValue }) => {
  const [state, setState] = React.useState("manual");
  const [value, setValue] = useState(0);

  // Hook to handle fan mode
  useEffect(() => {
    var id = {'interval': [], 'timeout': []}
    if (state === "comfort"){
      // comfort: [80% in 5s, 50% in 10s, 20% in 5s, 50% in 10s]
      // => len for 1 loop: 30s

      handleFan(80);
      id.interval.push(setInterval(() => {handleFan(80)}, 30000));

      id.timeout.push(setTimeout(() => {
        handleFan(50);
        id.interval.push(setInterval(() => {handleFan(20)},15000)); 
      }, 5000))

      id.timeout.push(setTimeout(() => {
        handleFan(20);
        id.interval.push(setInterval(() => {handleFan(50)}, 30000)); 
      }, 15000))

    }
    else if (state === "cool") {
      // cool: [100% in 10s, 80% in 20s, 50% in 10s]
      // => len for one loop: 40s
      
      handleFan(100);
      id.interval.push(setInterval(() => {handleFan(100)}, 40000));

      id.timeout.push(setTimeout(() => {
        handleFan(80);
        id.interval.push(setInterval(() => {handleFan(80)}, 40000)); 
      }, 10000))

      id.timeout.push(setTimeout(() => {
        handleFan(50);
        id.interval.push(setInterval(() => {handleFan(50)}, 40000)); 
      }, 30000))

    }
    else if (state === 'powerful') {
      // cool: [100% in 20s, 80% in 10s]
      // => len for one loop: 30s

      handleFan(100);
      id.interval.push(setInterval(() => {handleFan(100)}, 30000));

      id.timeout.push(setTimeout(() => {
        handleFan(80);
        id.interval.push(setInterval(() => {handleFan(80)}, 30000)); 
      }, 20000))
    }

    return () => {
      for (let i = 0; i < id.interval.length; i++) {
        clearInterval(id.interval[i]);
      }
      for (let i = 0; i < id.timeout.length; i++) {
        clearTimeout(id.timeout[i]);
      }
    }
  }, [state])

  const handleButtonPress = (mode) => {
    if (state === mode) {
      setState("manual");
      handleFan(value);
    }
    else setState(mode);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 30, color: "#FF9900" }}>Fans</Text>
      </View>
      <View style={styles.controller}>
        <CircularSlider
          step={1}
          min={0}
          max={100}
          value={value}
          onChange={(value) => {
            setState("manual");
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
          <Text style={styles.value}>{state === 'manual' ? value : "Auto"}</Text>
        </CircularSlider>
        <View style={styles.speed}>
          <Text style={{ fontSize: 30, color: "#3FE3EB" }}>Speed</Text>
          <Image
            source={fanIcon}
            style={{ marginLeft: 8, height: 40, width: 40 }}
          />
        </View>
      </View>
      <SafeAreaView style={styles.selectionContainer}>
        <SegmentedButtons
          value={state}
          onValueChange={() => { }}
          buttons={[
            {
              value: "comfort",
              label: "Comfort",
              checkedColor: "#7E84ED",
              uncheckedColor: "#FF9900",
              onPress: () => { handleButtonPress("comfort") },
            },
            {
              value: "cool",
              label: "Cool",
              checkedColor: "#7E84ED",
              uncheckedColor: "#FF9900",
              onPress: () => { handleButtonPress("cool") },
            },
            {
              value: "powerful",
              label: "Powerful",
              checkedColor: "#7E84ED",
              uncheckedColor: "#FF9900",
              onPress: () => { handleButtonPress("powerful") },
            },
          ]}
        />
      </SafeAreaView>
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
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    marginTop: 10,
    padding: 0,
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    // borderWidth: 1,
    // borderRadius: 10,
    // borderColor: "#FFFFFF",
    // backgroundColor: "#3FE3EB",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
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
