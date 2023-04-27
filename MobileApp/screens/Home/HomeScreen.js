import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import React from "react";

import { RoomTag } from "../../components";

import { roomData } from "../../constants/room";

const HomeScreen = () => {
  return (
    <ScrollView>
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
          <RoomTag
            key={item.id}
            style={styles.itemStyle}
            title={item.title}
            deviceNumber={item.deviceNumber}
            imageSource={item.imageSource}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  itemStyle: {},
});

export default HomeScreen;
