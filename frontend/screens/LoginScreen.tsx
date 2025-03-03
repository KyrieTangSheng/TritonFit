import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import config from "../config.tsx";
import axios from "axios";

interface LoginScreenProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentScreen: (screen: string) => void;
}

export default function LoginScreen({ setIsLoggedIn, setCurrentScreen }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post(`${config.BASE_URL}/auth/login`, {
      "username": username,
      "password": password,
    })
      .then(response => {
        console.log(response);
        setIsLoggedIn(true);
        setCurrentScreen('Home');
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.login}>
      <Text style={styles.textInputLabel}>Username</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setUsername}
        value={username}
      />

      <Text style={styles.textInputLabel}>Password</Text>
      <TextInput
        style={styles.textInput}
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Login" onPress={handleLogin} color="#FFCD00" />
    </View>
  );
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
    marginBottom: 10,
  },
  login: {
    width: 190,
  }
});
