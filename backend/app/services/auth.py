from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..core.config import settings
from ..models.user import UserInDB, UserCreate, ProfileInDB
from ..db.mongodb import get_database

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self):
        self.pwd_context = pwd_context

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    async def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        db = await get_database()
        user_doc = await db.users.find_one({"username": username})
        if not user_doc:
            return None
        user = UserInDB(**user_doc)
        if not self.verify_password(password, user.hashed_password):
            return None
        return user

    async def create_user(self, user_create: UserCreate) -> UserInDB:
        db = await get_database()
        
        # Check if username already exists
        if await db.users.find_one({"username": user_create.username}):
            raise ValueError("Username already registered")
        
        # Create user with hashed password
        user_dict = user_create.dict(exclude={'profile', 'password'})
        hashed_password = self.get_password_hash(user_create.password)
        user_db = UserInDB(
            **user_dict,
            hashed_password=hashed_password,
        )
        
        # Insert user
        result = await db.users.insert_one(user_db.dict(by_alias=True))
        user_db.id = result.inserted_id
        
        # Create profile
        profile_data = user_create.profile.dict()
        profile = ProfileInDB(
            user_id=result.inserted_id,
            **profile_data
        )
        await db.profiles.insert_one(profile.dict(by_alias=True))
        
        return user_db 