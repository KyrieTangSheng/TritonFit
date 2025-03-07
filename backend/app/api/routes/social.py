from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from ...core.auth import get_current_user
from ...models.user import UserInDB
from ...services.social_service import SocialService
from ...services.profile import ProfileService
from ...models.profile import PublicProfile

router = APIRouter()
social_service = SocialService()
profile_service = ProfileService()

@router.get("/recommendations", response_model=Dict[str, Any])
async def get_recommendations(current_user: UserInDB = Depends(get_current_user)):
    """
    Get personalized recommendations for the current user
    """
    try:
        # Get user profile to extract preferences
        profile = await profile_service.get_profile(str(current_user.id))
        
        # Create preferences dictionary based on user profile
        preferences = {
            "Sports": profile.workout_categories if hasattr(profile, "workout_categories") else [],
            "FitnessLevel": profile.fitness_level if hasattr(profile, "fitness_level") else 1,
            "WorkoutTypes": profile.workout_types if hasattr(profile, "workout_types") else []
        }
        
        # Get recommendations from the recommender system
        recommendations = await social_service.get_recommendations(preferences)
        response = {
            "recommendations": recommendations
        }
        return response
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/users/{username}", response_model=PublicProfile)
async def get_user_profile(username: str, current_user: UserInDB = Depends(get_current_user)):
    """
    Get a user's public profile by username
    """
    try:
        # Get the public profile by username using the profile service
        public_profile = await profile_service.get_public_profile_by_username(username)
        return public_profile
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        ) 