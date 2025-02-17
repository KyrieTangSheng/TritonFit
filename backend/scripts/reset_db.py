from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

async def reset_database():
    # Connect to MongoDB
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    
    # Drop all collections
    collections = await db.list_collection_names()
    for collection in collections:
        await db[collection].drop()
    
    print("Database reset successfully!")

if __name__ == "__main__":
    asyncio.run(reset_database()) 