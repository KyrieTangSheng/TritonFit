import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

export default function Header({ setIsLoggedIn, setCurrentScreen }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>, setCurrentScreen: React.Dispatch<React.SetStateAction<string>> }) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogOut = () => {
    setIsLoggedIn(false); // Set login state to false
    setCurrentScreen('Front'); // Navigate to Login screen
  };

  const handleAccountSettings = () => {
    setIsLoggedIn(true);
    setCurrentScreen('Preferences'); // Navigate to Preferences screen
  };

  return (
    <View style={styles.header}>
      <Text style={styles.topLeftText}>TritonFit</Text>

      {/* Dropdown button */}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon="account-outline"
            size={30}
            iconColor="#FFCD00"
            onPress={openMenu}
            style={styles.topRightButton}
          />
        }
        anchorPosition="bottom" // Ensures the dropdown opens below the icon
      >
        <Menu.Item onPress={handleAccountSettings} title="Account Preferences" />
        <Menu.Item onPress={handleLogOut} title="Log Out" />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures left and right alignment
    alignItems: 'center', // Centers items vertically
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50, // Adjust for status bar
    paddingHorizontal: 20, // Keeps elements spaced from edges
    backgroundColor: '#00629B',
    height: 80, // Ensures space for elements
  },
  topLeftText: {
    fontSize: 24, // Adjust size as needed
    fontWeight: 'bold', // Make it stand out
    color: '#FFCD00', // Color for contrast
    marginRight: 10, // Adds a little space between the text and the icon
  },
  topRightButton: {
    zIndex: 1, // Ensures the button is on top of other elements
  },
});
