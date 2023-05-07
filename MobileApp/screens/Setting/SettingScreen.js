import { View, Text, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
// import * as Speech from "expo-speech";

import { Button } from "../../components";

const SettingScreen = () => {
  const navigation = useNavigation();

  const [recording, setRecording] = useState();

  // const [text, setText] = useState("");

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
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WAVE,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
        },
        ios: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
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
        uri,
        name: "recording.wav",
        type: "audio/wav",
      });

      console.log("Uploading...");
      console.log(formData);
      playRecording(uri);

      const response = await fetch("http://192.168.2.10:5000/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Get the response text
      const responseText = await response.json();
      console.log("testing: ", responseText);

      // Handle server response
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const onLogOutPressed = () => {
    navigation.navigate("Login");
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
