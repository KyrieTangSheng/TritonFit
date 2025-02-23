// screens/SocialScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function SocialScreen({ setCurrentScreen }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Social Screen!</Text>
      {/* Button to navigate to ProfileScreen */}
      <Button title="Go to Profile" onPress={() => setCurrentScreen('Profile')} />
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
