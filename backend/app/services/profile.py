from datetime import datetime
from typing import Optional
from bson import ObjectId
from ..db.mongodb import get_database
from ..models.user import ProfileInDB, ProfileBase
from ..models.profile import PublicProfile
from typing import List
class ProfileService:
    async def update_profile(self, user_id: str, update_data: dict) -> ProfileInDB:
        db = await get_database()
        
        # Remove None values from update data
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if not update_dict:
            raise ValueError("No valid update data provided")
            
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await db.profiles.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise ValueError("Profile not found")
            
        updated_profile = await db.profiles.find_one({"user_id": ObjectId(user_id)})
        return ProfileInDB(**updated_profile)

    async def get_profile(self, user_id: str) -> ProfileInDB:
        db = await get_database()
        profile = await db.profiles.find_one({"user_id": ObjectId(user_id)})
        if not profile:
            raise ValueError("Profile not found")
            
        return ProfileInDB(**profile)

    async def get_profile_by_username(self, username: str) -> ProfileBase:
        """
        Get a user profile by username
        
        Args:
            username: The username of the user
            
        Returns:
            The user's profile
            
        Raises:
            ValueError: If the profile is not found
        """
        db = await get_database()
        
        # First, find the user by username
        user = await db.users.find_one({"username": username})
        if not user:
            raise ValueError(f"User with username {username} not found")
        
        # Then get the profile using the user's ID
        profile = await db.profiles.find_one({"user_id": str(user["_id"])})
        if not profile:
            raise ValueError(f"Profile for user {username} not found")
        
        return ProfileBase(**profile)

    async def get_public_profile_by_username(self, username: str) -> PublicProfile:
        """
        Get a user's public profile by username
        
        Args:
            username: The username of the user
            
        Returns:
            The user's public profile
            
        Raises:
            ValueError: If the user or profile is not found
        """
        db = await get_database()
        
        # Find the user by username
        user = await db.users.find_one({"username": username})
        if not user:
            raise ValueError(f"User with username {username} not found")
        
        # Get the profile using the user's ID
        profile = await db.profiles.find_one({"user_id": ObjectId(user["_id"])})
        if not profile:
            raise ValueError(f"Profile for user {username} not found")
        
        # Create and return a public profile with only shareable information
        public_profile = PublicProfile(
            username=user["username"],
            email=user.get("email"),
            fitness_level=profile.get("fitness_level", 1),
            workout_categories=profile.get("workout_categories", []),
            workout_types=profile.get("workout_types", []),
            workout_location=profile.get("workout_location")
        )
        
        return public_profile 
    
    async def get_all_profiles(self) -> List[ProfileBase]:
        db = await get_database()
        profiles = await db.profiles.find({}).to_list(length=None)
        return [ProfileInDB(**profile) for profile in profiles]
    
    async def get_username_by_id(self, user_id: str) -> str:
        db = await get_database()
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        return user["username"]