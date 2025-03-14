import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthToken } from "../sched_src/auth";
import { API_BASE_URL } from "../sched_src/config";

type GymMateCardProps = {
  name: string;
  setCurrentScreen: any;
};

const GymMateCard = ({ name, setCurrentScreen }: GymMateCardProps) => {
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/social/users/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        await AsyncStorage.setItem("profile_data", JSON.stringify(data));
        console.log(`Profile of ${name} saved to AsyncStorage.`);
        setCurrentScreen("Profile"); // Navigate to profile after saving
      } else {
        console.error("Error fetching profile:", data?.detail || "Unknown error");
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <TouchableOpacity onPress={fetchProfile}>
      <View style={styles.gymMateCard}>
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gymMateCard: { backgroundColor: "#00629B", borderRadius: 10, padding: 10, marginBottom: 12 },
  name: { color: "white", fontSize: 20, fontWeight: "bold" },
});

export default GymMateCard;
