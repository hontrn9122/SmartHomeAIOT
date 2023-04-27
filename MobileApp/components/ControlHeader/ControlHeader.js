import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

const avatar = require("../../assets/images/avatar.jpg");

const ControlHeader = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.address}>{subtitle}</Text>
      <Image style={styles.avatars} source={avatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 10,
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#FFFFFF",
  },
  address: {
    color: "#FFFFFF",
  },
  avatars: {
    position: "absolute",
    right: -75,
    top: 10,
    height: 60,
    width: 60,
    borderRadius: 40,
  },
});

export default ControlHeader;
