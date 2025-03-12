
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

interface HeaderProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>;
}

export default function Header({ setIsLoggedIn, setCurrentScreen }: HeaderProps) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setCurrentScreen('Front');
    closeMenu();
  };

  const handleAccountSettings = () => {
    setCurrentScreen('Preferences');
    closeMenu();
  };

  return (
    <View style={styles.header}>
      <Text style={styles.topLeftText}>TritonFit</Text>

      {/* Dropdown Menu */}
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
            accessibilityLabel="Open menu"
          />
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingHorizontal: 20,
    backgroundColor: '#00629B',
    height: 80,
  },
  topLeftText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFCD00',
  },
  topRightButton: {
    zIndex: 1,
  },
});
