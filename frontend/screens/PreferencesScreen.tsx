import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// import Dropdown from 'react-native-input-select';
import Dropdown from 'react-native-input-select';

const EditProfileView = () => {


  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [workout_location, setLocation] = useState("");
  const [workout_types, setWorkoutTypes] = useState("");
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [fitness_level, setFitness] = useState();
  const handleSubmit = () => {

  }

  return (
    
    <View style={styles.container}>
      
      <View style={styles.form}>
        <Text style={styles.title}>Profile</Text>
       
        <Text style={styles.label}>Height (optional, in inches)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
        />
       
        <Text style={styles.label}>Weight (optional, in lbs)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
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
            { label: "Don't want to answer", value: 'Non-Binary' },
          ]}
          isMultiple
          selectedValue={workout_location}
          onValueChange={(value) => setLocation(value)}
        />


      <Text style={styles.label}>Workout Types</Text>    
        <Dropdown
          placeholder='Please select an option'
          placeholderStyle={styles.selectedItem}
          dropdownStyle={styles.select}
          selectedItemStyle={styles.selectedItem}
          options={[
            { label: 'Core', value: 'Core' },
            { label: 'Chest', value: 'Chest' },
            { label: 'Back', value: 'Back' },
            { label: "Arms", value: 'Arms' },
            { label: "Legs", value: 'Legs' },
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
            { label: "Don't want to answer", value: 'Non-Binary' },
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
            { label: 'Intermediate', value: 2},
            { label: 'Expert', value: 3 },
          ]}
          selectedValue={fitness_level}
          onValueChange={(value) => setFitness(value)}
        />

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#182B49',
    paddingTop: 10,
    paddingBottom:10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingTop: 20,
    color: 'white',

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
    color: 'white',
    fontSize: 18,
    paddingLeft: 20
  },
  select: {
    flex: 1,
    borderColor: '#ccc',
    backgroundColor: '#182B49',
    marginTop: 2,
    height: 30,
  },
  selectedItem: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#C69214',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    borderRadius: 8,
    marginTop: 30, // Adds spacing between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});


export default EditProfileView;
