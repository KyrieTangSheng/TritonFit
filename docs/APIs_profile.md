# Profile API Documentation

## Endpoints

### Get User Profile
Retrieves the profile information for the authenticated user.

**Endpoint:** `GET /users/profile`

**Headers:**
- `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "_id": "string",
  "user_id": "string",
  "dob": "01/01/2000",
  "gender": "Male",
  "fitness_level": 1,
  "height": 70,
  "weight": 150,
  "workout_location": "Rimac",
  "workout_categories": ["Strength", "Cardio"],
  "workout_types": ["Core", "Chest"],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Profile not found

---

### Update User Profile
Updates the profile information for the authenticated user. All fields are optional - only provided fields will be updated.

**Endpoint:** `PUT /users/profile`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "dob": "string (MM/DD/YYYY)",
  "gender": "string (Male, Female, Non-Binary, Don't want to answer)",
  "fitness_level": "integer (1=Beginner, 2=Intermediate, 3=Expert)",
  "height": "integer (optional, in inches)",
  "weight": "integer (optional, in lbs)",
  "workout_location": "string (Home, Main, Rimac)",
  "workout_categories": ["string (Strength, Cardio, Stretching)"],
  "workout_types": ["string (Core, Chest, Back, Arms, Legs)"]
}
```

**Response (200 OK):**
```json
{
  "_id": "string",
  "user_id": "string",
  "dob": "01/01/2000",
  "gender": "Male",
  "fitness_level": 1,
  "height": 70,
  "weight": 150,
  "workout_location": "Rimac",
  "workout_categories": ["Strength", "Cardio"],
  "workout_types": ["Core", "Chest"],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Profile not found
- `422 Unprocessable Entity`: Invalid profile data

## Notes

- All endpoints require authentication via Bearer token
- For the update endpoint, only include fields you want to modify
- The `fitness_level` field uses integer values (1=Beginner, 2=Intermediate, 3=Expert)
- Height is in inches, weight is in pounds
- `workout_categories` and `workout_types` must be arrays containing valid values
- Date of birth (dob) must be in MM/DD/YYYY format 