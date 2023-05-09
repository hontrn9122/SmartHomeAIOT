import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import React from "react";

import { RoutineTag } from "../../components";

import { routineData } from "../../constants/routine";

const ControlScreen = () => {
  return (
    <ScrollView
      style={{
        width: "100%",
      }}
    >
      <SafeAreaView style={styles.container}>
        {routineData.map((item) => (
          <RoutineTag
            key={item.id}
            style={styles.itemStyle}
            title={item.title}
            time={item.time}
            frequent={item.frequent}
            deviceNumber={item.deviceNumber}
            state={item.state}
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

export default ControlScreen;
