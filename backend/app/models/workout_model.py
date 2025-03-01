from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import uuid

class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    sets: Optional[int] = None
    reps_per_set: Optional[int] = None
    rest_between_sets: Optional[str] = None
    equipment: List[str] = []
    difficulty: Optional[str] = None
    notes: Optional[str] = None

class WorkoutItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # e.g., "cardio", "strength", "mobility"
    duration: str
    exercises: List[Exercise]

class DayWorkout(BaseModel):
    workout_items: List[WorkoutItem]
    location: Optional[str] = None
    time: Optional[str] = None

class FeedbackEntry(BaseModel):
    feedback: str
    timestamp: datetime = Field(default_factory=datetime.now)
    resulted_in_version: Optional[int] = None

class WorkoutPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    status: str = "active"  # "active", "draft", "archived"
    version: int = 1
    feedback_history: List[FeedbackEntry] = []
    days: Dict[str, DayWorkout]

class WorkoutFeedback(BaseModel):
    feedback: str 