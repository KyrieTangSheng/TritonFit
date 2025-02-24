from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from enum import Enum
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, (str, ObjectId)):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v) if isinstance(v, str) else v

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female" 
    NON_BINARY = "Non-Binary"
    NO_ANSWER = "Don't want to answer"

class FitnessLevel(int, Enum):
    BEGINNER = 1
    INTERMEDIATE = 2
    EXPERT = 3

class WorkoutLocation(str, Enum):
    HOME = "Home"
    MAIN = "Main"
    RIMAC = "Rimac"

class WorkoutCategory(str, Enum):
    STRENGTH = "Strength"
    CARDIO = "Cardio"
    STRETCHING = "Stretching"

class WorkoutType(str, Enum):
    CORE = "Core"
    CHEST = "Chest"
    BACK = "Back"
    ARMS = "Arms"
    LEGS = "Legs"

class ScheduleSlot(BaseModel):
    start_datetime: datetime
    end_datetime: datetime

    @validator('end_datetime')
    def validate_time_interval(cls, v, values):
        if 'start_datetime' in values:
            diff = v - values['start_datetime']
            minutes = diff.total_seconds() / 60
            if minutes % 15 != 0:
                raise ValueError("Time intervals must be in multiples of 15 minutes")
            if minutes <= 0:
                raise ValueError("End time must be after start time")
        return v

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class ProfileBase(BaseModel):
    dob: str  # Format: MM/DD/YYYY
    gender: str = Field(enum=["Male", "Female", "Non-Binary", "Don't want to answer"])
    fitness_level: int = Field(ge=1, le=3)  # 1=Beginner, 2=Intermediate, 3=Expert
    height: Optional[int] = Field(None, description="Height in inches")
    weight: Optional[int] = Field(None, description="Weight in lbs")
    workout_location: str = Field(enum=["Home", "Main", "Rimac"])
    workout_categories: List[str] = Field(enum=["Strength", "Cardio", "Stretching"])
    workout_types: List[str] = Field(enum=["Core", "Chest", "Back", "Arms", "Legs"])

class ProfileCreate(ProfileBase):
    pass


class UserCreate(UserBase):
    password: str
    profile: ProfileCreate

class ProfileInDB(ProfileBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str} 