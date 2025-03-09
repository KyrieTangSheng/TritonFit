import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import Dropdown from 'react-native-input-select';
import { registerUser } from '../registerCalls'; // Import the API function

export default function RegisterScreen({ setIsLoggedIn, setCurrentScreen }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>, setCurrentScreen: React.Dispatch<React.SetStateAction<string>> }) {

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setCurrentScreen('Front');
  };

  const [data, setData] = useState({
    username: '',
    password: '',
    email: '',
    weight: '',
    height: '',
    workout_location: '',
    workout_categories: [] as string[],
    workout_types: [] as string[],
    gender: '',
    fitness_level: undefined as number | undefined,
    dob: '',
  });

  const handleChange = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const requiredFields = ['username', 'password', 'email', 'workout_location', 'workout_types', 'gender', 'fitness_level', 'dob','workout_categories'];
    
    if (!requiredFields.every((key) => data[key as keyof typeof data])) {
      Alert.alert('Missing Fields', 'Please fill out all required fields before submitting.');
      return;
    }

    const dobRegex = /^(0[1-9]|1[0-2])\/([0-2][1-9]|3[0-1])\/\d{4}$/;
    if (!dobRegex.test(data.dob)) {
      Alert.alert('Invalid Date', 'Please enter a valid date of birth in the format MM/DD/YYYY.');
      return;
    }
    // Convert height and weight to numbers (set to 0 if empty)
    const height = data.height ? parseFloat(data.height) : 0;
    const weight = data.weight ? parseFloat(data.weight) : 0;

    const response = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      profile: {
        dob: data.dob,
        gender: data.gender,
        fitness_level: data.fitness_level!,
        height,
        weight,
        workout_location: data.workout_location,
        workout_categories: data.workout_categories,
        workout_types: data.workout_types,
      },
    });


  if (response.success) {
    Alert.alert('Success', response.message || 'Account has been successfully created.', [
    { text: 'OK', onPress: () => setCurrentScreen('Login') },
    ]);
    } else {
      Alert.alert('Error', response.message || 'Something went wrong.');
    }
    };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <IconButton
          icon="arrow-left"
          size={30}
          iconColor="white"
          style={styles.backButton}
          onPress={handleLogOut}
        />

        <View style={styles.form}>
          <Text style={styles.title}> Register </Text>

          {[
            { label: 'Username', key: 'username' },
            { label: 'Password', key: 'password' },
            { label: 'Email', key: 'email' },
            { label: 'Height (optional, in inches)', key: 'height' },
            { label: 'Weight (optional, in lbs)', key: 'weight' },
            { label: 'Date of Birth (MM/DD/YYYY)', key: 'dob', placeholder: 'MM/DD/YYYY' }
          ].map((field) => (
            <View key={field.key}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={data[field.key as keyof typeof data]?.toString() || ''}
                onChangeText={(value) => handleChange(field.key, value)}
                placeholder={field.placeholder || ''}
                placeholderTextColor="gray"
              />
            </View>
          ))}

          {[
            {
              label: 'Workout Location',
              key: 'workout_location',
              options: [
                { label: 'Home', value: 'Home' },
                { label: 'Main Gym', value: 'Main' },
                { label: 'Rimac Gym', value: 'Rimac' },
              ],
            },
            {
              label: 'Workout Categories',
              key: 'workout_categories',
              options: [
                 { label: 'Strength Training', value: 'Strength' },
                 { label: 'Cardio', value: 'Cardio' },
                 { label: 'Stretching', value: 'Stretching' },
              ],
               isMultiple: true,
            },
            {
              label: 'Workout Types',
              key: 'workout_types',
              options: [
                { label: 'Core', value: 'Core' },
                { label: 'Chest', value: 'Chest' },
                { label: 'Back', value: 'Back' },
                { label: 'Arms', value: 'Arms' },
                { label: 'Legs', value: 'Legs' },
              ],
              isMultiple: true,
            },
            {
              label: 'Gender',
              key: 'gender',
              options: [
                { label: 'Female', value: 'Female' },
                { label: 'Male', value: 'Male' },
                { label: 'Non-Binary', value: 'Non-Binary' },
                { label: "Don't want to answer", value: 'Prefer Not to Say' },
              ],
            },
            {
              label: 'Fitness Level',
              key: 'fitness_level',
              options: [
                { label: 'Beginner', value: 1 },
                { label: 'Intermediate', value: 2 },
                { label: 'Expert', value: 3 },
              ],
            }
          ].map((dropdown) => (
            <View key={dropdown.key}>
              <Text style={styles.label}>{dropdown.label}</Text>
              <Dropdown
                placeholder='Select your option(s)'
                dropdownStyle={styles.select}
                selectedItemStyle={styles.selectedItem}
                options={dropdown.options}
                isMultiple={dropdown.isMultiple}
                selectedValue={data[dropdown.key as keyof typeof data]}
                onValueChange={(value) => handleChange(dropdown.key, value)}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: '23%', backgroundColor: '#182B49' },
  container: { flex: 1 },
  backButton: { position: "relative", top: 40, right: 80 },
  title: { fontWeight: 'bold', fontSize: 30, color: 'white', textAlign: 'center' },
  form: { width: '100%', marginTop: 20 },
  label: { fontSize: 18, fontWeight: 'bold', marginTop: 16, color: 'white' },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, backgroundColor: 'white' },
  button: { backgroundColor: '#C69214', padding: 10, borderRadius: 8, marginTop: 30, marginBottom: 40 },
    select: {
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginTop: 2,
    height: 40,
  },
  selectedItem: {
    color: 'black',
    fontSize: 18,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
