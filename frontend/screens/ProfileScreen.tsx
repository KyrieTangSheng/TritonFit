import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper'; // Import IconButton
import profileData from '../assets/mockProfile.json'; // Adjust the path as needed

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

export default function ProfileScreen({setCurrentScreen }: any) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProfile(profileData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (!profile) return <Text>Error loading profile.</Text>;

  return (
    <View style={styles.container}>
      {/* Top Left Icon Button */}
      <IconButton 
        icon="arrow-left" 
        size={24} 
        iconColor="#FFCD00" 
        style={styles.backButton}
        onPress={() => setCurrentScreen('Social')}
      />

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
  container: {padding: '20%', height: '100%', backgroundColor: '#182B49', },
  backButton: { position: 'absolute', top: '3%', left: 0 }, // Position top left
  name: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#F8C471' },
  email: { fontSize: 16, textAlign: 'center', color: '#F8C471', marginBottom: 20 },
  preferenceItem: { backgroundColor: '#00629A', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 3 },
  preferenceTitle: { fontSize: 18, fontWeight: 'bold',color: '#F8C471' },
  preferenceDetail: { fontSize: 16, color: 'white' },
  loadingText: { color: '#FFCD00', fontSize: 18, textAlign: 'center' },
});
