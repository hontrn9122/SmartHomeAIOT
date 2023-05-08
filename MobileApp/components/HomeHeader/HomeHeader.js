import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

const avatar = require("../../assets/images/avatar.jpg");

const HomeHeader = ({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.namecontainer}>
        <Text style={styles.title}>{title}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.address}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.avatars}>
        <Image style={styles.image} source={avatar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 5,
    padding: 10,
    minWidth: "100%",
  },
  namecontainer: {
    width: "80%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#FFFFFF",
  },
  address: {
    color: "#FFFFFF",
  },
  avatars: {
    width: "20%",
    position: "absolute",
    right: 5,
    top: 10,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 40,
  },
});

export default HomeHeader;
