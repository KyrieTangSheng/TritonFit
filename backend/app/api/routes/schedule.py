from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from typing import List
from pydantic import BaseModel
from ...services.schedule import ScheduleService
from ...models.schedule import Schedule, WeeklyTimeSlot
from ...core.auth import get_current_user
from ...models.user import UserInDB

# New request model
class UpdateScheduleRequest(BaseModel):
    weekly_slots: List[WeeklyTimeSlot]

router = APIRouter()
security = HTTPBearer()
schedule_service = ScheduleService()

@router.get("/schedule", response_model=Schedule)
async def get_schedule(current_user: UserInDB = Depends(get_current_user)):
    schedule = await schedule_service.get_user_schedule(str(current_user.id))
    if not schedule:
        schedule = await schedule_service.create_schedule(str(current_user.id))
    return schedule

@router.put("/schedule", response_model=Schedule)
async def update_schedule(
    request: UpdateScheduleRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    return await schedule_service.update_schedule(str(current_user.id), request.weekly_slots) 