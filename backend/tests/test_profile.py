import pytest
from unittest.mock import AsyncMock
from datetime import datetime, time
from bson import ObjectId

# Import the FastAPI app at the top level.
from fastapi.testclient import TestClient
from app.main import app  # Ensure your app includes the router with prefix="/users"

# Import the service and models.
from app.services.profile import ProfileService
from app.models.user import ProfileInDB, UserInDB

# -----------------------------
# Service-level Tests
# -----------------------------

@pytest.fixture
def mock_db():
    """Fixture for a mocked async database connection."""
    return AsyncMock()

@pytest.mark.asyncio
async def test_update_profile_service_success(monkeypatch, mock_db):
    """Test updating a profile successfully using the ProfileService."""
    service = ProfileService()
    # Monkeypatch the module-level get_database in app.services.profile.
    from app.services import profile as profile_module
    monkeypatch.setattr(profile_module, "get_database", AsyncMock(return_value=mock_db))
    
    valid_user_id = str(ObjectId())
    
    # Create a dummy update payload (simulating UpdateProfileRequest).
    class DummyUpdate:
        def __init__(self):
            self.dob = "01/01/1990"
            self.gender = "Male"
            self.fitness_level = 2
            self.height = 70
            self.weight = 150
            self.workout_location = "Home"
            self.workout_categories = ["Strength"]
            self.workout_types = ["Chest"]
        def dict(self):
            return {
                "dob": self.dob,
                "gender": self.gender,
                "fitness_level": self.fitness_level,
                "height": self.height,
                "weight": self.weight,
                "workout_location": self.workout_location,
                "workout_categories": self.workout_categories,
                "workout_types": self.workout_types,
            }
    update_data = DummyUpdate()
    
    # Simulate a successful update.
    mock_update = AsyncMock()
    mock_update.matched_count = 1
    mock_db.profiles.update_one = AsyncMock(return_value=mock_update)
    
    # Simulate find_one returning an updated profile dictionary.
    profile_dict = {
        "_id": ObjectId(),
        "user_id": ObjectId(valid_user_id),
        "dob": update_data.dob,
        "gender": update_data.gender,
        "fitness_level": update_data.fitness_level,
        "height": update_data.height,
        "weight": update_data.weight,
        "workout_location": update_data.workout_location,
        "workout_categories": update_data.workout_categories,
        "workout_types": update_data.workout_types,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    mock_db.profiles.find_one = AsyncMock(return_value=profile_dict)
    
    updated_profile = await service.update_profile(valid_user_id, update_data)
    assert updated_profile is not None
    assert str(updated_profile.user_id) == valid_user_id
    assert updated_profile.gender == "Male"

@pytest.mark.asyncio
async def test_get_profile_service_success(monkeypatch, mock_db):
    """Test retrieving a profile successfully using the ProfileService."""
    service = ProfileService()
    from app.services import profile as profile_module
    monkeypatch.setattr(profile_module, "get_database", AsyncMock(return_value=mock_db))
    
    valid_user_id = str(ObjectId())
    profile_dict = {
        "_id": ObjectId(),
        "user_id": ObjectId(valid_user_id),
        "dob": "01/01/1990",
        "gender": "Male",
        "fitness_level": 2,
        "height": 70,
        "weight": 150,
        "workout_location": "Home",
        "workout_categories": ["Strength"],
        "workout_types": ["Chest"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    mock_db.profiles.find_one = AsyncMock(return_value=profile_dict)
    
    profile_obj = await service.get_profile(valid_user_id)
    assert profile_obj is not None
    assert str(profile_obj.user_id) == valid_user_id

@pytest.mark.asyncio
async def test_get_profile_service_not_found(monkeypatch, mock_db):
    """Test get_profile when no profile is found."""
    service = ProfileService()
    from app.services import profile as profile_module
    monkeypatch.setattr(profile_module, "get_database", AsyncMock(return_value=mock_db))
    
    valid_user_id = str(ObjectId())
    mock_db.profiles.find_one = AsyncMock(return_value=None)
    
    with pytest.raises(ValueError, match="Profile not found"):
        await service.get_profile(valid_user_id)

@pytest.mark.asyncio
async def test_update_profile_service_no_update_data(monkeypatch, mock_db):
    """Test update_profile when no valid update data is provided."""
    service = ProfileService()
    from app.services import profile as profile_module
    monkeypatch.setattr(profile_module, "get_database", AsyncMock(return_value=mock_db))
    
    valid_user_id = str(ObjectId())
    # Create an update payload with all fields as None.
    class DummyEmptyUpdate:
        def dict(self):
            return {
                "dob": None,
                "gender": None,
                "fitness_level": None,
                "height": None,
                "weight": None,
                "workout_location": None,
                "workout_categories": None,
                "workout_types": None,
            }
    empty_update = DummyEmptyUpdate()
    
    with pytest.raises(ValueError, match="No valid update data provided"):
        await service.update_profile(valid_user_id, empty_update)

@pytest.mark.asyncio
async def test_update_profile_service_profile_not_found(monkeypatch, mock_db):
    """Test update_profile when no matching profile is found."""
    service = ProfileService()
    from app.services import profile as profile_module
    monkeypatch.setattr(profile_module, "get_database", AsyncMock(return_value=mock_db))
    
    valid_user_id = str(ObjectId())
    class DummyUpdate:
        def __init__(self):
            self.dob = "01/01/1990"
            self.gender = "Male"
            self.fitness_level = 2
            self.height = 70
            self.weight = 150
            self.workout_location = "Home"
            self.workout_categories = ["Strength"]
            self.workout_types = ["Chest"]
        def dict(self):
            return {
                "dob": self.dob,
                "gender": self.gender,
                "fitness_level": self.fitness_level,
                "height": self.height,
                "weight": self.weight,
                "workout_location": self.workout_location,
                "workout_categories": self.workout_categories,
                "workout_types": self.workout_types,
            }
    update_data = DummyUpdate()
    
    mock_update = AsyncMock()
    mock_update.matched_count = 0  # Simulate no profile found.
    mock_db.profiles.update_one = AsyncMock(return_value=mock_update)
    
    with pytest.raises(ValueError, match="Profile not found"):
        await service.update_profile(valid_user_id, update_data)

# -----------------------------
# Endpoint-level Tests
# -----------------------------

@pytest.fixture
def dummy_user():
    """Fixture for a dummy authenticated user."""
    return UserInDB(
        id=ObjectId(),
        username="testuser",
        email="test@example.com",
        hashed_password="hashed",
        created_at=datetime.utcnow()
    )

@pytest.fixture
def client(dummy_user, monkeypatch, mock_db):
    """TestClient fixture with dependency overrides."""
    from app.core.auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: dummy_user
    from app.services import profile as profile_module
    monkeypatch.setattr(profile_module, "get_database", AsyncMock(return_value=mock_db))
    return TestClient(app)

def test_get_profile_endpoint_success(client, dummy_user, mock_db):
    """Test the GET /users/profile endpoint for successful profile retrieval."""
    valid_user_id = str(dummy_user.id)
    profile_dict = {
        "_id": ObjectId(),
        "user_id": ObjectId(valid_user_id),
        "dob": "01/01/1990",
        "gender": "Male",
        "fitness_level": 2,
        "height": 70,
        "weight": 150,
        "workout_location": "Home",
        "workout_categories": ["Strength"],
        "workout_types": ["Chest"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    mock_db.profiles.find_one = AsyncMock(return_value=profile_dict)
    
    response = client.get("/users/profile")
    assert response.status_code == 200
    data = response.json()
    assert data["gender"] == "Male"
    assert data["dob"] == "01/01/1990"

def test_update_profile_endpoint_success(client, dummy_user, mock_db):
    """Test the PUT /users/profile endpoint for successful profile update."""
    valid_user_id = str(dummy_user.id)
    update_payload = {
        "dob": "02/02/1992",
        "gender": "Female",
        "fitness_level": 3,
        "height": 65,
        "weight": 120,
        "workout_location": "Main",
        "workout_categories": ["Cardio"],
        "workout_types": ["Arms"]
    }
    mock_update = AsyncMock()
    mock_update.matched_count = 1
    mock_db.profiles.update_one = AsyncMock(return_value=mock_update)
    
    profile_dict = {
        "_id": ObjectId(),
        "user_id": ObjectId(valid_user_id),
        "dob": update_payload["dob"],
        "gender": update_payload["gender"],
        "fitness_level": update_payload["fitness_level"],
        "height": update_payload["height"],
        "weight": update_payload["weight"],
        "workout_location": update_payload["workout_location"],
        "workout_categories": update_payload["workout_categories"],
        "workout_types": update_payload["workout_types"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    mock_db.profiles.find_one = AsyncMock(return_value=profile_dict)
    
    response = client.put("/users/profile", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["gender"] == "Female"
    assert data["dob"] == "02/02/1992"
