import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

import ToggleButton from "../ToggleButton/ToggleButton";
import { routine } from "../../assets";

const RoutineTag = ({ title, time, frequent, deviceNumber }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.toggle}>
          <ToggleButton initialValue={false} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.timeBox}>
          <View style={styles.timeContainer}>
            <Image style={styles.icon} source={routine.timeIcon} />
            <Text style={styles.timeStyle}>{time}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Image style={styles.icon} source={routine.frequentIcon} />
            <Text style={styles.frequentStyle}>{frequent}</Text>
          </View>
        </View>
        <View style={styles.deviceContainer}>
          <Text style={styles.device}>{deviceNumber} Devices</Text>
          <Image style={styles.icon} source={routine.gotoIcon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "94%",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    height: 150,
    padding: 10,
    margin: 10,
  },
  headerInfo: {
    borderColor: "#000",
    borderBottomWidth: 0.5,
    height: "40%",
    width: "100%",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
  },
  toggle: {},
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    width: "100%",
    padding: 5,
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 15,
    marginRight: 15,
  },
  timeBox: {},
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  timeStyle: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  frequentStyle: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  device: {
    color: "#AFAFAF",
    fontSize: 14,
  },
  icon: {
    width: 30.75,
    height: 30.75,
  },
  deviceContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default RoutineTag;
