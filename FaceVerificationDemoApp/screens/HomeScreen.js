import React, { useState } from "react";
import { StyleSheet, Text, View, Image, StatusBar } from "react-native";
import {
    Provider as PProvider,
    Divider as PDivider,
    TouchableRipple as PTouchableRipple
} from 'react-native-paper';
import { unlock_door, verification_test } from "../constants/icons";

const HomeScreen = ({navigation}) => {
    return (
        <PProvider>
            <View style={styles.container}>
                <PTouchableRipple
                    style={styles.tab}
                    onPress={() => navigation.navigate("UnlockDoorScreen")}
                >
                    <View style={styles.tabView}>
                        <Image
                            source={unlock_door}
                            resizeMode='center'
                            style={{ height: '70%', alignSelf: "center" }}
                        />
                        <Text style={{ width: "100%", textAlign: 'center' }}>Unlock Door</Text>
                    </View>
                </PTouchableRipple>
                <PTouchableRipple
                    style={styles.tab}
                    onPress={() => navigation.navigate("FaceVerificationScreen")}
                >
                    <View style={styles.tabView}>
                        <Image
                            source={verification_test}
                            resizeMode='center'
                            style={{ height: '70%', alignSelf: "center" }}
                        />
                        <Text style={{ width: "100%", textAlign: 'center' }}>Test Verification</Text>
                    </View>
                </PTouchableRipple>
            </View>
        </PProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        paddingTop: StatusBar.currentHeight,
    },
    tab: {
        backgroundColor: "#FFFFFF",
        margin: "5%",
        padding: "5%",
        height: "45%",
        width: "90%",
        borderRadius: 10,
    },
    tabView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignContent: "center",
        alignItem: "center",
        backgroundColor: "transparent",
    }
});

export default HomeScreen