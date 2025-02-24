# Authentication API Documentation

## Endpoints

### Register User
Creates a new user account with profile information.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "profile": {
    "dob": "string (MM/DD/YYYY)",
    "gender": "string (Male, Female, Non-Binary, Don't want to answer)",
    "fitness_level": "integer (1=Beginner, 2=Intermediate, 3=Expert)",
    "height": "integer (optional, in inches)",
    "weight": "integer (optional, in lbs)",
    "workout_location": "string (Home, Main, Rimac)",
    "workout_categories": ["string (Strength, Cardio, Stretching)"],
    "workout_types": ["string (Core, Chest, Back, Arms, Legs)"],
    "schedule": [] // Please just give an empty array when user signs up
  }
}
```

**Response (200 OK):**
```json
{
  "message": "User created successfully"
}
```

**Errors:**
- `400 Bad Request`: Username already exists
- `422 Unprocessable Entity`: Invalid input data

---

### Login
Authenticates a user and returns an access token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

**Errors:**
- `401 Unauthorized`: Invalid credentials

---

### Get Current User
Returns the profile of the currently authenticated user.

**Endpoint:** `GET /auth/me`

**Headers:**
- `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "username": "string",
  "email": "string",
  "created_at": "string (ISO format)"
}
```

**Errors:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

The access token is obtained from the login endpoint and expires after 30 minutes.

