import { Button, StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraType } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {
  Button as PButton,
  Dialog as PDialog,
  Portal as PPortal,
  Provider as PProvider,
  TextInput as PTextInput,
  IconButton as PIconButton,
  HelperText as PHelperText,
  Switch as PSwitch,
} from 'react-native-paper';
import { arrow_back, camera_switch } from "../constants/icons";


const FaceVerificationScreen = ({navigation}) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camType, setCamType] = useState(CameraType.front);
  const [status, setStatus] = useState('No face detected')
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const cameraRef = useRef(null);
  // const [isFaceDetected, setIsFaceDetected] = useState(false);

  const switchCamera = () => {
    setCamType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const onDetectFace = async (face) => {
    if (face.faces.length !== 0 && isTakingPhoto === false) {
      console.log("sending")
      setIsTakingPhoto(true)
      const result = await cameraRef.current.takePictureAsync(base64 = false, quality = 1)
      const crop_img = await manipulateAsync(
        result.uri,
        [{ resize: { width: 480, height: 640 } }],
        { format: SaveFormat.JPEG }
      );
      // console.log(crop_img)
      await handleFileUpload(crop_img.uri)
    }
    else if (face.faces.length === 0) {
      setStatus("No face is detected!")
      // setIsFaceDetected(false)
    }
  };

  const handleFileUpload = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      name: "image.jpg",
      type: "image/jpeg",
    });
    await fetch('http://192.168.1.177:6868/faceapi/verify', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(data => {
        if (data === "Failed") {
          setStatus("No face is detected!")
          // setIsFaceDetected(false)
        }
        else if (data === "Unknown") {
          setStatus("Unverified identity!")
          // setIsFaceDetected(true)
        }
        else {
          setStatus("Welcome " + data)
          // setIsFaceDetected(true)
        }
        // setIsFaceDetected(true)
        setIsTakingPhoto(false)
      })
      .catch(error => {
        console.log('Upload failed', error);
        setIsTakingPhoto(false)
      });
  };

  return (
    <PProvider>
      <View style={styles.subcontainer}>
        <PIconButton
          icon={arrow_back}
          iconColor={'white'}
          size={20}
          onPress={() => {navigation.goBack()}}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 14,
          }}
        >FaceID Verification Demo</Text>
        <PIconButton
          icon={camera_switch}
          iconColor={'white'}
          size={20}
          onPress={switchCamera}
        />
      </View>
      <View style={styles.container}>
        <Camera style={styles.camera} type={camType} onFacesDetected={onDetectFace} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Text style={styles.text}>{status}</Text>
            </View>
          </View>
        </Camera>
      </View>
    </PProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  subcontainer: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A37',
    paddingTop: StatusBar.currentHeight + 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default FaceVerificationScreen