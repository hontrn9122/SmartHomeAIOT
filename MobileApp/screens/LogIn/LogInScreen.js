import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";

import Logo from "../../assets/images/logo.png";
import LoginBackground from "../../assets/images/loginbackground.png";
import LogoName from "../../assets/images/logoname.png";

import { UserInput, Button } from "../../components";

const LogInScreen = ({ setLogIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogInPressed = () => {
    setLogIn(true);
  };

  const onCreateResident = () => {
    console.warn("New Resident!");
  };

  return (
    <ImageBackground
      source={LoginBackground}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <Image source={LogoName} style={styles.logoname} resizeMode="contain" />
      <UserInput
        placeholder="Username"
        value={username}
        setValue={setUsername}
      />
      <UserInput
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={true}
      />

      <Button text="Enter Your House" onPress={onLogInPressed} />
      <Button
        text="New Resident"
        bgColor="#2A2A37"
        onPress={onCreateResident}
      />

      <Text style={{}}>Forgot password? Click here</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    backgroundColor: "#A52A2A",
    width: "100%",
    height: "100%",
    paddingTop: 100,
  },

  backgroundImage: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    width: "100%",
    height: "103%",
  },

  logo: {
    width: "60%",
    maxWidth: 175.97,
    height: "60%",
    maxHeight: 197.35,
  },
  logoname: {
    width: "60%",
    maxWidth: 251,
    height: "60%",
    maxHeight: 48,
  },
});

export default LogInScreen;
