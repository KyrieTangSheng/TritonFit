import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FrontScreenProps  {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentScreen: (screen: string) => void; 
}

export default function FrontScreen({ setIsLoggedIn, setCurrentScreen }: FrontScreenProps ){
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TritonFit</Text>

      <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('Login')}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setCurrentScreen('Preferences')}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182B49",
    paddingBottom: 40,
    width: "100%",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 40,
    color: "white",
  },
  button: {
    backgroundColor: "#C69214",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 30, // Adds spacing between buttons
    width: 190,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
