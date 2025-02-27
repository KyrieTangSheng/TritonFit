from datetime import datetime
from typing import Optional
from bson import ObjectId
from ..db.mongodb import get_database
from ..models.user import ProfileInDB

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