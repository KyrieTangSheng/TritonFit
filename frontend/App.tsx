// App.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Button } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

// Import Screens
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import GymPlanScreen from './screens/GymPlanScreen';
import SocialScreen from './screens/SocialScreen';
import LoginScreen from './screens/LoginScreen';
import PreferencesScreen from './screens/PreferencesScreen'; 
import ProfileScreen from './screens/ProfileScreen'; 

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderScreen = () => {
    if (!isLoggedIn) {
      return <LoginScreen setIsLoggedIn={setIsLoggedIn} setCurrentScreen={setCurrentScreen} />;
    }
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Calendar':
        return <CalendarScreen />;
      case 'GymPlan':
        return <GymPlanScreen />;
      case 'Social':
        return <SocialScreen setCurrentScreen={setCurrentScreen} />;
      case 'Preferences':
        return <PreferencesScreen />;
      case 'Profile': // Add the Profile case here
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} setCurrentScreen={setCurrentScreen} />}
        <View style={styles.content}>{renderScreen()}</View>
        {isLoggedIn && <Footer setCurrentScreen={setCurrentScreen} />}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00629B' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomButtonBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#004B76',
    borderTopWidth: 1,
    borderTopColor: '#FFCD00',
  },
});
