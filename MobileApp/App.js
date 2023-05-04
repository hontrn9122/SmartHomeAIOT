import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LogInScreen, MainContainer } from "./screens/";

const Stack = createNativeStackNavigator();

export default function App() {
  const [logIn, setLogIn] = useState(false);
  return (
    <NavigationContainer stype={styles.container}>
      {logIn ? (
        <MainContainer setLogIn={setLogIn} />
      ) : (
        <LogInScreen setLogIn={setLogIn} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7FFFD4",
    alignItems: "center",
    justifyContent: "center",
  },
});
