import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from datetime import datetime
from unittest.mock import AsyncMock, patch
from bson import ObjectId

from app.api.routes.auth import router
from app.models.user import UserCreate, UserInDB
from app.services.auth import AuthService
app = FastAPI()
app.include_router(router, prefix="/auth")
client = TestClient(app)

@pytest.fixture
def valid_profile_data():
    return {
        "dob": "01/01/2000",
        "gender": "Male",
        "fitness_level": 1,
        "height": 70,
        "weight": 150,
        "workout_location": "Rimac",
        "workout_categories": ["Strength"],
        "workout_types": ["Core"],
        "schedule": [
            {
                "start_datetime": "2024-01-01T09:00:00",
                "end_datetime": "2024-01-01T09:45:00"
            }
        ]
    }

@pytest.fixture
def valid_user_data(valid_profile_data):
    return {
        "username": "testuser",
        "email": "test@ucsd.edu",
        "password": "TestPass123!",
        "profile": valid_profile_data
    }

@pytest.fixture
def mock_user_in_db():
    return {
        "_id": ObjectId(),
        "username": "testuser",
        "email": "test@ucsd.edu",
        "hashed_password": AuthService().get_password_hash("TestPass123!"),
        "created_at": datetime.utcnow()
    }

@pytest.mark.asyncio
async def test_register_success(valid_user_data):
    with patch('app.services.auth.AuthService.create_user', new_callable=AsyncMock) as mock_create:
        # Create UserInDB data with hashed password for the mock return
        user_in_db_data = {
            "username": valid_user_data["username"],
            "email": valid_user_data["email"],
            "hashed_password": AuthService().get_password_hash(valid_user_data["password"])
        }
        
        mock_create.return_value = UserInDB(**user_in_db_data)
        response = client.post("/auth/register", json=valid_user_data)
        assert response.status_code == 200
        assert response.json() == {"message": "User created successfully"}

@pytest.mark.asyncio
async def test_register_duplicate_username(valid_user_data):
    with patch('app.services.auth.AuthService.create_user', new_callable=AsyncMock) as mock_create:
        mock_create.side_effect = ValueError("Username already registered")
        response = client.post("/auth/register", json=valid_user_data)
        assert response.status_code == 400
        assert "Username already registered" in response.json()["detail"]

@pytest.mark.asyncio
async def test_login_success(mock_user_in_db):
    login_data = {"username": "testuser", "password": "TestPass123!"}
    
    with patch('app.services.auth.AuthService.authenticate_user', new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = UserInDB(**mock_user_in_db)
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_credentials():
    login_data = {"username": "testuser", "password": "WrongPass123!"}
    
    with patch('app.services.auth.AuthService.authenticate_user', new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = None
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_get_current_user(valid_user_data):
    # First register a user
    with patch('app.services.auth.AuthService.create_user', new_callable=AsyncMock) as mock_create:
        mock_create.return_value = UserInDB(
            username=valid_user_data["username"],
            email=valid_user_data["email"],
            hashed_password=AuthService().get_password_hash(valid_user_data["password"])
        )
        response = client.post("/auth/register", json=valid_user_data)
        assert response.status_code == 200

    # Login to get token
    with patch('app.services.auth.AuthService.authenticate_user', new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = UserInDB(
            username=valid_user_data["username"],
            email=valid_user_data["email"],
            hashed_password=AuthService().get_password_hash(valid_user_data["password"])
        )
        login_data = {
            "username": valid_user_data["username"],
            "password": valid_user_data["password"]
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == 200
        token = response.json()["access_token"]

    # Test /me endpoint
    with patch('app.db.mongodb.get_database', new_callable=AsyncMock) as mock_db:
        mock_db.return_value.users.find_one.return_value = {
            "username": valid_user_data["username"],
            "email": valid_user_data["email"],
            "hashed_password": AuthService().get_password_hash(valid_user_data["password"])
        }
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["username"] == valid_user_data["username"]

@pytest.mark.asyncio
async def test_get_current_user_invalid_token():
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
    assert "Invalid authentication credentials" in response.json()["detail"]

@pytest.mark.asyncio
async def test_register_invalid_fitness_level(valid_user_data):
    valid_user_data["profile"]["fitness_level"] = 0  # Invalid value
    response = client.post("/auth/register", json=valid_user_data)
    assert response.status_code == 422  # Validation error

@pytest.mark.asyncio
async def test_register_invalid_email(valid_user_data):
    valid_user_data["email"] = "invalid_email"  # Invalid email format
    response = client.post("/auth/register", json=valid_user_data)
    assert response.status_code == 422  # Validation error 