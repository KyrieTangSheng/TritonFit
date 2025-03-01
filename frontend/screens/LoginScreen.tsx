import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface LoginScreenProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentScreen: (screen: string) => void; 
}

export default function LoginScreen({ setIsLoggedIn, setCurrentScreen }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
      setIsLoggedIn(true);
      setCurrentScreen('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to TritonFit</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} color="#FFCD00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00629B' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFCD00', marginBottom: 20 },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFCD00',
    borderRadius: 5,
    color: '#FFF',
    backgroundColor: '#004B76',
  },
});