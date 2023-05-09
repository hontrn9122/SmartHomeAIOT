import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import React from "react";
import ToggleButton from "../ToggleButton/ToggleButton";

const SERVER_IP = "http://192.168.2.10";

const lightIcon = require("../../assets/icons/roomDevice/focusedLight.png");

const Light = ({ route }) => {
  const { item } = route.params;
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <SafeAreaView style={styles.tagcontainer}>
          {item.device.light.map((light, element) => (
            <LightTag key={element} element={element} light={light} />
          ))}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const handdleTurnOnLight = () => {
  fetch(`${SERVER_IP}:3000/light_on`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.text())
    .then((text) => console.log(text))
    .catch((error) => console.error("Error:", error));
};

const handdleTurnOffLight = () => {
  fetch(`${SERVER_IP}:3000/light_off`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.text())
    .then((text) => console.log(text))
    .catch((error) => console.error("Error:", error));
};

const LightTag = ({ element, light }) => {
  return (
    <View style={styles.lighttag}>
      <View style={styles.icon}>
        <Image source={lightIcon} />
      </View>
      <View style={styles.namecontain}>
        <Text style={styles.lightname}>Light {element + 1}</Text>
      </View>
      <View style={styles.toggle}>
        <ToggleButton
          trueState={handdleTurnOnLight}
          falseState={handdleTurnOffLight}
          initialValue={light}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  tagcontainer: {
    width: "100%",
    flex: 1,
    height: "100%",
  },
  lighttag: {
    flexDirection: "row",
    width: "90%",
    height: 100,
    marginTop: 15,
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: "center",

    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    height: "40%",
    width: "20%",
    padding: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  namecontain: {
    width: "50%",
    paddingLeft: 5,
  },
  lightname: {
    fontSize: 20,
    fontWeight: "bold",
  },
  toggle: {
    position: "absolute",
    right: 5,
    padding: 5,
  },
});

export default Light;
