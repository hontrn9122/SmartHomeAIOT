import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

const RoomTag = ({ imageSource, title, device }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imagecontainer}>
        <Image style={styles.image} source={imageSource} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.device}>{device.light.length + 3} Devices</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  imagecontainer: { height: 130 },
  title: { fontWeight: "bold" },
});

export default RoomTag;
