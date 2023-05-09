import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import Light from "../../components/Light/Light";
import Thermostat from "../../components/Thermostat/Thermostat";
import Fridge from "../../components/Fridge/Fridge";
import Fans from "../../components/Fans/Fans";
import Speaker from "../../components/Speaker/Speaker";

const Tab = createMaterialBottomTabNavigator();

import { roomDevice } from "../../assets";
const backIcon = require("../../assets/images/backIcon.png");
const addIcon = require("../../assets/images/whiteplus.png");

const RoomScreen = ({ item, goBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goback} onPress={goBack}>
          <Image style={styles.gobackbutton} source={backIcon} />
        </TouchableOpacity>
        <View style={styles.headercontent}>
          <Text style={styles.roomName}>{item.title}</Text>
        </View>
        <TouchableOpacity style={styles.goback}>
          <Image style={styles.addbutton} source={addIcon} />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        initialRouteName="Light"
        screenOptions={{
          tabBarStyle: { height: "10%", maxHeight: 130 },
          tabBarActiveTintColor: "#FF9900",
          tabBarStyle: { height: 75 },
        }}
      >
        <Tab.Screen
          name="Light"
          component={Light}
          initialParams={{ item: item }}
          options={{
            tabBarLabelStyle: { fontWeight: "bold", fontSize: 10 },
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? roomDevice.focusedLight : roomDevice.light}
                style={{
                  height: "100%",
                  maxHeight: 25,
                  width: "100%",
                  maxWidth: 25,
                  alignSelf: "center",
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Thermostat"
          component={Thermostat}
          options={{
            tabBarLabelStyle: { fontWeight: "bold", fontSize: 10 },
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused ? roomDevice.focusedThermostat : roomDevice.thermostat
                }
                style={{
                  height: "100%",
                  maxHeight: 25,
                  width: "50%",
                  maxWidth: 13,
                  alignSelf: "center",
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Fridge"
          component={Fridge}
          options={{
            tabBarLabelStyle: { fontWeight: "bold", fontSize: 10 },
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? roomDevice.focusedFridge : roomDevice.fridge}
                style={{
                  height: "100%",
                  maxHeight: 25,
                  width: "80%",
                  maxWidth: 20,
                  alignSelf: "center",
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Fans"
          component={Fans}
          options={{
            tabBarLabelStyle: { fontWeight: "bold", fontSize: 10 },
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? roomDevice.focusedFan : roomDevice.fan}
                style={{
                  height: "100%",
                  maxHeight: 25,
                  width: "100%",
                  maxWidth: 25,
                  alignSelf: "center",
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Speaker"
          component={Speaker}
          options={{
            tabBarLabelStyle: { fontWeight: "bold", fontSize: 10 },
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused ? roomDevice.focusedSpeaker : roomDevice.speaker
                }
                style={{
                  height: "100%",
                  maxHeight: 25,
                  width: "78%",
                  maxWidth: 20,
                  alignSelf: "center",
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: "6%",
    flexDirection: "row",
    backgroundColor: "#2A2A37",
  },
  goback: {
    height: "100%",
    width: "11%",
    justifyContent: "center",
    alignItems: "center",
  },
  gobackbutton: {
    height: 20,
    width: 13,
  },
  addbutton: {
    height: 30,
    width: 20,
  },
  headercontent: {
    height: "100%",
    width: "78%",
    justifyContent: "center",
    alignItems: "center",
  },
  roomName: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 25,
  },
});

export default RoomScreen;
