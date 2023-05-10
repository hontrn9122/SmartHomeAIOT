import { Button, StyleSheet, Text, View, StatusBar, Alert } from "react-native";
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
    ProgressBar as PProgressBar,
    Snackbar as PSnackbar,
} from 'react-native-paper';

const arrow_back = require("../../assets/icons/faceRegister/arrow_back.png")
const apply = require("../../assets/icons/faceRegister/apply.png")
const camera_switch = require("../../assets/icons/faceRegister/camera_switch.png")

const FaceRegisterScreen = ({ navigation }) => {
    // define all the Hooks for this page
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camType, setCamType] = useState(CameraType.front);
    const [visible, setVisible] = useState(false);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [picCount, setPicCount] = useState(10);
    const [name, setName] = useState(null);
    const [ready, setReady] = useState(false);
    const [preventChange, setPreventChange] = useState(false);

    const cameraRef = useRef(null);

    useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
            if (!ready || picCount === 0) {
              return;
            }
    
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
            // Prompt the user before leaving the screen
            setPreventChange(true);
          }),
        [navigation, ready, picCount]
      );

    useEffect(() => {
        console.log(picCount)
        if (picCount === 0) {
            setVisible(true)
        }
    }, [picCount]);


    /////////////////// Helper Function ////////////////////

    const hideDialog = () => {
        setVisible(false)
        navigation.goBack()
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

    const onPressBack = () => {
        if (ready) {
            setPreventChange(true);
        }
        else {
            navigation.goBack()
        }
    };

    const switchCamera = () => {
        if (ready){
            setPreventChange(true);
        }
        else {
            setCamType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
        }
    };

    const applyName = async () => {
        if (name === null || name === '') {
            Alert.alert("Error!", "Please fill in ID name!", [
                { text: "OK" },
            ]);
            return;
        }
        else {
            console.log(name)
            const data = { 'name': name }

            await fetch('http://192.168.1.177:6868/faceapi/checkname', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.text())
                .then(data => {
                    if (data === 'Invalid') {
                        Alert.alert("Error!", "This ID name has already been taken!", [
                            { text: "OK" },
                        ]);
                        return;
                    }
                    else {
                        setReady(true)
                    }
                })
                .catch(error => {
                    console.log('Upload failed', error);
                });
        }
    }

    const onDetectFace = async (face) => {
        if (face.faces.length !== 0 && ready === true && isTakingPhoto === false && picCount > 0) {
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
    };

    const handleFileUpload = async (uri) => {
        const formData = new FormData();
        formData.append("file", {
            uri: uri,
            name: "image.jpg",
            type: "image/jpeg",
        });
        formData.append("name", name)
        formData.append("count", 10 - picCount)
        await fetch('http://192.168.1.177:6868/faceapi/register', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(data => {
                if (data === "Successful") {
                    setPicCount(prevPicCount => prevPicCount - 1)
                }
                setIsTakingPhoto(false)
            })
            .catch(error => {
                console.log('Upload failed', error);
            });
    };

    return (
        <PProvider>
            <View style={ready ? styles.subcontainer_ready : styles.subcontainer}>
                <View style={styles.header}>
                    <PIconButton
                        icon={arrow_back}
                        iconColor={ready ? '#2A2A37' : 'white'}
                        size={20}
                        onPress={onPressBack}
                    />
                    <Text
                        style={{
                            color: ready ? '#2A2A37' : 'white',
                            fontSize: 14,
                            // paddingRight: '32%'
                        }}
                    >FaceID Registration</Text>
                    <PIconButton
                        icon={camera_switch}
                        iconColor={ready ? '#2A2A37' : 'white'}
                        size={20}
                        onPress={switchCamera}
                    />
                </View>
                <View style={styles.nameInput}>
                    <PTextInput
                        label="ID name"
                        value={name}
                        onChangeText={name => setName(name)}
                        disabled={ready}
                        // mode='outlined'
                        // outlineColor="#2A2A37"
                        // activeOutlineColor="#FF9900"
                        underlineColor="#2A2A37"
                        activeUnderlineColor="#FF9900"
                        style={{ width: '80%', backgroundColor: "#FFFFFF" }}
                    />
                    <PIconButton
                        icon={apply}
                        iconColor='white'
                        disabled={ready}
                        size={30}
                        onPress={applyName}
                        containerColor='#FF9900'
                    />

                </View>
            </View>
            <View style={styles.container}>
                <Camera
                    style={styles.camera}
                    type={camType}
                    onFacesDetected={onDetectFace}
                    ref={cameraRef}
                >
                    <View >
                        <PProgressBar animatedValue={(10 - picCount) / 10} color="#FF9900" />
                    </View>
                    <PPortal>
                        <PDialog visible={visible}  dismissable={false} style={{ backgroundColor: 'white' }}>
                            <PDialog.Title style={{ color: "#FF9900", textAlign: 'center' }}>Successful</PDialog.Title>
                            <PDialog.Content>
                                <Text style={{ color: "#2A2A37"}}>
                                    {'FaceID of ' + name + ' has been added and ready to be used!'}
                                </Text>
                            </PDialog.Content>
                            <PDialog.Actions>
                                <PButton textColor={"#FF9900"} onPress={hideDialog}>Done</PButton>
                            </PDialog.Actions>
                        </PDialog>
                    </PPortal>
                </Camera>
                <PSnackbar
                    visible={preventChange}
                    onDismiss={() => {
                        setPreventChange(false)
                    }}
                    action={{
                        label: 'OK',
                        onPress: () => {
                            setPreventChange(false)
                        },
                    }}
                    duration={2000}
                    style={{backgroundColor: '#2A2A37'}}
                >
                    Registration is on progress. Wait until it is finish!
                </PSnackbar>
            </View>
        </PProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    subcontainer: {
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2A2A37',
        paddingTop: StatusBar.currentHeight + 15,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 15,
    },
    subcontainer_ready: {
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: StatusBar.currentHeight + 15,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 15,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameInput: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 5
    },
    camera: {
        flex: 1,
    },
    progressBarContainer: {
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
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0553',
    },
});

export default FaceRegisterScreen;