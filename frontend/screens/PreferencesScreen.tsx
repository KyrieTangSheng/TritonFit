import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { IconButton } from 'react-native-paper';
import Dropdown from 'react-native-input-select';
import { PreferenceSetting, getPreferences, updatePreferences } from  '../sched_src/preferenceCalls';

export default function PreferencesScreen({ setIsLoggedIn, setCurrentScreen }: 
  { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>, 
    setCurrentScreen: React.Dispatch<React.SetStateAction<string>> }) 
{

  const [preferences, setPreferences] = useState<PreferenceSetting>({
    dob: '',
    gender: '',
    fitness_level: 1,
    height: 0,
    weight: 0,
    workout_location: '',
    workout_categories: [],
    workout_types: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch preferences when the component mounts
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const data = await getPreferences();
        setPreferences(data);  // Set retrieved preferences
      } catch (error) {
        Alert.alert('Error', 'Failed to load preferences');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  // Handles updating state safely
  const handleChange = (key: keyof PreferenceSetting, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const requiredFields: (keyof PreferenceSetting)[] = [
      'workout_location', 'workout_types', 'gender', 'fitness_level', 'dob'
    ];

    if (!requiredFields.every((key) => preferences[key])) {
      Alert.alert('Missing Fields', 'Please fill out all required fields before submitting.');
      return;
    }

    const dobRegex = /^(0[1-9]|1[0-2])\/([0-2][1-9]|3[0-1])\/\d{4}$/;
    if (!dobRegex.test(preferences.dob)) {
      Alert.alert('Invalid Date', 'Please enter a valid date of birth in MM/DD/YYYY format.');
      return;
    }

    try {
      await updatePreferences(preferences);
      Alert.alert('Success', 'Information successfully updated.', [
        { text: 'OK', onPress: () => setCurrentScreen('Home') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        {/* Back Button */}
        <IconButton
          icon="arrow-left"
          size={30}
          iconColor="white"
          style={styles.backButton}
          onPress={() => setCurrentScreen('Home')}
        />

        <View style={styles.form}>
          <Text style={styles.title}>Preferences</Text>

          {/* Input Fields */}
          {[
            { label: 'Height (optional, in inches)', key: 'height', type: 'numeric' },
            { label: 'Weight (optional, in lbs)', key: 'weight', type: 'numeric' },
            { label: 'Date of Birth (MM/DD/YYYY)', key: 'dob', type: 'string', placeholder: 'MM/DD/YYYY' }
          ].map((field) => (
            <View key={field.key}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                value={preferences[field.key as keyof PreferenceSetting]?.toString() || ''}
                onChangeText={(value) => handleChange(field.key as keyof PreferenceSetting, value)}
                placeholder={field.placeholder || ''}
                placeholderTextColor="gray"
                keyboardType={field.type === 'numeric' ? 'numeric' : 'default'}
              />
            </View>
          ))}

          {/* Dropdown Fields */}
          {[
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
                { label: 'Chest', value: 'Chest'},
                { label: 'Back', value: 'Back' },
                { label: 'Arms', value: 'Arms' },
                { label: 'Legs', value: 'Legs' },
              ],
              isMultiple: true,
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
                placeholder="Select your option(s)"
                dropdownStyle={styles.select}
                selectedItemStyle={styles.selectedItem}
                options={dropdown.options}
                isMultiple={dropdown.isMultiple}
                selectedValue={preferences[dropdown.key as keyof PreferenceSetting]}
                onValueChange={(value) => handleChange(dropdown.key as keyof PreferenceSetting, value)}
              />
            </View>
          ))}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: '23%',
    backgroundColor: '#182B49',
  },
  container: {
    flex: 1,
  },
  backButton: {
    position: "relative",
    top: 40,
    right: 80,
  },
  title: {
    marginTop: 3,
    fontWeight: 'bold',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: 20,
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
    backgroundColor: 'white',
  },
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
  button: {
    backgroundColor: '#C69214',
    padding: 10,
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
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  loadingText: {
    fontSize: 20, color: 'white',
  },
});


