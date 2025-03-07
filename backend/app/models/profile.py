from typing import Optional, List
from pydantic import BaseModel

class PublicProfile(BaseModel):
    """Public profile information that can be shared with other users"""
    username: str
    email: Optional[str] = None
    fitness_level: Optional[int] = 1
    workout_categories: Optional[List[str]] = []
    workout_types: Optional[List[str]] = []
    workout_location: Optional[str] = None
    # Add any other fields you want to make public
    
    class Config:
        schema_extra = {
            "example": {
                "username": "fitnessuser",
                "email": "user@example.com",
                "fitness_level": 3,
                "workout_categories": ["Strength", "Cardio"],
                "workout_types": ["Core", "HIIT"],
                "workout_location": "Rimac"
            }
        } 