from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from datetime import timedelta
from ...services.auth import AuthService
from ...models.user import UserCreate, UserInDB
from ...core.config import settings
from jose import JWTError, jwt
from ...db.mongodb import get_database
from pydantic import BaseModel

router = APIRouter()
security = HTTPBearer()
auth_service = AuthService()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(user_create: UserCreate):
    try:
        user = await auth_service.create_user(user_create)
        return {"message": "User created successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login")
async def login(login_data: LoginRequest):
    user = await auth_service.authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def read_users_me(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    db = await get_database()
    user = await db.users.find_one({"username": username})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return UserInDB(**user) 