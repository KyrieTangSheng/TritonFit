import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const WorkoutPlanChanger = () => {
  // Grab current state from server (Placeholder values)
  const [workoutPlan, setWorkoutPlan] = useState('Previous workout plan goes here...');
  const [selectedGym, setSelectedGym] = useState('Main Gym');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // Temporary states
  const [tempWorkoutPlan, setTempWorkoutPlan] = useState(workoutPlan);
  const [tempSelectedGym, setTempSelectedGym] = useState(selectedGym);
  const [tempStartTime, setTempStartTime] = useState(startTime);
  const [tempEndTime, setTempEndTime] = useState(endTime);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatTo12Hour = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  const formatTimeToAPI = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:00`;
  };

  const formatDOWToAPI = (date) => {
    return `${date.getDay()}`;
  };

  const handleStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setTempStartTime(selectedDate);
      if (selectedDate >= tempEndTime) {
        setTempEndTime(new Date(selectedDate.getTime() + 15 * 60000));
      }
    }
  };

  const handleEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate && selectedDate > tempStartTime) {
      setTempEndTime(selectedDate);
    } else {
      Alert.alert('Invalid Time', 'End time must be later than start time.');
    }
  };

  const handleSavePlan = () => {
    setWorkoutPlan(tempWorkoutPlan);
    setSelectedGym(tempSelectedGym);
    setStartTime(tempStartTime);
    setEndTime(tempEndTime);
    // This is how we will be making API calls:
    Alert.alert(
      "Workout Plan Saved",
      `Workout Plan: ${tempWorkoutPlan}\n` +
      `Gym Location: ${tempSelectedGym}\n` +
      `Time API: ${formatDOWToAPI(tempStartTime)} - ${formatTimeToAPI(tempStartTime)} - ${formatTimeToAPI(tempEndTime)}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personalized Plan</Text>

      {/* Update workout */}
      <Text style={styles.workout_schedule_headings}>Todays Workout:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={tempWorkoutPlan}
        onChangeText={setTempWorkoutPlan}
      />
      {/* <Text style={styles.result}>Entered Workout Plan: {workoutPlan}</Text> */}

      {/* Update gym location */}
      <Text style={styles.workout_schedule_headings}>Location:</Text>
      <Picker
        selectedValue={tempSelectedGym}
        onValueChange={setTempSelectedGym}
        style={styles.picker}
      >
        <Picker.Item label="Main Gym" value="Main Gym" />
        <Picker.Item label="RIMAC" value="RIMAC" />
      </Picker>
      {/* <Text style={styles.result}>Selected Gym: {selectedGym}</Text> */}

      {/* Update time */}
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
      
      {/* <Text style={styles.result}>Selected Time: {formatDOWToAPI(startTime)}: {formatTimeToAPI(startTime)} - {formatTimeToAPI(endTime)}</Text> */}

      {/* Save plan button */}
      <TouchableOpacity style={styles.button} onPress={handleSavePlan}>
        <Text style={styles.buttonText}>Save Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#182B49',
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
    textAlign: 'center',
  },
  workout_schedule_headings: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  textArea: {
    color: 'white',
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 20,
  },
  result: {
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  time_buttons_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  time_button: {
    backgroundColor: '#00629B',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#C69214',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 30,
    width: 190,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WorkoutPlanChanger;
