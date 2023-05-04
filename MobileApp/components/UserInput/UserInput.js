import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";

const UserInput = ({ value, setValue, placeholder, secureTextEntry }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderBottomColor: "#000000",
    borderBottomWidth: 1,

    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {},
});

export default UserInput;
