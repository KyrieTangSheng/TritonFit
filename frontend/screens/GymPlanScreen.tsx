

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
// npm i react-native-progress-step-bar --save
import ProgressBar from "react-native-progress-step-bar";

export default function GymPlanScreen()  {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = 3;

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep((prevStep) => prevStep - 1);
  }, [currentStep]);

  const handleNextStep = useCallback(() => {
    if (currentStep < steps) setCurrentStep((prevStep) => prevStep + 1);
  }, [currentStep]);

  const plan = {
    title: 'My Workout Plan',
    content: "Let's work out today!",
    steps: [
      { id: 1, name: '10 min Cardio', task: ['10 Jumping Jacks', '5 Planks'] },
      { id: 2, name: '5 min Mobility', task: '20 Lunges' },
    ],
    location: "Main Gym",
    time: "3:00 - 3:15 PM",
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.content}>{plan.content}</Text>

      <View style={styles.planContainer}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        <FlatList
          scrollEnabled={false}
          data={plan.steps}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.planTextContainer}>
              <Text style={styles.name}>{item.name}</Text>
              {Array.isArray(item.task) ? (
                item.task.map((task, index) => (
                  <Text key={index} style={styles.workoutTask}>- {task}</Text>
                ))
              ) : (
                <Text style={styles.workoutTask}>- {item.task}</Text>
              )}
            </View>
          )}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Workout Location:</Text>
          <Text style={styles.sectionContent}>{plan.location}</Text>
          <Text style={styles.sectionTitle}>Workout Time:</Text>
          <Text style={styles.sectionContent}>{plan.time}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Modify Plan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Feedback</Text>
      </TouchableOpacity>

      <Text style={styles.bar}>Progress Bar</Text>

      <View style={styles.progressContainer}>
        <ProgressBar
          steps={3}
          dotDiameter={20}
          width={320}
          height={10}
          currentStep={currentStep}
          stepToStepAnimationDuration={200}
          backgroundBarStyle={{ backgroundColor: "gray" }}
          filledBarStyle={{ backgroundColor: "#00629B" }}
          filledDotStyle={{ backgroundColor: '#C69214' }}
          withDots
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePrevStep} style={[styles.progressButton, currentStep === 0 && styles.disabledButton]}>
          <Text style={styles.progressButtonText}>Prev Task</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextStep} style={[styles.progressButton, currentStep === steps && styles.disabledButton]}>
          <Text style={styles.progressButtonText}>Next Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    textAlign: 'center',
    color: '#555',
  },
  sectionTitle: {
    color: '#F8C471',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  sectionContent: {
    color: "white",
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  planContainer: {
    backgroundColor: "#00629B",
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
  },
  planTextContainer: {
    marginLeft: 10,
    marginBottom: 10,
  },
  name: {
    color: "white",
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  workoutTask: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    paddingLeft: 10,
  },
  infoContainer: {
    marginTop: 5,
  },
  bar: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    color: '#333',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#C69214',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressButton: {
    backgroundColor: '#C69214',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 50,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  progressButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
});

