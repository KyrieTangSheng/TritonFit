import React from 'react';
import { useState, useRef, useEffect, useCallback } from "react";
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable} from 'react-native';
import { schedCalls } from './sched_src/scheduleCalls';
import { ScheduleEvent, WeeklySlot } from  './sched_src/schedEvent';

export default function ScheduleScreen() {

  // CREATE HOOKS (monitoring states)
  const [scheduledTimes, setScheduledEvent] = useState<ScheduleEvent | null>(null); // fetched data
  const [isLoading, setIsLoading] = useState(true); // loading screen
  const [highlightedSlots, setHighlightedSlots] = useState<Record<number, Set<string>>>({}); // display data 
  const highlightRef = useRef(highlightedSlots); // final state of the display
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; 


  // RETRIEVE DATA FROM DB
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const schedule = await schedCalls.getSchedule(); //API call
        setScheduledEvent(schedule);
      } catch (error) {
        console.error('Error retrieving schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);


  // CONVERT RETRIEVED TIMES FORMAT -> HIGHLIGHTED BOXES FOR THE DISPLAY 
  useEffect(() => {
    if (!scheduledTimes) return;

    setHighlightedSlots((prev) => {
      const newSlots: Record<number, Set<string>> = {}; 

      scheduledTimes.weekly_slots.forEach(({ day_of_week, start_time, end_time }) => {
        
        // if there is no data for this day, create a new set
        if (!newSlots[day_of_week]) newSlots[day_of_week] = new Set();
        const [startHour, startMins] = start_time.split(":").map(Number);
        const [endHour, endMins] = end_time.split(":").map(Number);
        
        // record all the slots between start and stop time as highlighted
        for (let hour = startHour; hour <= endHour; hour++) {
          let minutes = hour === startHour ? startMins : 0;
          const stop = hour === endHour ? endMins : 60;
          while (minutes < stop) {
            // each day could have multiple sets due to discontinuous scheduling
            newSlots[day_of_week].add(`${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
            minutes += 15;
          }
        }
      });

      // update ref
      highlightRef.current = newSlots;
      return newSlots;
    });
  }, [scheduledTimes]);

  

  // CREATE TIMETABLE FOR ALL HOURS BEING DISPLAYED
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
      // !! stores highlights in 24hr, timeKey matches highlights in 24hr, displays 12hr
    }
  }



  // CONVERSION FUNCTIONS -- time string "HH:mm" to minutes since midnight, and back
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };



  // CONVERT FINAL SCHEDULE TO CORRECT FORMAT FOR SENDING TO DB
  // AKA take the last highlightedSlots state and translate into DB data
  const genSlots = (finalSlots: Record<number, Set<string>>) => {
    // highlightedSlots -> sendSlots
    let sendSlots: { weekly_slots: WeeklySlot[] } = { weekly_slots: [] };
  
    Object.entries(finalSlots).forEach(([day, timeSet]) => {
      // sort and figure out where to start from 
      const dayIndex = Number(day);
      const sortedTimes = Array.from(timeSet).sort((a, b) => a.localeCompare(b));
      if (sortedTimes.length === 0) return; // makes sure this day has times
  
      let minStart = sortedTimes[0];
      let prevTime = timeToMinutes(minStart);
  
      // group continuous intervals
      for (let i = 1; i <= sortedTimes.length; i++) {
        // handle both discontinuity and the final element
        if (i === sortedTimes.length || timeToMinutes(sortedTimes[i]) !== prevTime + 15) {
          // add 15 mins and convert back to string
          const endingNum = prevTime + 15;
          const endingStr = minutesToTime(endingNum);

          // make an entry
          sendSlots.weekly_slots.push({
            day_of_week: dayIndex,
            start_time: minStart + ":00",
            end_time: endingStr + ":00",
          });

          if (i < sortedTimes.length) {
            // discontinuous so new minStart
            minStart = sortedTimes[i];
          }
        }
        if (i < sortedTimes.length) {
          prevTime = timeToMinutes(sortedTimes[i]);
        }
      }
    });
  
    return sendSlots;
  };
  

  // WHAT TO DO WHEN USER PRESSES A SLOT:
  const handlePress = useCallback((dayIndex: number, timeKey: string) => {
    setHighlightedSlots((prev) => {
      const newSlots = { ...prev };
      // if had this slot stored, delete
      if (newSlots[dayIndex]?.has(timeKey)) {
        newSlots[dayIndex].delete(timeKey);
      } else {
        // if didn't have, now do
        if (!newSlots[dayIndex]) newSlots[dayIndex] = new Set();
        newSlots[dayIndex].add(timeKey);
      }
      // store the latest value
      highlightRef.current = newSlots;
      return { ...newSlots };
    });
  }, []);


  // Show loading state while fetching
  if (isLoading) {
    return <Text style={schedStyles.white}>Loading calendar...</Text>;
  }

  
  // WHAT USER SEES:
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
            <Text style={[schedStyles.gridItem, schedStyles.backWhite]}></Text>
            {days.map((day, index) => (
              <Text key={index} style={[schedStyles.gridItem, schedStyles.backWhite, schedStyles.boldText]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Schedule rows */}
          {displayHours.map(({ displayTime, timeKey }, rowIndex) => (
            <View style={schedStyles.row} key={rowIndex}>
              {/* Hourly label */}
              <Text style={[schedStyles.gridItem, schedStyles.backWhite, displayTime.includes(":00") && schedStyles.boldText]}>
                {/* equal-sized squares (adds space for AM/PM) */}
                {displayTime.split(" ")[0]} {"\n"} {displayTime.split(" ")[1]} 
              </Text>

              {/* Grid cells */}
              {days.map((_, colIndex) => {
                // check if this day & time is in the set
                const isHighlighted = highlightedSlots[colIndex]?.has(timeKey);
                return (
                  <Pressable 
                    key={colIndex} 
                    // update stored data
                    onPress={() => handlePress(colIndex, timeKey)}
                    // change color
                    style={[schedStyles.gridItem, isHighlighted ? schedStyles.gold : schedStyles.stone]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Preferences Button */}
      <View>
        <TouchableOpacity 
          style={schedStyles.button}
          onPress={async () => {
            // correctly format last state
            const newSchedule = genSlots(highlightRef.current);

            // send to DB
            try {
              await schedCalls.updateSchedule(newSchedule.weekly_slots); //API
              console.log('Schedule updated successfully');
            } catch (error) {
              console.error('Error updating schedule:', error);
            }
          }}
        >
          <Text style={[schedStyles.preferences, schedStyles.gold, schedStyles.white]}>Update Availability</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}




const schedStyles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: 25,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
  },

  button: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 20,
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
    flex: 1,
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
