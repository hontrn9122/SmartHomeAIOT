import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Fridge = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 35, color: "#FF9900" }}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Fridge;
