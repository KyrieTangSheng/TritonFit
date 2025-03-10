// components/GymMateCard.tsx
import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";

type GymMateCardProps = {
  name: string;
  // location: string;
  // activities: string[];
  setCurrentScreen: any;
};

const GymMateCard = (props: GymMateCardProps) => {
  const handleClick = () => {
    props.setCurrentScreen("Profile");
  };

  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.gymMateCard}>
        <Text style={styles.name}>{props.name}</Text>
        {/* <Text style={styles.text}>{props.location}</Text> */}
        {/* <View>
          {props.activities.map((activity, index) => (
            <Text key={index} style={styles.text}>• {activity}</Text>
          ))}
        </View> */}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  gymMateCard: {
    backgroundColor: '#00629B',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  text: {
    color: 'white',
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
})

export default GymMateCard;