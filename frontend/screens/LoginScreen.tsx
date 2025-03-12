import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import {API_BASE_URL} from "../sched_src/config.ts";
import {setAuthToken} from "../sched_src/auth.ts"
import { IconButton } from 'react-native-paper'; // Import IconButton
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
    <View style={styles.container}>
        <IconButton 
          icon="arrow-left" 
          size={24} 
          iconColor="#FFCD00" 
          style={styles.backButton}
          onPress={() => setCurrentScreen('Front')}
        />
      <View style={styles.login}>

        <Text style={styles.textInputLabel}>Username</Text>
        <TextInput
          testID="username-input"
          style={styles.textInput}
          onChangeText={setUsername}
          value={username}
        />

        <Text style={styles.textInputLabel}>Password</Text>
        <TextInput
          testID="password-input"
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182B49",
    paddingBottom: 40,
    width: "100%",
  },
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
    borderRadius: 8,
    marginBottom: 10,
  },
  login: {
    width: 190,
  },
  backButton: { 
    position: 'absolute',
    top: '3%',
    left: 0, 
    zIndex: 10,
  },
});
