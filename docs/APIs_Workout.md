# Workout API Documentation

## Overview

This document outlines the API endpoints for managing workout plans in the fitness application. All endpoints require authentication via Bearer token.


## Base URL
```
/workout-plans
```


## Authentication

All endpoints require a valid JWT token provided in the Authorization header:
Authorization: Bearer <your_access_token>


## Endpoints

### Generate a Workout Plan

Creates a new personalized workout plan based on the user's preferences.

**Request**
POST /workout-plans/

**Headers**
Authorization: Bearer <your_access_token>
Content-Type: application/json

**Response**

```json
{
  "id": "7f2a0131-f5cd-40a1-b237-1c6a172baf68",
  "user_id": "67bbfdc30ce43b274b3526f1",
  "created_at": "2025-03-01T06:15:29.970000",
  "updated_at": "2025-03-01T06:15:29.970000",
  "status": "active",
  "version": 1,
  "feedback_history": [],
  "days": {
    "Monday": {
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
    },
    "Tuesday": {
      /* Similar structure for other days */
    },
    /* ... Remaining days of the week ... */
  }
}
```



### Get Today's Workout

Retrieves the workout scheduled for the current day.


**Request**
GET /workout-plans/today

**Headers**
Authorization: Bearer <your_access_token>

**Response**

```json
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
```

**Note**: If no workout is found for today, returns:
```json
{
  "plan_id": null,
  "day": null,
  "workout": null
}
```


### Get Specific Workout Plan

Retrieves a specific workout plan by its ID.


**Request**
GET /workout-plans/{plan_id}

**Headers**
Authorization: Bearer <your_access_token>


**Path Parameters**
- `plan_id` (string, required): The ID of the workout plan


**Response**
Same format as "Generate a Workout Plan" response.

**Errors**
- `404 Not Found`: Workout plan not found

### Manually Update Entire Workout Plan
Updates an entire workout plan with new data.

**Request**
PUT /workout-plans/{plan_id}

Authorization: Bearer <your_access_token>
Content-Type: application/json


**Path Parameters**
- `plan_id` (string, required): The ID of the workout plan


**Request Body**
```json
{
  "id": "7f2a0131-f5cd-40a1-b237-1c6a172baf68",
  "user_id": "67bbfdc30ce43b274b3526f1",
  "status": "active",
  "days": {
    "Monday": {
      "workout_items": [
        {
          "type": "strength",
          "duration": "45 min",
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps_per_set": 15,
              "rest_between_sets": "60 sec",
              "equipment": ["none"],
              "difficulty": "intermediate",
              "notes": "Focus on form"
            }
          ]
        }
      ],
      "location": "Home",
      "time": "6:00-6:45AM"
    },
    /* ... Other days ... */
  }
}
```

**Response**
Updated workout plan in the same format as "Generate a Workout Plan" response.

**Errors**
- `404 Not Found`: Workout plan not found


### Update a Specific Day's Workout
Updates a specific day in a workout plan.

**Request**
PUT /workout-plans/{plan_id}/days/{day}

**Headers**
Authorization: Bearer <your_access_token>
Content-Type: application/json


**Path Parameters**

- `plan_id` (string, required): The ID of the workout plan
- `day` (string, required): Day of the week (Monday, Tuesday, etc.)


**Request Body**
```json
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
```

**Response**
Updated workout plan in the same format as "Generate a Workout Plan" response.

**Errors**
- `404 Not Found`: Workout plan not found




### Update Specific Workout Item
Updates a specific workout item in a workout plan.

**Request**
PUT /workout-plans/{plan_id}/days/{day}/items/{item_index}

**Headers**
Authorization: Bearer <your_access_token>
Content-Type: application/json


**Path Parameters**

- `plan_id` (string, required): The ID of the workout plan
- `day` (string, required): Day of the week (Monday, Tuesday, etc.)
- `item_index` (integer, required): Index of the workout item to update


**Request Body**
```json
{
  "type": "strength",
  "duration": "45 min",
  "exercises": [
    {
      "name": "Weighted squats",
      "sets": 4,
      "reps_per_set": 12,
      "rest_between_sets": "90 sec",
      "equipment": ["dumbbells"],
      "difficulty": "advanced",
      "notes": "Use heavier weights than last time"
    },
    {
      "name": "Deadlifts",
      "sets": 4,
      "reps_per_set": 10,
      "rest_between_sets": "90 sec",
      "equipment": ["barbell"],
      "difficulty": "advanced",
      "notes": "Focus on form"
    }
  ]
}
```

**Response**
Updated workout plan in the same format as "Generate a Workout Plan" response.

**Errors**
- `404 Not Found`: Workout plan not found



### Provide Feedback on Workout Plan
Updates a workout plan based on user feedback, generating a new version.

**Request**
POST /workout-plans/{plan_id}/feedback

**Headers**
Authorization: Bearer <your_access_token>
Content-Type: application/json


**Path Parameters**

- `plan_id` (string, required): The ID of the workout plan


**Request Body**
```json
{
  "feedback": "I found this workout too challenging. Please adjust the intensity."
}
```

**Response**
Updated workout plan in the same format as "Generate a Workout Plan" response.

**Errors**
- `404 Not Found`: Workout plan not found



## Data Models

### Workout Plan

```json
{
  "id": "string",
  "user_id": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "status": "string",
  "version": "integer",
  "feedback_history": [
    {
      "feedback": "string",
      "timestamp": "datetime",
      "resulted_in_version": "integer"
    }
  ],
  "days": {
    "day_name": {
      "workout_items": [
        {
          "id": "string",
          "type": "string",
          "duration": "string",
          "exercises": [
            {
              "id": "string",
              "name": "string",
              "sets": "integer",
              "reps_per_set": "integer",
              "rest_between_sets": "string",
              "equipment": ["string"],
              "difficulty": "string",
              "notes": "string"
            }
          ]
        }
      ],
      "location": "string",
      "time": "string"
    }
  }
}
```



