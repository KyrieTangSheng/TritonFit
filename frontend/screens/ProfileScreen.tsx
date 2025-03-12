import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Profile {
  username: string;
  email: string;
  fitness_level: number;
  workout_categories: string[];
  workout_types: string[];
  workout_location: string;
}

export default function ProfileScreen({ setCurrentScreen }: any) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Logging to check AsyncStorage data
        const storedProfile = await AsyncStorage.getItem("profile_data");
        console.log("Stored profile data:", storedProfile); // Debugging line

        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          console.error("No profile data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (!profile) {
    return <Text style={styles.errorText}>Error loading profile data.</Text>;
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={24}
        iconColor="#FFCD00"
        style={styles.backButton}
        onPress={() => setCurrentScreen("Social")}
      />

      <Text style={styles.name}>{profile.username}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <View style={styles.preferenceSection}>
        <Text style={styles.preferenceTitle}>Fitness Level: {profile.fitness_level}</Text>

        <Text style={styles.preferenceTitle}>Workout Categories:</Text>
        {profile.workout_categories.map((sport, index) => (
          <Text key={index} style={styles.preferenceDetail}>
            • {sport}
          </Text>
        ))}

        <Text style={styles.preferenceTitle}>Workout Types:</Text>
        {profile.workout_types.map((workout, index) => (
          <Text key={index} style={styles.preferenceDetail}>
            • {workout}
          </Text>
        ))}

        <Text style={styles.preferenceTitle}>Workout Location:</Text>
        <Text style={styles.preferenceDetail}>{profile.workout_location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: "32%", height: "100%", backgroundColor: "#182B49" },
  backButton: { position: "absolute", top: "3%", left: 0 },
  name: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#F8C471" },
  email: { fontSize: 16, textAlign: "center", color: "#F8C471", marginBottom: 10 },
  preferenceSection: { marginTop: 20 },
  preferenceTitle: { fontSize: 18, fontWeight: "bold", color: "#F8C471", marginBottom: 5 },
  preferenceDetail: { fontSize: 16, color: "white" },
  loadingText: { color: "#FFCD00", fontSize: 18, textAlign: "center" },
  errorText: { color: "red", fontSize: 18, textAlign: "center" },
});
