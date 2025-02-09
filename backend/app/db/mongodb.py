from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

    @classmethod
    async def connect_to_mongo(cls):
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
            cls.database = cls.client[settings.DATABASE_NAME]
            # Quick connection test
            await cls.client.server_info() 
            logger.info("Connected to MongoDB")
        except Exception as e:
            logger.error(f"Could not connect to MongoDB: {e}")
            raise

    @classmethod
    async def close_mongo_connection(cls):
        if cls.client:
            cls.client.close()
            logger.info("Closed MongoDB connection")

    @classmethod
    async def get_database(cls) -> AsyncIOMotorDatabase:
        if cls.database is None:
            await cls.connect_to_mongo()
        return cls.database

# Convenience functions
async def get_database() -> AsyncIOMotorDatabase:
    return await MongoDB.get_database()

async def connect_to_mongo():
    await MongoDB.connect_to_mongo()

async def close_mongo_connection():
    await MongoDB.close_mongo_connection()
