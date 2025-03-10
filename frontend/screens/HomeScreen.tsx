import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ setCurrentScreen }: any) {
  const [step, setStep] = useState(1);  // Track the tutorial step

  const nextStep = () => {
    // Cycle through steps using modulus
    setStep((prevStep) => (prevStep % 4) + 1);  // Changed modulus from 3 to 4 for 4 steps
  };

  const buttonText = step === 4 ? "Restart" : "Next";  // Change to "Restart" on step 4

  // Dynamically set title based on step
  const titleText = step === 1 
    ? "Getting Started"
    : step === 2
    ? "Gym Plan"
    : step === 3
    ? "Social Connections"
    : "Account Settings";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleText}</Text>
      
      {step === 1 && (
        <Text style={styles.text}>Now that you have made an account you can go to the calendar screen (shown by the calendar icon in the navigation bar). Here you can set up your weekly schedule at the start of every week.</Text>
      )}
      {step === 2 && (
        <Text style={styles.text}>After you have set up your weekly schedule you can go to your personalized gym plan screen (shown by the dumbbell icon in the navigation bar). From here you will be able to keep track of your progress, modify your plan if you don't like certain exercises or time constraints, and give feedback.</Text>
      )}
      {step === 3 && (
        <Text style={styles.text}>If you are looking for someone to work out with you can go to the social screen (shown by the plus next to two people in the navigation bar). Here you can find other students that have a similar workout plan and time restraint as you. You can click on any of them to get more information and connect with them through their UCSD email.</Text>
      )}
      {step === 4 && (
        <Text style={styles.text}>Lastly, if you want to change your account preferences or logout you can click the person icon in the top right of the screen.</Text>
      )}

      <Button
        title={buttonText}
        onPress={nextStep}
        color="#F8C471"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: '19%',
    backgroundColor: "#182B49",
  },
  title: {
    color: "#D1A32A", // Slightly darker shade of yellow
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    color: "#F8C471", // Keeping text color the same
    fontSize: 19,
    textAlign: "center",
    marginBottom: 20,
  },
});
