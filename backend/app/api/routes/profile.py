from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional, List
from pydantic import BaseModel, Field
from ...services.profile import ProfileService
from ...models.user import ProfileBase, UserInDB
from ...core.auth import get_current_user

router = APIRouter()
profile_service = ProfileService()

class UpdateProfileRequest(BaseModel):
    dob: Optional[str] = None
    gender: Optional[str] = Field(None, enum=["Male", "Female", "Non-Binary", "Don't want to answer"])
    fitness_level: Optional[int] = Field(None, ge=1, le=3)
    height: Optional[int] = None
    weight: Optional[int] = None
    workout_location: Optional[str] = Field(None, enum=["Home", "Main", "Rimac"])
    workout_categories: Optional[List[str]] = Field(None, enum=["Strength", "Cardio", "Stretching"])
    workout_types: Optional[List[str]] = Field(None, enum=["Core", "Chest", "Back", "Arms", "Legs"])

@router.put("/profile", response_model=ProfileBase)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    return await profile_service.update_profile(str(current_user.id), request)

@router.get("/profile", response_model=ProfileBase)
async def get_profile(current_user: UserInDB = Depends(get_current_user)):
    return await profile_service.get_profile(str(current_user.id))
