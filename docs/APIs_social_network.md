
# Social Network API Documentation


## Endpoints

### Get User's Public Profile

Retrieves the public profile information for a specific user by username.

**Request**

GET /social/users/{username}

**Headers**
Authorization: Bearer <your_access_token>


**Response**
```json
{
  "username": "fitnessuser1",
  "email": "user@example.com",
  "fitness_level": 3,
  "workout_categories": ["Strength", "Cardio"],
  "workout_types": ["Core", "HIIT"],
  "workout_location": "Rimac"
}
```

**Errors**
- `404 Not Found`: User not found
- `401 Unauthorized`: Invalid or expired token



### Get Personalized Recommendations

Retrieves personalized recommendations for a user based on their profile and fitness goals.

**Request**

GET /social/recommendations

**Headers**
Authorization: Bearer <your_access_token>

**Response**
```json
{
  "recommendations": [
    {
      "username": "fitnessuser1",
      "similarity_score": 0.85,
    },
    {
      "username": "runner42",
      "similarity_score": 0.72,
    },
    {
      "username": "yogamaster",
      "similarity_score": 0.65,
    }
  ]
}
```

**Errors**
- `400 Bad Request`: Failed to get recommendations
- `401 Unauthorized`: Invalid or expired token



## Data Models

### PublicProfile

```json
{
  "username": "string",
  "email": "string",
  "fitness_level": "integer",
  "workout_categories": ["string"],
  "workout_types": ["string"],
  "workout_location": "string"
}
```


### Recommendation

```json
{
  "username": "string",
  "similarity_score": "float"
}
```
