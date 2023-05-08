import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Button,
} from "react-native";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import React, { useState, useEffect } from "react";

const getData = async () => {
  try {
    // Send the GET request to the /get_heat_data endpoint
    const response = await fetch("http://192.168.2.10:3000/get_heat_data");

    // Check if the request was successful
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();

      // Handle the data here
      console.log(data);
      return data;
    } else {
      console.error(`An error occurred: ${response.statusText}`);
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
  }
};

const StaticsScreen = () => {
  const [dataValue, setDataValue] = useState([]);
  const [heatLabels, setHeatLabels] = useState([]);
  useEffect(() => {
    getData().then((heatData) => {
      // Extract the data values from the array
      const dataValue = heatData.map((item) => parseFloat(item.value));
      // Extract the labels from the array
      const heatLabels = heatData.map((item) => item.created_at);

      setDataValue(dataValue);
      setHeatLabels(heatLabels);
      console.log(dataValue);
      console.log(heatLabels);
    });
  }, []);

  // // Extract the data values from the array
  // const dataValue = heatData.map((item) => parseFloat(item.value));
  // // Extract the labels from the array
  // const heatLabels = heatData.map((item) => item.created_at);
  return (
    <SafeAreaView>
      <Button title="click" onPress={getData} />
      <View>
        <LineChart
          data={{
            labels: heatLabels,
            datasets: [
              {
                data: dataValue,
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <View style={styles.content}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chart: {
    backgroundColor: "#2A2A37",
    borderWidth: 2,
    width: "100%",
    height: "60%",
  },
  content: {
    height: "40%",
  },
});

export default StaticsScreen;
