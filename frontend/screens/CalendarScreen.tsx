import React from 'react';
import { useState } from "react";
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable} from 'react-native';

export default function ScheduleScreen() {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // TODO: getSchedule() from DB
  const scheduledTimes = [
    { start_datetime: "2025-02-17T00:15:00", end_datetime: "2025-02-17T3:30:00" },
    { start_datetime: "2025-02-19T11:15:00", end_datetime: "2025-02-19T13:00:00" },
    { start_datetime: "2025-02-19T15:30:00", end_datetime: "2025-02-19T17:00:00" }
  ];

  // handles if user didn't previously highlight anything 
  if (scheduledTimes.length == 0) {
    scheduledTimes.concat([{ start_datetime: "", end_datetime: "" }])
  }

  // TODO: user holds and drags to highlight

  
  // Received times -> highlighted boxes
  const highlightedSlots: Record<number, Set<string>> = {}; //ensures casting with proper type
  let newSlots: Record<number, Set<string>> = {}; // the new version to be sent to DB
  
  let minHour = 24
  let maxHour = 0

  scheduledTimes.forEach(({ start_datetime, end_datetime }) => {
    const startDate = new Date(start_datetime);
    const endDate = new Date(end_datetime);
    
    const day = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startHour = startDate.getHours();
    const startMins = startDate.getMinutes();
    const endHour = endDate.getHours();
    const endMins = endDate.getMinutes();

    // for how much of calendar to display
    if (startHour < minHour) {
      minHour = startHour
    }
    if (endHour > maxHour) {
      maxHour = endHour
    }
    
    // set of which days the user previously highlighted
    if (!highlightedSlots[day]) {
      highlightedSlots[day] = new Set();
    }
  
    // fixed so start/end time is detecting the minutes too 
    for (let hour = startHour; hour <= endHour; hour++) {
      let minutes = 0
      let stop = 60
      if (hour == startHour){
        minutes = startMins
      }
      else if (hour == endHour){
        stop = endMins + 15
      }
      while (minutes < stop){
        const timeKey = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        highlightedSlots[day].add(timeKey); // time as "HH:mm"
        minutes += 15;
      }
    }
  });

  


  // calendar displays ALL hours (can change to user specified using minHour and maxHour)
  let displayHours = [];
  for (let i = 0; i < 24; i++){
    //outer loop incrementing hours 
    let minsPart = '-15'
    for (let j = 0; j < 4; j++) {
      // inner loop incrementing 15 mins
      let hourPart = i
      let timeDay = 'AM'
      let showTimeDay = false
      let fullTime = ''

      // change 24 hour vers to 12 hour for display
      if (i > 12) {
        hourPart = i-12;
        if (i == 24){
          timeDay = 'AM'
        }
        else {
          timeDay = 'PM'
        }
      }
      else if (i==12){
        timeDay = 'PM'
      }
      else if(i==0) {
        hourPart = i+12
      }

      let minsNum = parseInt(minsPart)
      minsNum += 15
      if (minsNum == 0) {
        minsPart = '00'
        showTimeDay = true
      }
      else{
        minsPart = minsNum.toString()
      }

      // put it all together to make the displayed string
      if (showTimeDay == true){
        fullTime = hourPart + ':' + minsPart + ' ' + timeDay
      }
      else {
        fullTime = hourPart + ':' + minsPart
      }

      let displayTime = fullTime.toString() // display column
      let timeKey = `${String(i).padStart(2, '0')}:${String(minsNum).padStart(2, '0')}`; // 24hr key lookup
    
      displayHours.push({displayTime, timeKey})
      // stores highlights in 24hr, timeKey matches highlights in 24hr, displays 12hr
    }
  }

  
   


  return (
    <View style={schedStyles.blue}>

      {/* Page title */}
      <View style={schedStyles.headerContainer}>
        <Text style={[schedStyles.headerText, schedStyles.white]}>Weekly Availability</Text>
      </View>

      <ScrollView>
        {/* Calendar */}
        <View style={[schedStyles.grid, schedStyles.stone]}>
          {/* Days of the week row */}
          <View style={schedStyles.row}>
            <Text style={[schedStyles.gridItem, schedStyles.backWhite]}></Text> {/* Top-left corner cell */}
            {days.map((day, index) => (
              <Text key={index} style={[schedStyles.gridItem, schedStyles.backWhite, schedStyles.boldText]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Schedule rows */}
          {displayHours.map(({displayTime, timeKey}, rowIndex) => {
            // const hourNumber = parseInt(hour.split(":")[0]); 
            // const minNumber  = parseInt(hour.split(":")[1]); 
            // const timeKey = `${String(hourNumber).padStart(2, '0')}:${String(minNumber).padStart(2, '0')}`;


            return (
              <View style={schedStyles.row} key={rowIndex}>
                {/* Hourly label */}
                <Text style={[schedStyles.gridItem, schedStyles.backWhite, displayTime.includes(":00")  && schedStyles.boldText]}>
                  {/* adds space for AM/PM */}
                  {displayTime.split(" ")[0]} {"\n"} {displayTime.split(" ")[1]} 
                </Text>
                

                {/* Grid cells */}
                {days.map((_, colIndex) => {
                  
                  let isHighlighted = highlightedSlots[colIndex]?.has(timeKey); // checks if this day & time is in the set
                  
                  // changing states: what's highlighted in display, what's in info 
                  const [boolHighlighted, setBoolHighlighted] = useState(isHighlighted);
                  const [highlightArray,  setHighlightArray]  = useState(highlightedSlots);
                  
                  // What to do when user presses grid:
                  const handlePress = (dayIndex: number, timeKey: string) => {
                    // clicks produce the opposite of what was
                    if (highlightArray[dayIndex]?.has(timeKey) == true){
                      // if had, delete
                      highlightArray[dayIndex].delete(timeKey);
                    }
                    else{
                      if (!highlightArray[dayIndex]) {
                        // previously undefined if no slots made on that day
                        highlightArray[dayIndex] = new Set();
                      }
                      // if didn't have, now do
                      highlightArray[dayIndex].add(timeKey);
                    }

                    // highlighted boxes in display change
                    setBoolHighlighted(!boolHighlighted);

                    // the original info array (highlightedSlots) does NOT change
                    // highlightArray is storing the new info -> sends to newSlots
                    newSlots = highlightArray
                  };
                  
                  return (
                    // shows colors AND is pressable
                    <Pressable 
                      key={colIndex} 
                      
                      onPress={() => handlePress(colIndex, timeKey)}
                      style={[
                        schedStyles.gridItem, 
                        boolHighlighted ? schedStyles.gold : schedStyles.stone
                      ]}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Preferences Button */}
      <View>
        <TouchableOpacity style={schedStyles.button}    
            //TODO: send newSlots to DB
            onPress={() => {}} >
          <Text style={[schedStyles.preferences, schedStyles.gold, schedStyles.white]}>Update Availability</Text>
        </TouchableOpacity>

      </View>
        

    </View>
    
  );
};



const schedStyles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
  },

  button: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  preferences: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: '45%',
    fontSize: 18,
    borderRadius: 5, //rounded corners
  },


  blue: {
    flex: 1,
    backgroundColor: '#00629B'
  },
  navy: {
    backgroundColor: '#182B49'
  },
  gold: {
    backgroundColor: '#C69214'
  },
  stone: {
    backgroundColor: '#B6B1A9'
  },
  black: {
    color: '#000000'
  },
  white: {
    color: 'white'
  },
  backWhite:{
    backgroundColor: 'white'
  },
  boldText: {
    fontWeight: 'bold',
  },


  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  gridItem: {
    flex: 1,
    padding: 7,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 0.05,
    paddingHorizontal: 5,
  },

  
});
