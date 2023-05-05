import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import Modal from "react-native-modal";

import { RoomTag } from "../../components";
import RoomScreen from "../Room/RoomScreen";
import { roomData } from "../../constants/room";

const plusIcon = require("../../assets/images/orangeplus.png");

const HomeScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [itemKey, itemRoom] = useState();

  const handleModal = () => setIsModalVisible(() => !isModalVisible);
  const handleRoom = () => setIsRoomOpen(() => !isRoomOpen);
  return (
    <View>
      <ScrollView style={{ width: "100%" }}>
        <SafeAreaView style={styles.container}>
          {/* <FlatList
          data={roomData}
          numColumns={2}
          renderItem={({ item }) => (
            <RoomTag
              title={item.title}
              deviceNumber={item.deviceNumber}
              imageSource={item.imageSource}
            />
          )}
        /> */}
          {roomData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemStyle}
              onPress={() => {
                itemRoom(item);
                handleRoom();
              }}
            >
              <RoomTag
                title={item.title}
                device={item.device}
                imageSource={item.imageSource}
              />
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </ScrollView>
      <TouchableOpacity onPress={handleModal} style={styles.floatingButton}>
        <Image style={styles.plusIcon} source={plusIcon} />
      </TouchableOpacity>
      <Modal style={styles.popup} isVisible={isModalVisible}>
        <View>
          <Text>Add new</Text>
        </View>
        <View>
          <Text>Add new Room</Text>
        </View>
        <View>
          <Text>Add new Device</Text>
        </View>
        <View>
          <Button onPress={handleModal} title="push" />
        </View>
      </Modal>
      <Modal isVisible={isRoomOpen}>
        <View style={{ height: "100%" }}>
          <RoomScreen item={itemKey} goBack={handleRoom} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  itemStyle: {
    width: "45%",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    height: 200,

    padding: 10,
    margin: 10,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A37",
    position: "absolute",
    bottom: 18,
    right: 18,
  },
  plusIcon: {
    width: 40,
    height: 40,
    margin: 10,
  },
  popup: {
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    width: "80%",
    height: "35%",
  },
});

export default HomeScreen;
