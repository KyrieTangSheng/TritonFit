import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Dropdown from 'react-native-input-select';

export default function PreferencesScreen() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [workout_location, setLocation] = useState([]);
  const [workout_types, setWorkoutTypes] = useState([]);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [fitness_level, setFitness] = useState<number | undefined>(undefined);
  const [dob, setDob] = useState(""); // State for Date of Birth

  const handleSubmit = () => {
    // Validation for missing fields
    if (!workout_location.length || !workout_types.length || !gender || !fitness_level || !dob) {
      Alert.alert("Missing Fields", "Please fill out all required fields before submitting.");
      return;
    }
    
    // Validate date of birth format (MM/DD/YYYY)
    const dobRegex = /^(0[1-9]|1[0-2])\/([0-2][1-9]|3[0-1])\/\d{4}$/;
    if (!dobRegex.test(dob)) {
      Alert.alert("Invalid Date", "Please enter a valid date of birth in the format MM/DD/YYYY.");
      return;
    }
    
    console.log({ weight, height, workout_location, workout_types, gender, fitness_level, dob });
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Preferences</Text>

        <Text style={styles.label}>Height (optional, in inches)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Weight (optional, in lbs)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Workout Location</Text>    
        <Dropdown
          placeholder='Please select an option'
          placeholderStyle={styles.selectedItem}
          dropdownStyle={styles.select}
          selectedItemStyle={styles.selectedItem}
          options={[
            { label: 'Home', value: 'Home' },
            { label: 'Main Gym', value: 'Main' },
            { label: 'Rimac Gym', value: 'Rimac' },        
          ]}
          selectedValue={workout_location}
          onValueChange={(value) => setLocation(value)}
        />

        <Text style={styles.label}>Workout Types</Text>    
        <Dropdown
          placeholder='Please select your option(s)'
          placeholderStyle={styles.selectedItem}
          dropdownStyle={styles.select}
          selectedItemStyle={styles.selectedItem}
          options={[
            { label: 'Core', value: 'Core' },
            { label: 'Chest', value: 'Chest' },
            { label: 'Back', value: 'Back' },
            { label: 'Arms', value: 'Arms' },
            { label: 'Legs', value: 'Legs' },
          ]}
          isMultiple
          selectedValue={workout_types}
          onValueChange={(value) => setWorkoutTypes(value)}
        />

        <Text style={styles.label}>Gender</Text>    
        <Dropdown
          placeholder='Please select an option'
          placeholderStyle={styles.selectedItem}
          dropdownStyle={styles.select}
          selectedItemStyle={styles.selectedItem}
          options={[
            { label: 'Female', value: 'Female' },
            { label: 'Male', value: 'Male' },
            { label: 'Non-Binary', value: 'Non-Binary' },
            { label: "Don't want to answer", value: 'Prefer Not to Say' },
          ]}
          selectedValue={gender}
          onValueChange={(value) => setGender(value)}
        />

        <Text style={styles.label}>Fitness Level</Text>    
        <Dropdown
          placeholder='Please select an option'
          placeholderStyle={styles.selectedItem}
          dropdownStyle={styles.select}
          selectedItemStyle={styles.selectedItem} 
          options={[
            { label: 'Beginner', value: 1 },
            { label: 'Intermediate', value: 2 },
            { label: 'Expert', value: 3 },
          ]}
          selectedValue={fitness_level}
          onValueChange={(value) => setFitness(value)}
        />

        <Text style={styles.label}>Date of Birth (MM/DD/YYYY)</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="MM/DD/YYYY"
          placeholderTextColor={"white"}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00629B'
  },
  title: {
    marginTop: 50,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    paddingLeft: 50,
  },
  form: {
    width: '80%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: 'white',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: 'black',
    fontSize: 18,
    paddingLeft: 20,
    backgroundColor:"white",
  },
  select: {
    flex: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginTop: 2,
    height: 40,
  },
  selectedItem: {
    color: 'black',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#C69214',
    padding: 8,
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

