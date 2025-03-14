// screens/SocialScreen.tsx
import React, {useEffect, useState} from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import GymMateCard from "../components/GymMateCard";
import {API_BASE_URL} from "../sched_src/config.ts";
import {getAuthToken} from "../sched_src/auth.ts";
import axios from "axios";

type GymMate = {
  preferences: {
    FitnessLevel: number;
    Sports: string[];
    WorkoutTypes: string[];
    username: string;
  };
  similarity: number;
  username: string;
}


export default function SocialScreen({ setCurrentScreen }: any) {
  const[recommendation, setRecommendation] = useState<GymMate[]>([]);

  useEffect(() => {
    getAuthToken()
      .then(token => {
        console.log(token)
        let auth_str = `Bearer ${token}`
        axios.get(`${API_BASE_URL}/social/recommendations`, {
          'headers': {
            'Authorization': auth_str
          }
        })
          .then(response => {
            console.log(response.data.recommendations);
            setRecommendation(response.data.recommendations);
          })
          .catch(error => {
            console.error(error)
          });
      })
      .catch(error => {
        console.error(error)
      })

  }, [])
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This Function aims to match your with Gym Mates that 
        have similar characteristics with you, including same 
        gym, similiar fitness goals, and sharing compatible 
        workout schedules.
      </Text>
      <Text style={styles.title}>Sorted By Gym</Text>
      {recommendation.map((mate, index) => (
        <GymMateCard
          key={index}
          name={mate.username}
          // location={mate.location}
          // activities={mate.activities}
          setCurrentScreen={setCurrentScreen}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    height: '100%',
    backgroundColor: '#182B49',
  },
  text: {
    color: 'white',
  },
  title: {
    fontSize: 30,
    marginTop: 30,
    color: 'white',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#C69214',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    borderRadius: 8,
    marginBottom: 30, // Adds spacing between buttons
    width: 190,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInputLabel: {
    color: 'white',
    alignSelf: 'flex-start',
    fontSize: 16,
  },
  textInput: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  login: {
    width: 190,
  },
});
