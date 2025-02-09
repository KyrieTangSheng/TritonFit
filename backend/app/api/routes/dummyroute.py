from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from ...core.config import settings

router = APIRouter()
security = HTTPBearer()

@router.get("/protected-route")
async def protected_route(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return {"message": "Access granted", "username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")