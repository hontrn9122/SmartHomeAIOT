import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LogInScreen from "./screens/LogIn/LogInScreen";
import MainContainer from "./screens/MainContainer/MainContainer";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"Login"}
      >
        <Stack.Screen name="Login" component={LogInScreen} />
        <Stack.Screen name="MainScreen" component={MainContainer} />
      </Stack.Navigator>
    </NavigationContainer>
    // <NavigationContainer stype={styles.container}>
    //   {logIn ? (
    //     <MainContainer setLogIn={setLogIn} />
    //   ) : (
    //     <LogInScreen setLogIn={setLogIn} />
    //   )}
    // </NavigationContainer>
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
