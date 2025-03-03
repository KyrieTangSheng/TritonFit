import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen({ setCurrentScreen }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: '19%', // Apply padding only to left & right
    backgroundColor: "#182B49",
  },
  text: {
    color: "#FFCD00",
    fontSize: 19,
    textAlign: "center",
  },
});

