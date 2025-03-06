export interface WorkoutPlan {
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