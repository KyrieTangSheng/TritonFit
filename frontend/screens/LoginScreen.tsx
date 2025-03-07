import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {API_BASE_URL} from "../sched_src/config.ts";
import {setAuthToken} from "../sched_src/auth.ts"
import axios from "axios";

interface LoginScreenProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentScreen: (screen: string) => void;
}

export default function LoginScreen({ setIsLoggedIn, setCurrentScreen }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post(`${API_BASE_URL}/auth/login`, {
      "username": username,
      "password": password,
    })
      .then(response => {
        console.log(response);
        let data = response.data;
        let token = data["access_token"];
        setAuthToken(token);
        setIsLoggedIn(true);
        setCurrentScreen('Home');
      })
      .catch(error => {
        console.log(error);
        if(error.response && error.response.status === 401) {
          Alert.alert("Login Failed", "Cannot find that combination of username and password.");
        }
      });
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
