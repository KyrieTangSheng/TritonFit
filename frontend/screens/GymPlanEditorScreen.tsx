import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconButton } from 'react-native-paper'; // Import IconButton
import RNFS from 'react-native-fs';
import { WorkoutDetails, Workout, WorkoutItem, Exercise } from '../sched_src/workoutplanEvent';
import { workoutPlanCalls } from '../sched_src/workoutplanCalls';
interface GymPlanScreenEditorProps {
  setCurrentScreen: (screen: string) => void;
}

export default function GymPlanEditorScreen({ setCurrentScreen }: GymPlanScreenEditorProps) {
  const days_of_week: { [key: number]: string } = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
  };

  const [currentPlan, setCurrentPlan] = useState<WorkoutDetails | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<string>('');
  const [currentWorkoutItems, setCurrentWorkoutItems] = useState<WorkoutItem[]>([]);
  const [selectedGym, setSelectedGym] = useState<string>('Main Gym');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [tempCurrentPlan, setTempCurrentPlan] = useState<WorkoutDetails | null>(currentPlan);
  const [tempWorkoutPlan, setTempWorkoutPlan] = useState<string>(workoutPlan);
  const [tempSelectedGym, setTempSelectedGym] = useState<string>(selectedGym);

  const [tempStartTime, setTempStartTime] = useState<Date>(startTime);
  const [tempEndTime, setTempEndTime] = useState<Date>(endTime);

  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Get workout plan from saved file
  const readWorkoutPlanFromFile = async () => {
    const filePath = RNFS.ExternalDirectoryPath + '/workoutPlans.json';
    try {
      const jsonData = await RNFS.readFile(filePath, 'utf8');
      const workoutPlan: WorkoutDetails = JSON.parse(jsonData);
      console.log('Read from file:', workoutPlan);
      return workoutPlan;
    } catch (error) {
      console.error('Failed to read file:', error);
      return null;
    }
  };
  //Format the datetime into hours of 12 (for displaying on the UI)
  const formatTo12Hour = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  // Format the datetime to bne sent into the API
  const formatTimeToAPI = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:00`;
  };

  const day_of_week = (date: Date): string => {
    const dayIndex = date.getDay();
    return days_of_week[dayIndex as 1 | 2 | 3 | 4 | 5 | 6 | 7];
  };

  const handleStartTimeChange = (_event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setTempStartTime(selectedDate);
      if (selectedDate >= tempEndTime) {
        setTempEndTime(new Date(selectedDate.getTime() + 15 * 60000));
      }
    }
  };

  const handleEndTimeChange = (_event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate && selectedDate > tempStartTime) {
      setTempEndTime(selectedDate);
    } else {
      Alert.alert('Invalid Time', 'End time must be later than start time.');
    }
  };

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      const workoutPlan = await readWorkoutPlanFromFile();
      setTempCurrentPlan(workoutPlan);
      console.log('Workout Plan:', workoutPlan.workout);    
      // console.log("Pulled in start time:", workoutPlan?.workout?.time)  
      if (workoutPlan) {
        // console.log("Here");
        setTempWorkoutPlan(JSON.stringify(workoutPlan, null, 2));
        setCurrentWorkoutItems(workoutPlan.workout?.workout_items || []);
        // console.log("This is initial time: ", workoutPlan.workout?.time);
        const timeSplit = workoutPlan.workout?.time.split('-');
        const today = new Date();
        const startTime = today.setHours(parseInt(timeSplit[0].split(':')[0]), parseInt(timeSplit[0].split(':')[1]));
        const endTime = today.setHours(parseInt(timeSplit[1].split(':')[0]), parseInt(timeSplit[1].split(':')[1]));
        setTempStartTime(new Date(startTime));
        setTempEndTime(new Date(endTime));      
        setTempSelectedGym(workoutPlan.workout?.location || 'Main Gym');
      }
      setLoading(false);
    };

    fetchWorkoutPlan();
  }, []);

  const handleWorkoutItemChange = (index: number, key: string, value: any) => {
    const updatedItems = [...currentWorkoutItems];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setCurrentWorkoutItems(updatedItems);
  };

  const handleExerciseChange = (itemIndex: number, exerciseIndex: number, key: string, value: any) => {
    const updatedItems = [...currentWorkoutItems];
    const updatedExercises = [...updatedItems[itemIndex].exercises];

    if (key === 'sets' || key === 'reps_per_set') {
      let parsedValue = parseInt(value);
      if (isNaN(parsedValue) || parsedValue < 1) {
        parsedValue = 1;
      }
      updatedExercises[exerciseIndex] = { 
        ...updatedExercises[exerciseIndex], 
        [key]: parsedValue 
      };
    } else {
      updatedExercises[exerciseIndex] = { 
        ...updatedExercises[exerciseIndex], 
        [key]: value 
      };
    }

    updatedItems[itemIndex].exercises = updatedExercises;
    setCurrentWorkoutItems(updatedItems);
  };

  const handleEquipmentChange = (itemIndex: number, exerciseIndex: number, equipmentIndex: number, value: string) => {
    const updatedItems = [...currentWorkoutItems];
    const updatedExercises = [...updatedItems[itemIndex].exercises];
    const updatedEquipment = [...updatedExercises[equipmentIndex].equipment];
    updatedEquipment[equipmentIndex] = value || 'none';
    updatedExercises[exerciseIndex].equipment = updatedEquipment;
    updatedItems[itemIndex].exercises = updatedExercises;
    setCurrentWorkoutItems(updatedItems);
  };

  const handleAddEquipment = (itemIndex: number, exerciseIndex: number) => {
    const updatedItems = [...currentWorkoutItems];
    const updatedExercises = [...updatedItems[itemIndex].exercises];
    updatedExercises[exerciseIndex].equipment.push('none');
    updatedItems[itemIndex].exercises = updatedExercises;
    setCurrentWorkoutItems(updatedItems);
  };

  const handleDeleteEquipment = (itemIndex: number, exerciseIndex: number, equipmentIndex: number) => {
    const updatedItems = [...currentWorkoutItems];
    const updatedExercises = [...updatedItems[itemIndex].exercises];
    const updatedEquipment = [...updatedExercises[exerciseIndex].equipment];
  
    if (updatedEquipment.length > 1) {
      updatedEquipment.splice(equipmentIndex, 1);
    } else {
      updatedEquipment[0] = 'none';
    }
  
    updatedExercises[exerciseIndex].equipment = updatedEquipment;
    updatedItems[itemIndex].exercises = updatedExercises;
    setCurrentWorkoutItems(updatedItems);
  };

  const handleAddExercise = (itemIndex: number) => {
    const updatedItems = [...currentWorkoutItems];
    updatedItems[itemIndex].exercises.push({
      name: '',
      sets: 1,
      reps_per_set: 1,
      rest_between_sets: '',
      equipment: ['none'],
      difficulty: '',
      notes: ''
    });
    setCurrentWorkoutItems(updatedItems);
  };

  const handleAddWorkoutItem = () => {
    const newWorkoutItem: WorkoutItem = {
      type: '',
      duration: '',
      exercises: [{
        name: '',
        sets: 1,
        reps_per_set: 1,
        rest_between_sets: '',
        equipment: ['none'],
        difficulty: '',
        notes: ''
      }]
    };
    setCurrentWorkoutItems([...currentWorkoutItems, newWorkoutItem]);
  };
  // This function deletes a workout item. It takes the index of the workout item and removes it from the current workout items.
  const handleDeleteWorkoutItem = (itemIndex: number) => {
    const updatedItems = currentWorkoutItems.filter((_, index) => index !== itemIndex);
    setCurrentWorkoutItems(updatedItems);
  };
  
  // deletes an exercise item
  const handleDeleteExercise = (itemIndex: number, exerciseIndex: number) => {
    const updatedItems = [...currentWorkoutItems];
    const updatedExercises = updatedItems[itemIndex].exercises.filter((_, index) => index !== exerciseIndex);
    updatedItems[itemIndex].exercises = updatedExercises;
    setCurrentWorkoutItems(updatedItems);
  };
  
  //Format data into request body format
  const transformData = (workoutItems: WorkoutItem[]) => {
    return workoutItems.map(item => ({
      type: item.type,
      duration: item.duration,
      exercises: item.exercises.map(exercise => ({
        name: exercise.name,
        sets: exercise.sets,
        reps_per_set: exercise.reps_per_set,
        rest_between_sets: exercise.rest_between_sets,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        notes: exercise.notes
      }))
    }));
  };

  //Validate workout items (make sure all fields are filled in and values are acceptable)
  const validateWorkoutItems = (workoutItems: WorkoutItem[]): boolean => {
    for (const item of workoutItems) {
      if (!item.type || !item.duration) {
        return false;
      }
      for (const exercise of item.exercises) {
        if (!exercise.name || exercise.sets < 1 || exercise.reps_per_set < 1 || !exercise.rest_between_sets || !exercise.difficulty || !exercise.notes) {
          return false;
        }
        for (const equipment of exercise.equipment) {
          if (!equipment) {
            return false;
          }
        }
      }
    }
    return true;
  };

  //Save workout plan --> send to API
  const handleSavePlan = async () => {
    if (!validateWorkoutItems(currentWorkoutItems)) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
  
    const transformedWorkoutItems = transformData(currentWorkoutItems);
    const plan_id = tempCurrentPlan?.plan_id || '';
    const day = tempCurrentPlan?.day || '';
    const updatedPlan = {
      workout: {
        location: tempSelectedGym,
        time: `${formatTimeToAPI(tempStartTime)}-${formatTimeToAPI(tempEndTime)}`,
        workout_items: transformedWorkoutItems
      }
    };
  
    try {
      const updatedWorkoutData = await workoutPlanCalls.updateWorkoutToday(updatedPlan.workout, plan_id, day);
      // Update state with the new workout plan
      setCurrentPlan(updatedPlan);
      setWorkoutPlan(JSON.stringify(updatedPlan.workout, null, 2));
      setSelectedGym(tempSelectedGym);
      setStartTime(tempStartTime);
      setEndTime(tempEndTime);
      Alert.alert(
        "Workout Plan Saved",
        `Workout Plan: ${JSON.stringify(updatedPlan.workout, null, 2)}\n` +
        `For API: Day = ${day}, Plan ID = ${plan_id}\n`
      );
      // console.log("API CALL RETURN: ", updatedWorkoutData);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  // screen has not fully loaded in yet
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPlanText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={24}
        iconColor="#FFCD00"
        style={styles.backButton}
        onPress={() => setCurrentScreen('GymPlan')}
      />
      <Text style={styles.title}>Personalized Plan</Text>
      <ScrollView>

      {/* If the pulled workout from files is empty (we display that there are no workouts today) */}

      {currentWorkoutItems.length > 0 ? (
        currentWorkoutItems.map((item, itemIndex) => (
          <View key={itemIndex} style={styles.workoutItemContainer}>
            <Text style={styles.label}>Type:</Text>
            <TextInput
              style={styles.input}
              value={item.type}
              onChangeText={(text) => handleWorkoutItemChange(itemIndex, 'type', text)}
              placeholder="Type"
            />
            <Text style={styles.label}>Duration:</Text>
            <TextInput
              style={styles.input}
              value={item.duration}
              onChangeText={(text) => handleWorkoutItemChange(itemIndex, 'duration', text)}
              placeholder="Duration"
            />
            {item.exercises.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.exerciseContainer}>
                <Text style={styles.label}>Exercise Name:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.name}
                  onChangeText={(text) => handleExerciseChange(itemIndex, exerciseIndex, 'name', text)}
                  placeholder="Exercise Name"
                />
                <Text style={styles.label}>Sets:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.sets.toString()}
                  onChangeText={(text) => handleExerciseChange(itemIndex, exerciseIndex, 'sets', parseInt(text))}
                  placeholder="Sets"
                  keyboardType="numeric"
                />
                <Text style={styles.label}>Reps per Set:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.reps_per_set?.toString() || ''}
                  onChangeText={(text) => handleExerciseChange(itemIndex, exerciseIndex, 'reps_per_set', parseInt(text))}
                  placeholder="Reps per Set"
                  keyboardType="numeric"
                />
                <Text style={styles.label}>Rest Between Sets:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.rest_between_sets}
                  onChangeText={(text) => handleExerciseChange(itemIndex, exerciseIndex, 'rest_between_sets', text)}
                  placeholder="Rest Between Sets"
                />
                <Text style={styles.label}>Difficulty:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.difficulty}
                  onChangeText={(text) => handleExerciseChange(itemIndex, exerciseIndex, 'difficulty', text)}
                  placeholder="Difficulty"
                />
                <Text style={styles.label}>Notes:</Text>
                <TextInput
                  style={styles.input}
                  value={exercise.notes}
                  onChangeText={(text) => handleExerciseChange(itemIndex, exerciseIndex, 'notes', text)}
                  placeholder="Notes"
                />
                <Text style={styles.label}>Equipment:</Text>
                {exercise.equipment.map((equipment, equipmentIndex) => (
                  <View key={equipmentIndex} style={styles.equipmentContainer}>
                    <TextInput
                      style={styles.input}
                      value={equipment}
                      onChangeText={(text) => handleEquipmentChange(itemIndex, exerciseIndex, equipmentIndex, text)}
                      placeholder="Equipment"
                    />
                    {exercise.equipment.length > 1 && (
                      <TouchableOpacity onPress={() => handleDeleteEquipment(itemIndex, exerciseIndex, equipmentIndex)}>
                        <Text style={styles.deleteButton}>x</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity onPress={() => handleAddEquipment(itemIndex, exerciseIndex)}>
                  <Text style={styles.addEquipmentButton}>Add Equipment</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteExercise(itemIndex, exerciseIndex)}>
                  <Text style={styles.deleteButton}>Delete Exercise</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => handleAddExercise(itemIndex)}>
              <Text style={styles.addExerciseButton}>Add Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteWorkoutItem(itemIndex)}>
              <Text style={styles.deleteButton}>Delete Workout Item</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noPlanText}>No workout plan for today.</Text>
      )}

      <TouchableOpacity onPress={handleAddWorkoutItem}>
        <Text style={styles.addWorkoutItemButton}>Add Workout Item</Text>
      </TouchableOpacity>
      </ScrollView>
      

      <Text style={styles.workout_schedule_headings}>Location:</Text>
      <Picker
        selectedValue={tempSelectedGym}
        onValueChange={setTempSelectedGym}
        style={styles.picker}
      >
        <Picker.Item label="Main Gym" value="Main Gym" />
        <Picker.Item label="RIMAC" value="RIMAC" />
        <Picker.Item label="Home" value="Home" />
        <Picker.Item label="Outdoor" value="Outdoor" />
      </Picker>

      <View style={styles.time_buttons_container}>
        <TouchableOpacity style={styles.time_button} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.buttonText}>Start: {formatTo12Hour(tempStartTime)}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={tempStartTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleStartTimeChange}
          />
        )}

        <TouchableOpacity style={styles.time_button} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.buttonText}>End: {formatTo12Hour(tempEndTime)}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={tempEndTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleEndTimeChange}
          />
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSavePlan}>
        <Text style={styles.buttonText}>Save Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182B49',
    paddingBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  workout_schedule_headings: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginBottom: 20,
  },
  time_buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  time_button: {
    backgroundColor: "#00629B",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#C69214",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 190,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 0,
    // marginBottom: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  workoutItemContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  exerciseContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
  },
  label: {
    color: '#182B49',
    marginBottom: 5,
  },
  addEquipmentButton: {
    color: '#00629B',
    marginTop: 5,
    marginBottom: 10,
  },
  addExerciseButton: {
    color: '#00629B',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  addWorkoutItemButton: {
    color: '#C69214',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
  noPlanText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});