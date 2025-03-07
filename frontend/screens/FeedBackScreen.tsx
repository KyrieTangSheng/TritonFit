import React from 'react';
import { useState } from "react";
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView} from 'react-native';
import { IconButton } from 'react-native-paper'; // Import IconButton
import { feedCalls } from '../src/feedbackCalls';


export default function feedbackScreen({setCurrentScreen }: any) {
    const [text, onChangeBlank] = React.useState('');

    return (
        <View style={schedStyles.blue}>
          {/* Top Left Icon Button */}
      <IconButton 
        icon="arrow-left" 
        size={24} 
        iconColor="#FFCD00" 
        style={schedStyles.backButton}
        onPress={() => setCurrentScreen('GymPlan')}
      />
            {/* Page Title */}
            <View style={schedStyles.headerContainer}>
                <Text style={[schedStyles.headerText, schedStyles.white]}>Feedback</Text>
            </View>

            {/* Text Box */}
            <ScrollView>
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
        marginTop: '10%',
        marginLeft: '5%',
        marginRight: '5%',
        marginBottom: '5%',
        paddingBottom: '60%',
      },

    textInput: {
        padding: 10,
    },
  
    button: {
      position: 'relative',
      alignItems: 'center',
      marginBottom: '90%',
      paddingLeft: 10,
      paddingRight: 10,
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
      left: 0 
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
