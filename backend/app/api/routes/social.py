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
        user_profile = await profile_service.get_profile(str(current_user.id))
        other_users_profile = await profile_service.get_all_profiles()
        # Create preferences dictionary based on user profile
        user_preferences = {
            "username": await profile_service.get_username_by_id(user_profile.user_id),
            "Sports": user_profile.workout_categories if hasattr(user_profile, "workout_categories") else [],
            "FitnessLevel": user_profile.fitness_level if hasattr(user_profile, "fitness_level") else 1,
            "WorkoutTypes": user_profile.workout_types if hasattr(user_profile, "workout_types") else []
        }
        
        other_users_preferences = [
            {
                "username": await profile_service.get_username_by_id(other_user_profile.user_id),
                "Sports": other_user_profile.workout_categories if hasattr(other_user_profile, "workout_categories") else [],
                "FitnessLevel": other_user_profile.fitness_level if hasattr(other_user_profile, "fitness_level") else 1,
                "WorkoutTypes": other_user_profile.workout_types if hasattr(other_user_profile, "workout_types") else []
            }
            for other_user_profile in other_users_profile if other_user_profile.user_id != user_profile.user_id
        ]
        
        # Get recommendations from the recommender system
        recommendations = await social_service.get_recommendations(user_preferences, other_users_preferences)
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