
# Schedule API Documentation

## Endpoints

### Get User Schedule

Retrieves the authenticated user's schedule. Creates a new empty schedule if none exists.

**Endpoint:** `GET /users/schedule`

**Headers:**
- `Authorization`: Bearer token


**Response (200 OK):**
```json
{
  "_id": "string",
  "user_id": "string",
  "weekly_slots": [
    {
      "day_of_week": 0,
      "start_time": "09:00:00",
      "end_time": "10:00:00"
    }
  ],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```


**Errors:**

- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found


---

### Update User Schedule

Updates the authenticated user's schedule.

**Endpoint:** `PUT /users/schedule`

**Headers:**
- `Authorization`: Bearer token

**Request Body:**
```json
{
  "weekly_slots": [
    {
      "day_of_week": 0,
      "start_time": "09:00:00",
      "end_time": "10:00:00"
    }
  ]
}
```


**Response (200 OK):**
```json
{
  "_id": "string",
  "user_id": "string",
  "weekly_slots": [
    {
      "day_of_week": 0,
      "start_time": "09:00:00", 
      "end_time": "10:00:00"
    }
  ],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```


**Errors:**

- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found
- `422 Unprocessable Entity`: Invalid schedule data (e.g., end time before start time)


## Notes

- The `day_of_week` field uses integer values (0-6) representing Monday (0) through Sunday (6)
- Times must be in 24-hour format ("HH:MM:SS")
- End time must be after start time for each slot
- All endpoints require authentication via Bearer token