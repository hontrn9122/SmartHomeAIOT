import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

const Button = ({ onPress, text, type = "DEFAULT", bgColor, txtColor }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? { backgroundColor: bgColor } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          txtColor ? { color: txtColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF9900",

    width: "60%",

    padding: 15,
    marginVertical: 5,

    alignItems: "center",
    borderRadius: 7,
  },

  container_DEFAULT: {
    backgroundColor: "#FF9900",

    width: "60%",

    padding: 15,
    marginVertical: 5,

    alignItems: "center",
    borderRadius: 7,
  },

  text: {
    fontWeight: "bold",
    color: "white",
  },

  text_DEFAULT: {
    fontWeight: "bold",
    color: "white",
  },
});

export default Button;
