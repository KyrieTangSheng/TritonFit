import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { gymPlanService } from '../sched_src/planEvent';
import ProgressBar from "react-native-progress-step-bar";
import { WorkoutItem, Exercise } from '../sched_src/formatting';
import RNFS from 'react-native-fs';

export default function GymPlanScreen({ setCurrentScreen }: any) {
    const [workoutPlan, setWorkoutPlan] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const steps = 1;

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const data = await gymPlanService.fetchTodayWorkoutPlan();
                setWorkoutPlan(data);
            } catch (error) {
                console.error('Failed to load workout plan:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkout();
    }, []);

       
    const handleModify = async () => {
        const filePath = RNFS.ExternalDirectoryPath + '/workoutPlans.json';
      
        try {
          // Convert the workout plans data to a JSON string
          const jsonData = JSON.stringify(workoutPlan);
      
          // Write the JSON data to a file
          await RNFS.writeFile(filePath, jsonData, 'utf8');
          console.log('File written successfully to ' + filePath);
        } catch (error) {
          console.error('Failed to write to file:', error);
        }
        setCurrentScreen('GymPlanEdit')
      };
      
      const handleFeedback = async () => {
        const filePath = RNFS.ExternalDirectoryPath + '/workoutPlans.json';
      
        try {
          // Convert the workout plans data to a JSON string
          const jsonData = JSON.stringify(workoutPlan);
      
          // Write the JSON data to a file
          await RNFS.writeFile(filePath, jsonData, 'utf8');
          console.log('File written successfully to ' + filePath);
        } catch (error) {
          console.error('Failed to write to file:', error);
        }
        setCurrentScreen('FeedBack')
      };
  
  

    if (loading) return <ActivityIndicator size="large" color="#C69214" style={styles.loader} />;
    if (!workoutPlan) return <Text style={styles.title}>No workout plan for Today</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Workout Plan For {workoutPlan.day}</Text>
            <View style={styles.planContainer}>
                {workoutPlan.workout.workout_items?.map((item: WorkoutItem) => (
                    <View key={item.id} style={styles.workoutSection}>
                        <Text style={styles.workoutType}>{item.type} - {item.duration}</Text>
                        {item.exercises.map((exercise: Exercise) => (
                            <Text key={exercise.id} style={styles.exerciseText}>
                                {exercise.name}: {exercise.sets} sets x {exercise.reps_per_set ?? 'N/A'}, Rest: {exercise.rest_between_sets}
                            </Text>
                        ))}
                    </View>
                ))}
                <Text style={styles.sectionTitle}>Location:</Text>
                <Text style={styles.sectionContent}>{workoutPlan.workout.location}</Text>
                <Text style={styles.sectionTitle}>Time:</Text>
                <Text style={styles.sectionContent}>{workoutPlan.workout.time}</Text>
            </View>

            {/* Progress bar */}
            <Text style={styles.bar}>Progress Bar</Text>
            <View style={styles.progressContainer}>
                <ProgressBar
                    steps={steps}
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

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    style={[styles.progressButton, currentStep === 0 && styles.disabledButton]}>
                    <Text style={styles.progressButtonText}>Prev Task</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentStep((prev) => Math.min(steps, prev + 1))}
                    style={[styles.progressButton, currentStep === steps && styles.disabledButton]}>
                    <Text style={styles.progressButtonText}>Next Task</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleModify} style={styles.button}>
                <Text style={styles.buttonText}>Modify Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFeedback} style={styles.button}>
                <Text style={styles.buttonText}>Feedback</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#182B49' },
    title: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
    sectionTitle: { color: '#F8C471', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
    sectionContent: { color: 'white', fontSize: 18, marginLeft: 10 },
    planContainer: { backgroundColor: "#00629B", padding: 15, borderRadius: 8 },
    workoutSection: { marginTop: 10 },
    workoutType: { color: '#F8C471', fontSize: 22, fontWeight: 'bold' },
    exerciseText: { color: 'white', fontSize: 18, marginLeft: 10 },
    bar: { fontSize: 25, fontWeight: 'bold', marginTop: 30, textAlign: 'center', color: 'white' },
    progressContainer: { alignItems: 'center', marginTop: 20 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    button: { backgroundColor: '#C69214', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    progressButton: { backgroundColor: '#C69214', padding: 12, borderRadius: 8, marginHorizontal: 10, marginTop: 20, marginBottom: 50 },
    disabledButton: { backgroundColor: '#A9A9A9' },
    progressButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

