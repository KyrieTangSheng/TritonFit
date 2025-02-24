from datetime import datetime, time
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from enum import IntEnum
from bson import ObjectId
from .user import PyObjectId

class DayOfWeek(IntEnum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6

class WeeklyTimeSlot(BaseModel):
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    
    @validator('end_time')
    def validate_time_interval(cls, v, values):
        if 'start_time' in values:
            if v <= values['start_time']:
                raise ValueError("End time must be after start time")
        return v
    
    class Config:
        json_encoders = {
            time: lambda t: t.strftime("%H:%M:%S")
        }

class Schedule(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    weekly_slots: List[WeeklyTimeSlot] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.strftime("%Y-%m-%dT%H:%M:%S")
        } 