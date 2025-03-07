import React from 'react';
import { useState, useEffect } from "react";
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { IconButton } from 'react-native-paper'; // Import IconButton
import { feedCalls } from '../src/feedbackCalls';
import * as FileSystem from 'expo-file-system'; // if using expoGo
import RNFS from 'react-native-fs'; // if NOT using expoGO


export default function feedbackScreen({setCurrentScreen }: any) {
    // hooks
    const [text, onChangeBlank] = React.useState('');
    const [planId, setPlanId] = useState<string | null>(null);
    const [status, setStatus] = useState('');

    // //expoGo version:
    // const filePath = FileSystem.documentDirectory + 'workoutPlans.json'; //from GymPlanScreen.tsx

    //non expoGo version:
    const filePath = RNFS.DocumentDirectoryPath + '/workoutPlans.json'; 

    // Read plan_id from the file when the screen loads
    useEffect(() => {
      const loadPlanId = async () => {
          try {
              // const fileInfo = await FileSystem.getInfoAsync(filePath); //expoGo
              const fileInfo = await RNFS.stat(filePath); // non-expoGo
              if (fileInfo.isFile()) { //non-expoGo
              // if (fileInfo.exists) { //expoGo
                  // const content = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.UTF8 });
                  const content = await RNFS.readFile(filePath, 'utf8'); // non-expoGo
                  const data = JSON.parse(content);
                  console.log(data)
                  setPlanId(data.planId); // extract plan_id
              } else {
                  console.log('File does not exist.');
              }
          } catch (error) {
              console.error('Error reading file:', error);
          }
      };

      loadPlanId();
    }, []);

    return (
        <View style={[schedStyles.blue, {flexWrap: 'wrap'}]}>
            {/* Top Left Icon Button */}
            <IconButton 
              icon="arrow-left" 
              size={24} 
              iconColor="#FFCD00" 
              style={schedStyles.backButton}
              onPress={() => setCurrentScreen('GymPlan')}
            />

            {/* Page Title */}
            <View>
                <Text style={[schedStyles.headerContainer, schedStyles.headerText, schedStyles.white]}>Feedback</Text>
            </View>

            {/* Text Box */}
            <ScrollView style = {schedStyles.containerFeedback}>
                <SafeAreaView
                    style={[schedStyles.containerFeedback, schedStyles.backWhite]}>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={40}
                        onChangeText={onChangeBlank}
                        value={text}
                        placeholder="Type here..."
                        style={schedStyles.textInput}
                    />
                </SafeAreaView>
            </ScrollView>

            {/* Preferences Button */}
            <View>
                <TouchableOpacity style={schedStyles.button} 
                      // send to DB
                    onPress={async() => {
                      if (!planId) {
                        console.error('plan_id not available yet');
                        return;
                    }
                      try {
                        setStatus('Sending feedback. Please wait...');
                        await feedCalls.sendFeedback(text, planId); //API
                        setStatus('Feedback sent successfully!');
                      } catch (error) {
                        console.error('Error sending feedback:', error);
                        setStatus('Failed to send feedback');
                      }
                      
                    }} >
                <Text style={[schedStyles.buttonText, schedStyles.gold, schedStyles.white]}>Submit</Text>
                </TouchableOpacity>

                {/* Display Feedback Status */}
                {status && (
                    <Text style={[schedStyles.white]}>
                        {status}
                    </Text>
                )}
            </View>
        </View>

        
    )
};

const schedStyles = StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      marginTop: 50,
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 30,
    },

    containerFeedback: {
        flex: 1,
        marginTop: '5%',
        marginLeft: '-20%',
        marginRight: '-20%',
        paddingBottom: '100%',
        paddingLeft: '10%',
        paddingRight: '10%',
        borderRadius: 5,
      },

    textInput: {
        padding: 10,
        flexWrap: 'wrap',
        width: '100%',
    },
  
    button: {
      position: 'relative',
      alignItems: 'center',
      marginBottom: '90%',
      marginLeft: '-20%',
      marginRight: '-20%',
      paddingLeft: -20,
      paddingRight: -20,
    },
    buttonText: {
      textAlign: 'center',
      fontWeight: 'bold',
      width: '40%',
      fontSize: 18,
      borderRadius: 5, //rounded corners
    },
    backButton: { 
      position: 'absolute',
      top: '3%',
      left: "-15%"
    },
  
  
    blue: {
      flex: 1,
      backgroundColor: '#00629B'
    },
    navy: {
      backgroundColor: '#182B49'
    },
    gold: {
      backgroundColor: '#C69214'
    },
    stone: {
      backgroundColor: '#B6B1A9'
    },
    black: {
      color: '#000000'
    },
    white: {
      color: 'white'
    },
    backWhite:{
      backgroundColor: 'white'
    },
    boldText: {
      fontWeight: 'bold',
    },
  });
