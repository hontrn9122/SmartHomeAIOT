import { Button, StyleSheet, Text, TouchableOpacity, View, StatusBar, Image } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraType } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {
    Button as PButton,
    Dialog as PDialog,
    Portal as PPortal,
    Provider as PProvider,
    IconButton as PIconButton,
    TouchableRipple as PTouchableRipple
} from 'react-native-paper';
import { arrow_back, camera_switch, unlock_door, unlock_successful } from "../constants/icons";

const UnlockDoorScreen = ({ navigation }) => {
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camType, setCamType] = useState(CameraType.front);
    const [isVerified, setIsVerified] = useState(false);
    const [name, setName] = useState('')
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [counter, setCounter] = useState(60);
    const [visible, setVisible] = React.useState(false);
    const cameraRef = useRef(null);

    const [isUnlocked, setIsUnlocked] = useState(false); // change this hook when open door successfully
    const handleUnlockDoor = () => {
        // This function is called when ID verified and user pressed unclock button
        setIsUnlocked(true)
    }

    useEffect(() => {
        // verified ID timeout after 1 minute
        if (isVerified && !isUnlocked) {
            const timeout = setTimeout(() => setIsVerified(false), 60000)
            const interval = setInterval(() => setCounter(prevCounter => prevCounter - 1), 1000)
            return () => {
                clearTimeout(timeout)
                clearInterval(interval)
                setCounter(60)
            }
        }
    }, [isVerified])

    useEffect(() => {
        if (counter === 0) setVisible(true)
    }, [counter])

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
        if (!isVerified && face.faces.length !== 0 && isTakingPhoto === false) {
            console.log("sending")
            setIsTakingPhoto(true)
            const result = await cameraRef.current.takePictureAsync(base64 = false, quality = 1)
            const crop_img = await manipulateAsync(
                result.uri,
                [{ resize: { width: 480, height: 640 } }],
                { format: SaveFormat.JPEG }
            );
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
        await fetch('http://192.168.1.177:6868/faceapi/verify', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(data => {
                if (data !== "Failed" && data !== "Unknown") {
                    setIsVerified(true)
                    setName(data)
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

    if (!isVerified) {
        // if not verified, show camera screen
        return (
            <PProvider>
                <View style={styles.subcontainer}>
                    <PIconButton
                        icon={arrow_back}
                        iconColor={'white'}
                        size={20}
                        onPress={() => navigation.goBack()}
                    />
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 14,
                        }}
                    >FaceID Verifying...</Text>
                    <PIconButton
                        icon={camera_switch}
                        iconColor={'white'}
                        size={20}
                        onPress={switchCamera}
                    />
                </View>
                <View style={styles.container}>
                    <Camera style={styles.camera} type={camType} onFacesDetected={onDetectFace} ref={cameraRef}>
                    </Camera>
                </View>
            </PProvider>
        )
    }

    return (
        <PProvider>
            <View style={styles.subcontainerVerified}>
                <PIconButton
                    icon={arrow_back}
                    iconColor={'#2A2A37'}
                    size={20}
                    onPress={() => navigation.goBack()}
                />
            </View>

            <View style={styles.containerVerified}>
                <View style={styles.tab}>
                    <Image
                        source={isUnlocked ? unlock_successful : unlock_door}
                        resizeMode='center'
                        style={{ height: '70%', alignSelf: "center" }}
                    />
                    <Text style={{ width: "100%", textAlign: 'center', paddingBottom: 10, fontSize: 30, color: '#2A2A37' }}>{'Welcome home ' + name + '!'}</Text>
                    { isUnlocked ?
                    <Text
                        style={{ width: "100%", textAlign: 'center', fontSize: 12, color: '#8ED581' }}
                    >
                        'Door open successfully!'
                    </Text> :
                    <Text 
                        style={{ width: "100%", textAlign: 'center', fontSize: 10, color: 'grey' }}
                    >
                        {"Your ID is timeout in " + counter}
                    </Text>}
                </View>
                <PTouchableRipple
                    onPress={handleUnlockDoor}
                    style={{ width: '90%', height: "10%", backgroundColor: "white", borderRadius: 10, }}
                >
                    <Text style={{ flex: 1, textAlignVertical: 'center', textAlign: 'center', color: "#2A2A37" }}>Unlock the door</Text>
                </PTouchableRipple>
            </View>

            <PPortal>
                <PDialog visible={visible} dismissable={false} style={{ backgroundColor: 'white' }}>
                    <PDialog.Content>
                        <Text 
                            style={{ color: "#2A2A37"}}
                        >
                            'Your FaceID is timeout!'
                        </Text>
                    </PDialog.Content>
                    <PDialog.Actions>
                        <PButton textColor={"#2A2A37"} onPress={() => { setVisible(false) }}>OK</PButton>
                    </PDialog.Actions>
                </PDialog>
            </PPortal>
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
    subcontainerVerified: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingTop: StatusBar.currentHeight + 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    tab: {
        backgroundColor: "#FFFFFF",
        margin: "5%",
        padding: "5%",
        height: "65%",
        width: "90%",
        flexDirection: 'column',
        justifyContent: "center",
        alignContent: "center",
        alignItem: "center",
        borderRadius: 10,
    },
    containerVerified: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "10%",
    },
});

export default UnlockDoorScreen