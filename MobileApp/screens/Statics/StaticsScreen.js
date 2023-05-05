import { View, Text, Dimensions, SafeAreaView, StyleSheet } from "react-native";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

import PureChart from "react-native-pure-chart";
import React from "react";

// let sampleData = [
//   {
//     seriesName: "series1",
//     data: [
//       { x: "2018-02-01", y: 30 },
//       { x: "2018-02-02", y: 200 },
//       { x: "2018-02-03", y: 170 },
//       { x: "2018-02-04", y: 250 },
//       { x: "2018-02-05", y: 10 },
//     ],
//     color: "#297AB1",
//   },
//   {
//     seriesName: "series2",
//     data: [
//       { x: "2018-02-01", y: 20 },
//       { x: "2018-02-02", y: 100 },
//       { x: "2018-02-03", y: 140 },
//       { x: "2018-02-04", y: 550 },
//       { x: "2018-02-05", y: 40 },
//     ],
//     color: "yellow",
//   },
// ];

const StaticsScreen = () => {
  return (
    <SafeAreaView>
      {/* <View style={styles.chart}>
        <PureChart data={sampleData} height={350} type="line" />
      </View> */}
      {/* <View>
        <Text>Bezier Line Chart</Text>
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
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
      </View> */}
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
