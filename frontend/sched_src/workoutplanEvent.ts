export interface WorkoutDetails {
    plan_id: string | null; //some Mongodb ID
    day: string | null; // Monday, Tuesday, etc...
    workout: Workout | null;
}
  
export interface Workout {
    workout_items: WorkoutItem[];
    location: string;
    time: string;
}
  
export interface WorkoutItem {
    id: string;
    type: string;
    duration: string;
    exercises: Exercise[];
}
  
export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps_per_set: number | null;
    rest_between_sets: string;
    equipment: string[];
    difficulty: string;
    notes: string;
}
  

// Example:
{/* 
    GET REQUEST
    IF THERE IS A WORKOUT TODAY
{
    "plan_id": "7f2a0131-f5cd-40a1-b237-1c6a172baf68",
    "day": "Monday",
    "workout": {
      "workout_items": [
        {
          "id": "5e8f8c8f-f8c8-4f8c-8f8c-8f8c8f8c8f8c",
          "type": "cardio",
          "duration": "30 min",
          "exercises": [
            {
              "id": "3a7e2f9d-2f9d-4f9d-8f9d-8f9d8f9d8f9d",
              "name": "Running",
              "sets": 1,
              "reps_per_set": null,
              "rest_between_sets": "0 sec",
              "equipment": ["none"],
              "difficulty": "intermediate",
              "notes": "Steady pace"
            }
          ]
        }
      ],
      "location": "Outdoor",
      "time": "7:00-7:30AM"
    }
  }

  IF THERE IS NO WORKOUT TODAY
{
    "plan_id": null,
    "day": null,
    "workout": null
}

    PUT REQUEST
{
  "workout_items": [
    {
      "type": "cardio",
      "duration": "60 min",
      "exercises": [
        {
          "name": "Running intervals",
          "sets": 5,
          "reps_per_set": 1,
          "rest_between_sets": "60 sec",
          "equipment": ["none"],
          "difficulty": "advanced",
          "notes": "400m sprint followed by 2 min rest"
        }
      ]
    }
  ],
  "location": "Park",
  "time": "7:00-8:00AM"
}    
    */}