import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import GymMateCard from "../components/GymMateCard";
import { API_BASE_URL } from "../sched_src/config.ts";
import { getAuthToken } from "../sched_src/auth.ts";
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
};

export default function SocialScreen({ setCurrentScreen }: any) {
  const [recommendation, setRecommendation] = useState<GymMate[]>([]);

  useEffect(() => {
    getAuthToken()
      .then((token) => {
        console.log(token);
        let auth_str = `Bearer ${token}`;
        axios
          .get(`${API_BASE_URL}/social/recommendations`, {
            headers: {
              Authorization: auth_str,
            },
          })
          .then((response) => {
            console.log(response.data.recommendations);
            setRecommendation(response.data.recommendations);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Handler to store data in AsyncStorage when a card is clicked
  const handleCardClick = (mate: GymMate) => {
    // Pass the selected mate's data to GymMateCard
    console.log("Card clicked", mate);
  };

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
          setCurrentScreen={setCurrentScreen}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "5%",
    height: "100%",
    backgroundColor: "#182B49",
  },
  text: {
    color: "white",
  },
  title: {
    fontSize: 30,
    marginTop: 30,
    color: "white",
    marginBottom: 12,
  },
});
