import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PreferencesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Preferences Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00629B",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
  },
});
