// screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, TextInput } from "react-native";

interface LoginScreenProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentScreen: (screen: string) => void; 
}

const LoginScreen = ({ setIsLoggedIn, setCurrentScreen }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('Social');
  };
  
  return (
    <View style={styles.login}>
      <Text style={styles.textInputLabel}>Username</Text>
      <TextInput style={styles.textInput}></TextInput>

      <Text style={styles.textInputLabel}>Password</Text>
      <TextInput style={styles.textInput} secureTextEntry={true}></TextInput>

      <Button title="Login" onPress={handleLogin} color="#FFCD00" />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
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
  }
});

export default LoginScreen;
