import { View, Text, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
// import * as Speech from "expo-speech";

import { Button } from "../../components";

const SettingScreen = ({ route }) => {
  const [recording, setRecording] = useState();
  // const [text, setText] = useState("");

  // const speak = () => {
  //   Speech.speak(text);
  // };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
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
        uri,
        name: "recording.m4a",
        type: "audio/m4a",
      });

      const response = await fetch("<URL>", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle server response
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const { setLogIn } = route.params;
  const onLogOutPressed = () => {
    setLogIn(false);
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
    </View>
  );
};

export default SettingScreen;
