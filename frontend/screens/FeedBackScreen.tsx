import React from 'react';
import { useState } from "react";
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { IconButton } from 'react-native-paper'; // Import IconButton
import { feedCalls } from '../sched_src/feedbackCalls';


export default function feedbackScreen({setCurrentScreen }: any) {
    const [text, onChangeBlank] = React.useState('');

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
                      try {
                        await feedCalls.sendFeedback(text); //API
                        console.log('Feedback sent successfully');
                      } catch (error) {
                        console.error('Error sending feedback:', error);
                      }
                      
                    }} >
                <Text style={[schedStyles.buttonText, schedStyles.gold, schedStyles.white]}>Submit</Text>
                </TouchableOpacity>
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
