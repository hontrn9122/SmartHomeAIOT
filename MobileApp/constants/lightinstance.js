import init from "react_native_mqtt";
import { AsyncStorage } from "react-native";
import { Appearance } from "react-native-appearance";
import AdafruitIO from "adafruit-io";

const AIO_USERNAME = "aio_uguT767kjg6Fsfv9WRoOBavNMa57";
const AIO_KEY = "thanhthien412";

const aio = new AdafruitIO(AIO_USERNAME, AIO_KEY);
const colorScheme = Appearance.getColorScheme();
const toggleLight = async (value) => {};
// Connect to the MQTT broker await aio.connect();

// init({
//   size: 10000,
//   storageBackend: AsyncStorage,
//   defaultExpires: 1000 * 3600 * 24,
//   enableCache: true,
//   reconnect: true,
//   sync : {
//   }
// });

// function onConnect() {
//   console.log("onConnect");
// }

// function onConnectionLost(responseObject) {
//   if (responseObject.errorCode !== 0) {
//     console.log("onConnectionLost:"+responseObject.errorMessage);
//   }
// }

// function onMessageArrived(message) {
//   console.log("onMessageArrived:"+message.payloadString);
// }

// const client = new Paho.MQTT.Client('iot.eclipse.org', 443, 'uname');
// client.onConnectionLost = onConnectionLost;
// client.onMessageArrived = onMessageArrived;
// client.connect({ onSuccess:onConnect, useSSL: true });
