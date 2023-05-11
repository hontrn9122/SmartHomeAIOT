import { View, Text, Image } from "react-native";
import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { icons } from "../../assets";
import { HomeHeader, ControlHeader, Button } from "../../components";

import {
  HomeScreen,
  RoomScreen,
  RoutineScreen,
  ControlScreen,
  StaticsScreen,
  SettingScreen,
} from "../index.js";

const Tab = createBottomTabNavigator();

const MainContainer = ({ setLogIn }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { height: "10%", maxHeight: 130 },
        tabBarActiveTintColor: "#FF9900",
        tabBarStyle: { height: "12%" },
      }}
      barStyle={{ paddingBottom: 48 }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <HomeHeader
              title="Your Home"
              subtitle="VNU - Ho Chi Minh University of Technology"
            />
          ),
          headerStyle: { height: 150, backgroundColor: "#2A2A37" },
          tabBarLabel: "Home",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.homeFocused : icons.homeIcon}
              style={{
                height: "70%",
                maxHeight: 40,
                width: "70%",
                maxWidth: 40,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Statics"
        component={StaticsScreen}
        options={{
          headerTitle: () => <ControlHeader title="Statistics" subtitle="" />,
          headerStyle: {
            height: 150,
            backgroundColor: "#2A2A37",
          },
          tabBarLabel: "Statistics",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.staticsFocused : icons.staticsIcon}
              style={{
                height: "80%",
                maxHeight: 40,
                width: "80%",
                maxWidth: 40,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        options={{
          headerTitle: () => <ControlHeader title="Control" subtitle="" />,
          headerStyle: {
            height: 150,
            backgroundColor: "#2A2A37",
          },
          tabBarLabel: "Control",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.controlFocused : icons.controlIcon}
              style={{
                height: "80%",
                maxHeight: 40,
                width: "80%",
                maxWidth: 40,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        initialParams={{ setLogIn: setLogIn }}
        options={{
          headerTitle: () => (
            <ControlHeader
              title="Setting"
              subtitle="You can control AI model here"
            />
          ),
          headerStyle: {
            height: 150,
            backgroundColor: "#2A2A37",
          },
          tabBarLabel: "Setting",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.settingFocused : icons.settingIcon}
              style={{
                height: "70%",
                maxHeight: 43,
                width: "70%",
                maxWidth: 40,
              }}
            />
          ),
        }}
      />
      {/* {(setLogIn, a) => <SettingScreen />} */}
    </Tab.Navigator>
  );
};

export default MainContainer;
