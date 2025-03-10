import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export default function HomeScreen({ setCurrentScreen }: any) {
  const [step, setStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  // Check if the tutorial was already completed
  useEffect(() => {
    const checkTutorialStatus = async () => {
      const completed = await AsyncStorage.getItem("tutorialCompleted");
      if (completed === "true") {
        setTutorialCompleted(true);
        setShowWelcome(true); // Show welcome message instead of tutorial
      }
    };
    checkTutorialStatus();
  }, []);

  const nextStep = () => {
    setStep((prevStep) => (prevStep % 4) + 1);
  };

  const closeTutorial = async () => {
    setShowWelcome(true); // Show welcome note
    setTutorialCompleted(true);
    await AsyncStorage.setItem("tutorialCompleted", "true"); // Save tutorial completion
  };

  const restartTutorial = async () => {
    setStep(1);
    setShowWelcome(false);
    setTutorialCompleted(false);
    await AsyncStorage.removeItem("tutorialCompleted"); // Reset tutorial status
  };

  // Show Welcome Note instead of tutorial if tutorial is completed
  if (showWelcome) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Welcome to TritonFit! 🎉</Text>
        <Text style={styles.text}>
          You're all set! Explore the app, manage your workouts, and connect with others.
        </Text>
        <Button title="Restart Tutorial" onPress={restartTutorial} color="#F8C471" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {step === 1
          ? "Getting Started"
          : step === 2
          ? "Gym Plan"
          : step === 3
          ? "Social Connections"
          : "Account Settings"}
      </Text>

      {step === 1 && (
        <Text style={styles.text}>
          Now that you have made an account you can go to the calendar screen
          (shown by the calendar icon in the navigation bar).
          Here you can set up your weekly schedule at the start of every week.
        </Text>
      )}
      {step === 2 && (
        <Text style={styles.text}>
          After setting up your weekly schedule, you can visit the personalized gym plan
          screen (shown by the dumbbell icon). Here, you can track progress, modify your
          plan, and give feedback.
        </Text>
      )}
      {step === 3 && (
        <Text style={styles.text}>
          Looking for a workout partner? Visit the social screen (people icon) to find
          others with similar schedules and fitness goals.
        </Text>
      )}
      {step === 4 && (
        <Text style={styles.text}>
          Want to change your preferences or log out? Click the person icon in the top
          right.
        </Text>
      )}

      <Button title={step === 4 ? "Restart" : "Next"} onPress={nextStep} color="#F8C471" />

      {step === 4 && (
        <TouchableOpacity style={styles.Button} onPress={closeTutorial}>
         <Text style={styles.closeButtonText}>CLOSE</Text>
      </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
    backgroundColor: "#182B49",
  },
  title: {
    color: "#D1A32A",
    fontSize: 25,
    marginBottom: 20,
  },
  text: {
    color: "#F8C471",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  Button: {
    backgroundColor: "#F8C471",
    padding: 10,
    marginTop:15
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

