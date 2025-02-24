import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity} from 'react-native'
// npm install @react-native-community/checkbox --save
import ProgressBar from "react-native-progress-step-bar";




const workoutPlan = () => {
  const handleModify = () => {

  }
  const handleFeedback = () => {

  }

  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const handleCheck = (taskId: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };
 const [currentStep, setCurrentStep] = useState(0);
 const handlePrevStep = useCallback(() => {
  setCurrentStep((prevStep) => prevStep - 1);
 }, []);

 const handleNextStep = useCallback(() => {
  setCurrentStep((prevStep) => prevStep + 1);
 }, []);


  const plan = {
    title: 'My Workout Plan',
  
    content: "Let's work out today!",
    steps: [
      {
        id: 1,
        name: '10 min cardio',
        task: ['10 jumping jacks','5 planks'],
       
      },
      {
        id: 2,
        name: '5 min Mobility',
        task: '20 Lunges',
      },
    ],
    location: "Main Gym",
    time: "3:00 - 3:15 PM",
  }

  return (
    <ScrollView>

      <View style={styles.container}>
      <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.content}>{plan.content}</Text>

      <View style={styles.planContainer}>
        <Text style={styles.sectionTitle}>Today's work out</Text>
        <FlatList
          scrollEnabled={false}
          data={plan.steps}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.planTextContainer}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                {/* Handle multiple tasks */}
                {Array.isArray(item.task) ? (
                  item.task.map((task, index) => (
                    <Text key={index} style={styles.workoutTask}>
                      - {task}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.workoutTask}>- {item.task}</Text>
                )}
              </View>
            </View>
          )}
        />
        <Text style={styles.sectionTitle}>Workout Location: </Text>
        <Text style={styles.sectionContent}>{plan.location}</Text>
        <Text style={styles.sectionTitle}>Workout Time: </Text>
        <Text style={styles.sectionContent}>{plan.time}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleModify()}>
                <Text style={styles.buttonText}>Modify Plan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleFeedback()}>
                <Text style={styles.buttonText}>Feedback</Text>
      </TouchableOpacity>
      <Text style={styles.bar}>Progress Bar</Text>

      </View>
      <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ marginBottom: 40 }}>
         <ProgressBar
            steps={3}
            dotDiameter={20}
            width={320}
            height={10}
            currentStep={currentStep}
            stepToStepAnimationDuration={200}
            backgroundBarStyle={{ backgroundColor: '#C69214' }}
            filledBarStyle={{ backgroundColor: '#182B49' }}
            filledDotStyle={{ backgroundColor: '#C69214' }}
            withDots
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: 400,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          onPress={handlePrevStep}
          style={styles.progressButton}
        >
          <Text style={styles.progressButtonText}>Prev Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextStep}
          style={styles.progressButton}
        >
          <Text style={styles.progressButtonText}>Next Task</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
   
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 20,    
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft:35,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    marginLeft:80,
    
  },
  sectionTitle: {
    color: '#F8C471',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 13,
    marginLeft: 10,

  },
  sectionContent: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
    marginLeft: 30,
  },
  planContainer: {
    backgroundColor: '#182B49',
    marginTop: 20,
    paddingBottom:20,
  },

  planTextContainer: {
    marginLeft: 20,
  },
  name: {
    color: "white",
    borderRadius: 5,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  workoutTask: {
    color: "white",
    fontSize: 18,
    padding: 15,
    marginTop: 5,
  },
  bar: {
    color: "black",
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 10,
  },

  button: {
    backgroundColor: '#C69214',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    borderRadius: 8,
    marginTop: 30, // Adds spacing between buttons
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressButton: {
    backgroundColor: '#C69214',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    borderRadius: 8,
    marginRight: 30,
    marginLeft: 30,
  },
  progressButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
})
export default workoutPlan;
