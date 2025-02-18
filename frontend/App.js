// App.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Front from './screens/Front'; // Import Front screen

const App = () => {
  return (
    <View style={styles.container}>
      <Front />  {/* Render Front screen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
