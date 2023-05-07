import { View, Text, Switch, StyleSheet } from "react-native";
import React, { useState } from "react";

const ToggleButton = ({ initialValue, trueState, falseState }) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (trueState != null && falseState != null) {
      isEnabled ? falseState() : trueState();
    }
  };
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#FF9900" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ToggleButton;
