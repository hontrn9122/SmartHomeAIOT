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

const lightIcon = require("../../assets/icons/roomDevice/focusedLight.png");

const Light = ({ route }) => {
  const { item } = route.params;
  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          borderWidth: 5,
          borderColor: "blue",
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

const LightTag = ({ element, light }) => {
  return (
    <View style={styles.lighttag}>
      <View style={styles.icon}>
        <Image source={lightIcon} />
      </View>
      <View style={styles.namecontain}>
        <Text style={styles.lightname}>Light {element + 1}</Text>
      </View>
      <ToggleButton initialValue={light} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 10,
    width: "100%",
  },
  tagcontainer: {
    flex: 1,
    borderWidth: 2,
  },
  lighttag: {
    flexDirection: "row",
    width: "90%",
    height: "15%",
    marginTop: 15,
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: "center",

    borderWidth: 1,
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
    width: "60%",
    paddingLeft: 5,
    borderWidth: 1,
  },
  lightname: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Light;
