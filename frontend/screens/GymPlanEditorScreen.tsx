import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconButton } from 'react-native-paper'; // Import IconButton

interface GymPlanScreenEditorProps  {
    // setIsLoggedIn: (loggedIn: boolean) => void;
    setCurrentScreen: (screen: string) => void; 
  }

export default function GymPlanEditorScreen({ setCurrentScreen }: GymPlanScreenEditorProps) {
  const [workoutPlan, setWorkoutPlan] = useState<string>('Previous workout plan goes here...');
  const [selectedGym, setSelectedGym] = useState<string>('Main Gym');
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [tempWorkoutPlan, setTempWorkoutPlan] = useState<string>(workoutPlan);
  const [tempSelectedGym, setTempSelectedGym] = useState<string>(selectedGym);
  const [tempStartTime, setTempStartTime] = useState<Date>(startTime);
  const [tempEndTime, setTempEndTime] = useState<Date>(endTime);

  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);

  const formatTo12Hour = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  const formatTimeToAPI = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:00`;
  };

  const formatDOWToAPI = (date: Date): string => {
    return `${date.getDay()}`;
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

  const handleSavePlan = () => {
    setWorkoutPlan(tempWorkoutPlan);
    setSelectedGym(tempSelectedGym);
    setStartTime(tempStartTime);
    setEndTime(tempEndTime);
    Alert.alert(
      "Workout Plan Saved",
      `Workout Plan: ${tempWorkoutPlan}\n` +
      `Gym Location: ${tempSelectedGym}\n` +
      `Time API: ${formatDOWToAPI(tempStartTime)} - ${formatTimeToAPI(tempStartTime)} - ${formatTimeToAPI(tempEndTime)}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <IconButton 
              icon="arrow-left" 
              size={24} 
              iconColor="#FFCD00" 
              style={styles.backButton}
              onPress={() => setCurrentScreen('GymPlan')}
            />
      <Text style={styles.title}>Personalized Plan</Text>

      <Text style={styles.workout_schedule_headings}>Today's Workout:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={15}
        value={tempWorkoutPlan}
        onChangeText={setTempWorkoutPlan}
      />

      <Text style={styles.workout_schedule_headings}>Location:</Text>
      <Picker
        selectedValue={tempSelectedGym}
        onValueChange={setTempSelectedGym}
        style={styles.picker}
      >
        <Picker.Item label="Main Gym" value="Main Gym" />
        <Picker.Item label="RIMAC" value="RIMAC" />
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
    </ScrollView>
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
    width: 350,
    height: '35%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  picker: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 20,
  },
  time_buttons_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  backButton: { 
    position: 'absolute',
    top: '3%',
    left: 0 
  },
});
