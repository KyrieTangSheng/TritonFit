// components/GymMateCard.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

type GymMateCardProps = {
  name: string;
  location: string;
  activities: string[];
};

const GymMateCard = (props: GymMateCardProps) => {
  return (
    <View style={styles.gymMateCard}>
      <Text>{props.name}</Text>
      <Text>{props.location}</Text>
      <View>
        {props.activities.map((activity, index) => (
          <Text key={index}>• {activity}</Text>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  gymMateCard: {
    
    paddingBottom: 14,
  },
  text: {
    color: 'white',
  },
})

export default GymMateCard;