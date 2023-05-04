import { View, Text, Image } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { icons } from "../../assets";
import { HomeHeader, ControlHeader, Button } from "../../components";

import {
  LogInScreen,
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
          headerStyle: { height: 120, backgroundColor: "#2A2A37" },
          tabBarLabel: "Home",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.homeFocused : icons.homeIcon}
              style={{
                height: "70%",
                maxHeight: 50.67,
                width: "70%",
                maxWidth: 50.67,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Statics"
        component={StaticsScreen}
        options={{
          tabBarLabel: "Statics",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.staticsFocused : icons.staticsIcon}
              style={{
                height: "70%",
                maxHeight: 50.67,
                width: "70%",
                maxWidth: 50.67,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        options={{
          headerTitle: () => (
            <ControlHeader
              title="Control"
              subtitle="                                                                         "
            />
          ),
          headerStyle: {
            height: 120,
            backgroundColor: "#2A2A37",
          },
          tabBarLabel: "Control",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.controlFocused : icons.controlIcon}
              style={{
                height: "80%",
                maxHeight: 50.67,
                width: "80%",
                maxWidth: 50.67,
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
          tabBarLabel: "Setting",
          tabBarLabelStyle: { fontWeight: "bold", fontSize: 12 },
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.settingFocused : icons.settingIcon}
              style={{
                height: "70%",
                maxHeight: 50.67,
                width: "70%",
                maxWidth: 50.67,
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
