import { View, Text, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
// import axios from 'axios';
// import * as Speech from "expo-speech";

import { Button } from "../../components";
import IOTservice from "../../constants/iot.service";

const SERVER_IP = "http://192.168.2.10";

const implementCommand = (command) => {
  console.log("let go");
  for (cmd in command) {
    console.log("command: ---> ", command[cmd]);
    if (command[cmd] == "turn on the light") {
      console.log("light on");
      setTimeout(() => {
        IOTservice.light_on();
      }, 2000);
    } else if (command[cmd] == "turn off the light") {
      setTimeout(() => {
        IOTservice.light_off();
      }, 2000);
    } else if (command[cmd] == "turn on the fan") {
      setTimeout(() => {
        IOTservice.control_fan(50);
      }, 2000);
    } else if (command[cmd] == "turn off the fan") {
      setTimeout(() => {
        IOTservice.control_fan(0);
      }, 2000);
    }
  }
};

const SettingScreen = () => {
  const navigation = useNavigation();

  const [recording, setRecording] = useState();
  const [command, setCommand] = useState(["none"]);

  // const speak = () => {
  //   Speech.speak(text);
  // };

  // Test sound by this
  const [sound, setSound] = useState();

  const playRecording = async (uri) => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync();
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: ".mp4",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);

      // Upload the recorded audio file to a server
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: "hehe.mp4",
        type: "application/octet-stream",
      });

      console.log("Uploading...");
      // playRecording(uri);

      const response = await fetch(`${SERVER_IP}:5000/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Get the response text
      const responseText = await response.json();

      // Store the command
      setCommand(responseText);
      console.log("testing: ", responseText);
      implementCommand(responseText);

      // Handle server response
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const onLogOutPressed = () => {
    navigation.navigate("Login");
  };

  const onFaceRegistrationPressed = () => {
    navigation.navigate("FaceRegisterScreen")
  };

  return (
    <View>
      <Text>SettingScreen</Text>
      <Button text="Log out" onPress={onLogOutPressed} />
      {/* <TextInput
        onChangeText={setText}
        value={text}
        placeholder="Enter text to speak"
      />
      <Button onPress={speak} text="Speak" /> */}
      <Button
        onPress={recording ? stopRecording : startRecording}
        text={recording ? "Stop Recording" : "Start Recording"}
      />
      <View>
        {command.map((item, element) => {
          return <Text key={element}>{item}</Text>;
        })}
      </View>
      <Button
        onPress={onFaceRegistrationPressed}
        text={"Register new FaceID"}
      />
    </View>
  );
};

export default SettingScreen;
