import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

const RoomTag = ({ imageSource, title, deviceNumber }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imagecontainer}>
        <Image style={styles.image} source={imageSource} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.device}>{deviceNumber} Devices</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "45%",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    height: 200,
    padding: 10,
    margin: 10,
  },
  imagecontainer: { height: 130 },
  title: { fontWeight: "bold" },
});

export default RoomTag;
