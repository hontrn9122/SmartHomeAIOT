import { View, Text, Dimensions, SafeAreaView, StyleSheet } from "react-native";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";

const SERVER_IP = "http://192.168.2.10";

const getDataNear = async () => {
  try {
    // Send the GET request to the /get_heat_data endpoint
    const response = await fetch(`${SERVER_IP}:3000/get_heat_data`);

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Handle the data here
      // console.log(data);
      return data;
    } else {
      console.error(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
};

const getLightData = async () => {
  try {
    // Send the GET request to the /get_light_data endpoint
    const response = await fetch(`${SERVER_IP}:3000/get_light_data`);

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Handle the data here
      // console.log("test light data", data);
      return data;
    } else {
      console.error(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
};

const StaticsScreen = () => {
  const [dataValue, setDataValue] = useState([0, 0, 0, 0, 0, 0]);
  const [heatLabels, setHeatLabels] = useState([0, 0, 0, 0, 0, 0]);
  const [lightValue, setLightValue] = useState(0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  useEffect(() => {
    getDataNear().then((heatData) => {
      // Extract the data values from the array
      const dataValue = heatData.map((item) => parseFloat(item.value));
      // Extract the labels from the array
      const heatLabels = heatData.map((item) => {
        testing = new Date(item.created_at);
        // hour = testing.getHours(); ${hour}:
        minute = testing.getMinutes();
        second = testing.getSeconds();
        return (res = `${minute}:${second}`);
      });

      setDataValue(dataValue.reverse());
      setHeatLabels(heatLabels.reverse());
      // console.log(dataValue);
      // console.log(heatLabels);

      // testing = new Date(heatLabels[0]);
      // console.log("test, ", testing);
    });

    getLightData().then((lightData) => {
      const lightValue = lightData[0].value;
      setLightValue(lightValue);
      // console.log("light: ", lightValue);
    });
  }, []);

  // // Extract the data values from the array
  // const dataValue = heatData.map((item) => parseFloat(item.value));
  // // Extract the labels from the array
  // const heatLabels = heatData.map((item) => item.created_at);
  return (
    <SafeAreaView>
      <View style={styles.chart}>
        <LineChart
          data={{
            labels: heatLabels,
            datasets: [
              {
                data: dataValue,
              },
            ],
            legend: ["Your room's temperature"],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisSuffix="°C"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundGradientFrom: "#2A2A37",
            backgroundGradientTo: "#2A2A37",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 0) => `rgba(241, 46, 35, ${opacity})`,
            labelColor: (opacity = 0.3) => `rgba(245, 245, 245, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#FF5A4A",
            },
          }}
          bezier
        />
      </View>
      <View style={styles.box}>
        <View style={styles.headerInfo}>
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>{`${(month =
            months[new Date().getMonth()])} ${(date =
            new Date().getDate())}, ${(year =
            new Date().getFullYear())}`}</Text>
        </View>
        <View style={styles.boxcontent}>
          <Text style={{ fontSize: 40, color: "#FF9900" }}>
            {dataValue.slice(-1)}°C
          </Text>
          <Text style={{ fontSize: 40, color: "#307AFF" }}>{lightValue}lm</Text>
        </View>
        <View style={styles.selection}>
          <Button text="Change" />
        </View>
      </View>
      <View style={styles.content}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chart: {
    backgroundColor: "#2A2A37",
    width: "100%",
    height: "60%",
  },
  content: {
    height: "40%",
  },
  box: {
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

    position: "absolute",
    height: "40%",
    width: "90%",
    right: "5%",
    left: "5%",
    bottom: "10%",
  },
  headerInfo: {
    borderColor: "#000",
    borderBottomWidth: 0.5,
    height: "20%",
    width: "100%",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  boxcontent: {
    width: "100%",
    flexDirection: "row",
    height: "50%",

    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
  },
  selection: {
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StaticsScreen;
