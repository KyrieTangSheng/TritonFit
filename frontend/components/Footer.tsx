import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

interface FooterProps {
  setCurrentScreen: (screen: string) => void;
}

export default function Footer({ setCurrentScreen }: FooterProps) {
  return (
    <View style={styles.bottomButtonBar}>
      <IconButton icon="home" size={30} iconColor="#FFCD00" onPress={() => setCurrentScreen('Home')} />
      <IconButton icon="calendar" size={30} iconColor="#FFCD00" onPress={() => setCurrentScreen('Calendar')} />
      <IconButton icon="dumbbell" size={30} iconColor="#FFCD00" onPress={() => setCurrentScreen('GymPlan')} />
      <IconButton icon="account-multiple-plus-outline" size={30} iconColor="#FFCD00" onPress={() => setCurrentScreen('Social')} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomButtonBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#004B76',
    borderTopWidth: 1,
    borderTopColor: '#FFCD00',
  },
});
