import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

import profileData from '../assets/mockProfile.json'; // Adjust the path to where your JSON file is located

// Step 1: Define TypeScript interfaces for Profile and Preferences
interface Preference {
  id: number;
  title: string;
  details: string | string[];
}

interface Profile {
  name: string;
  email: string;
  preferences: Preference[];
}

export default function ProfileScreen() {
  // Step 2: Type the state explicitly as Profile or null
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay using setTimeout
    setTimeout(() => {
      setProfile(profileData); // Set the profile data from the local JSON file
      setLoading(false); // Set loading to false after the delay
    }, 1000); // Simulated delay of 1 second
  }, []);

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (!profile) return <Text>Error loading profile.</Text>;

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      {/* Profile Preferences List */}
      <FlatList
        data={profile.preferences}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceTitle}>{item.title}</Text>
            {Array.isArray(item.details) ? (
              item.details.map((detail, index) => (
                <Text key={index} style={styles.preferenceDetail}>• {detail}</Text>
              ))
            ) : (
              <Text style={styles.preferenceDetail}>{item.details}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00629B", paddingTop: 70, },
  profileImage: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#FFCD00' },
  email: { fontSize: 16, textAlign: 'center', color: '#FFCD00', marginBottom: 20 },
  preferenceItem: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 3 },
  preferenceTitle: { fontSize: 18, fontWeight: 'bold' },
  preferenceDetail: { fontSize: 16, color: 'gray' },
  loadingText: {color: '#FFCD00', fontSize: 18, textAlign: 'center',
  },
});
