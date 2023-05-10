import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen, FaceVerificationScreen, UnlockDoorScreen } from "./screens"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"HomeScreen"}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="FaceVerificationScreen" component={FaceVerificationScreen} />
        <Stack.Screen name="UnlockDoorScreen" component={UnlockDoorScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}