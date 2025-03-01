# backend/tests/test_workout_service.py
import pytest
import json
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime
from bson import ObjectId
from app.services.workout_service import (
    generate_workout_plan, 
    update_workout_plan,
    get_today_workout,
    DAYS_OF_WEEK,
    manually_update_workout_plan,
    update_workout_day,
    update_workout_item
)
from app.models.workout_model import WorkoutPlan, FeedbackEntry, DayWorkout, WorkoutItem

@pytest.fixture
def mock_user_data():
    return {
        "_id": str(ObjectId()),
        "email": "test@example.com",
        "username": "testuser"
    }

@pytest.fixture
def mock_profile():
    return {
        "user_id": str(ObjectId()),
        "fitness_goals": ["Weight Loss", "Muscle Gain"],
        "fitness_level": "intermediate",
        "age": 30,
        "weight": 180,
        "height": 72,
        "health_conditions": []
    }

@pytest.fixture
def mock_schedule():
    return {
        "user_id": str(ObjectId()),
        "availability": {
            "Monday": {"start": "15:00", "end": "16:00"},
            "Wednesday": {"start": "17:00", "end": "18:00"},
            "Friday": {"start": "08:00", "end": "09:00"}
        }
    }

@pytest.fixture
def mock_workout_plan_json():
    # Create a sample workout plan JSON with all 7 days
    days = {}
    for day in DAYS_OF_WEEK:
        if day in ["Monday", "Wednesday", "Friday"]:
            days[day] = {
                "workout_items": [
                    {
                        "type": "cardio",
                        "duration": "10 min",
                        "exercises": [
                            {
                                "name": "jumping jacks",
                                "sets": 3,
                                "reps_per_set": 10,
                                "rest_between_sets": "30 sec",
                                "equipment": ["none"],
                                "difficulty": "beginner",
                                "notes": "Keep a steady pace"
                            }
                        ]
                    }
                ],
                "location": "Main Gym",
                "time": "3:00-3:15PM"
            }
        else:
            days[day] = {
                "workout_items": [],
                "location": "Rest day",
                "time": "N/A"
            }
    
    return {"days": days}

@pytest.fixture
def setup_llm_service(mock_workout_plan_json):
    # Create a mock client that returns our workout plan JSON
    mock_client = MagicMock()
    mock_client.chat = MagicMock()
    mock_client.chat.completions = MagicMock()
    
    # Create a mock response
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = json.dumps(mock_workout_plan_json)
    
    # Set the create method to return our response
    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
    
    # Set the mock client
    from app.services.llm_service import llm_service
    llm_service.set_mock_client(mock_client)
    
    yield llm_service
    
    # Clean up after test
    llm_service.client = None

@pytest.mark.asyncio
async def test_generate_workout_plan(mock_user_data, mock_profile, mock_schedule, mock_workout_plan_json, setup_llm_service):
    # Mock database operations
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.profiles.find_one = AsyncMock(return_value=mock_profile)
        mock_db.schedules.find_one = AsyncMock(return_value=mock_schedule)
        mock_db.workout_plans.insert_one = AsyncMock()
        mock_get_db.return_value = mock_db
        
        # Call the function
        result = await generate_workout_plan(user_id=mock_user_data["_id"])
        
        # Verify the result
        assert isinstance(result, WorkoutPlan)
        assert len(result.days) == 7
        for day in DAYS_OF_WEEK:
            assert day in result.days
        
        # Verify database calls
        mock_db.profiles.find_one.assert_called_once()
        mock_db.schedules.find_one.assert_called_once()
        mock_db.workout_plans.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_generate_workout_plan_no_profile():
    # Test error when user profile doesn't exist
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.profiles.find_one = AsyncMock(return_value=None)
        mock_db.schedules.find_one = AsyncMock(return_value={})
        mock_get_db.return_value = mock_db
        
        with pytest.raises(ValueError, match="User profile or schedule not found"):
            await generate_workout_plan(user_id=str(ObjectId()))

@pytest.mark.asyncio
async def test_update_workout_plan(mock_user_data, mock_workout_plan_json, setup_llm_service):
    # Create an existing workout plan
    plan_id = str(ObjectId())
    
    # First, create a proper WorkoutPlan object to mock what comes from the database
    workout_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,
        feedback_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="active",
        days={day: DayWorkout(workout_items=[], location="Rest day", time="N/A") for day in DAYS_OF_WEEK}
    )
    
    # Then convert it to dict for the database mock
    # This is important: we need to patch the json.dumps call in update_workout_plan
    with patch('app.services.workout_service.get_database') as mock_get_db, \
         patch('app.services.workout_service.json.dumps') as mock_json_dumps:
        # Make the json.dumps mock return a valid string regardless of the input
        mock_json_dumps.return_value = '{"mocked": "json"}'
        
        mock_db = AsyncMock()
        # Return the dictified WorkoutPlan
        mock_db.workout_plans.find_one = AsyncMock(return_value=workout_plan.dict())
        mock_db.workout_plans.replace_one = AsyncMock()
        mock_get_db.return_value = mock_db
        
        # Call the function
        feedback = "I want more cardio exercises"
        result = await update_workout_plan(
            plan_id=plan_id,
            user_id=mock_user_data["_id"],
            feedback=feedback
        )
        
        # Verify the result
        assert result.version == 2
        assert len(result.feedback_history) == 1
        assert result.feedback_history[0].feedback == feedback
        
        # Verify database calls
        mock_db.workout_plans.find_one.assert_called_once()
        mock_db.workout_plans.replace_one.assert_called_once()
        
        # Verify json.dumps was called (with our patched version)
        mock_json_dumps.assert_called()

@pytest.mark.asyncio
async def test_get_today_workout(mock_user_data, mock_workout_plan_json):
    # Create a workout plan in the database
    plan_id = str(ObjectId())
    
    # Convert mock_workout_plan_json to a proper WorkoutPlan
    days_dict = {}
    for day in DAYS_OF_WEEK:
        day_data = mock_workout_plan_json["days"].get(day, {"workout_items": [], "location": "Rest day", "time": "N/A"})
        days_dict[day] = day_data
    
    existing_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,
        feedback_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="active",
        days=days_dict
    )
    
    # Mock database operations
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.workout_plans.find_one = AsyncMock(return_value=existing_plan.dict())
        mock_get_db.return_value = mock_db
        
        # Mock datetime to return a specific day
        today = "Monday"
        with patch('app.services.workout_service.datetime') as mock_dt:
            mock_now = MagicMock()
            mock_now.strftime.return_value = today
            mock_dt.now.return_value = mock_now
            
            # Call the function
            result = await get_today_workout(user_id=mock_user_data["_id"])
            
            # Verify the result
            assert result is not None
            assert result["plan_id"] == plan_id
            assert result["day"] == today
            assert "workout" in result
            
            # This should be a DayWorkout object, not a dict
            assert hasattr(result["workout"], "workout_items")
            # Check that we have workout items for Monday
            assert len(result["workout"].workout_items) > 0

@pytest.mark.asyncio
async def test_manually_update_workout_plan(mock_user_data):
    """Test manually updating a complete workout plan"""
    plan_id = str(ObjectId())
    
    # Create an existing workout plan
    existing_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,
        feedback_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="active",
        days={day: DayWorkout(workout_items=[], location="Rest day", time="N/A") for day in DAYS_OF_WEEK}
    )
    
    # Create an updated plan
    updated_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,  # This should be incremented by the service
        feedback_history=[],
        created_at=existing_plan.created_at,
        updated_at=existing_plan.updated_at,  # This should be updated by the service
        status="active",
        days={
            "Monday": DayWorkout(
                workout_items=[
                    WorkoutItem(
                        type="cardio",
                        duration="20 min",
                        exercises=[
                            {
                                "name": "running",
                                "sets": 1,
                                "reps_per_set": 1,
                                "rest_between_sets": "0 sec",
                                "equipment": ["none"],
                                "difficulty": "intermediate",
                                "notes": "Steady pace"
                            }
                        ]
                    )
                ],
                location="Home",
                time="7:00-7:20AM"
            ),
            **{day: DayWorkout(workout_items=[], location="Rest day", time="N/A") 
               for day in DAYS_OF_WEEK if day != "Monday"}
        }
    )
    
    # Mock database operations
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.workout_plans.find_one = AsyncMock(return_value=existing_plan.dict())
        mock_db.workout_plans.replace_one = AsyncMock()
        mock_get_db.return_value = mock_db
        
        # Call the function
        result = await manually_update_workout_plan(
            plan_id=plan_id,
            user_id=mock_user_data["_id"],
            updated_plan=updated_plan
        )
        
        # Verify the result
        assert result.version == 2  # Version should be incremented
        assert isinstance(result.updated_at, datetime)  # Should be updated
        assert len(result.days["Monday"].workout_items) == 1
        assert result.days["Monday"].workout_items[0].type == "cardio"
        assert result.days["Monday"].location == "Home"
        
        # Verify database calls
        mock_db.workout_plans.find_one.assert_called_once()
        mock_db.workout_plans.replace_one.assert_called_once()

@pytest.mark.asyncio
async def test_update_workout_day(mock_user_data):
    """Test updating a specific day in a workout plan"""
    plan_id = str(ObjectId())
    
    # Create an existing workout plan
    existing_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,
        feedback_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="active",
        days={day: DayWorkout(workout_items=[], location="Rest day", time="N/A") for day in DAYS_OF_WEEK}
    )
    
    # Create an updated day workout
    updated_day = DayWorkout(
        workout_items=[
            WorkoutItem(
                type="strength",
                duration="30 min",
                exercises=[
                    {
                        "name": "push-ups",
                        "sets": 3,
                        "reps_per_set": 15,
                        "rest_between_sets": "60 sec",
                        "equipment": ["none"],
                        "difficulty": "intermediate",
                        "notes": "Keep proper form"
                    }
                ]
            )
        ],
        location="Gym",
        time="5:00-5:30PM"
    )
    
    # Mock database operations
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.workout_plans.find_one = AsyncMock(return_value=existing_plan.dict())
        mock_db.workout_plans.replace_one = AsyncMock()
        mock_get_db.return_value = mock_db
        
        # Call the function
        result = await update_workout_day(
            plan_id=plan_id,
            user_id=mock_user_data["_id"],
            day="Wednesday",
            day_workout=updated_day
        )
        
        # Verify the result
        assert result.version == 2  # Version should be incremented
        assert isinstance(result.updated_at, datetime)  # Should be updated
        assert len(result.days["Wednesday"].workout_items) == 1
        assert result.days["Wednesday"].workout_items[0].type == "strength"
        assert result.days["Wednesday"].location == "Gym"
        assert result.days["Wednesday"].time == "5:00-5:30PM"
        
        # Verify database calls
        mock_db.workout_plans.find_one.assert_called_once()
        mock_db.workout_plans.replace_one.assert_called_once()

@pytest.mark.asyncio
async def test_update_workout_item(mock_user_data):
    """Test updating a specific workout item within a day"""
    plan_id = str(ObjectId())
    
    # Create a day workout with an existing workout item
    existing_day = DayWorkout(
        workout_items=[
            WorkoutItem(
                type="cardio",
                duration="10 min",
                exercises=[
                    {
                        "name": "jumping jacks",
                        "sets": 3,
                        "reps_per_set": 10,
                        "rest_between_sets": "30 sec",
                        "equipment": ["none"],
                        "difficulty": "beginner",
                        "notes": "Keep a steady pace"
                    }
                ]
            )
        ],
        location="Home",
        time="6:00-6:15AM"
    )
    
    # Create an existing workout plan
    existing_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,
        feedback_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="active",
        days={
            "Friday": existing_day,
            **{day: DayWorkout(workout_items=[], location="Rest day", time="N/A") 
               for day in DAYS_OF_WEEK if day != "Friday"}
        }
    )
    
    # Create an updated workout item
    updated_item = WorkoutItem(
        type="strength",
        duration="15 min",
        exercises=[
            {
                "name": "squats",
                "sets": 4,
                "reps_per_set": 12,
                "rest_between_sets": "45 sec",
                "equipment": ["none"],
                "difficulty": "intermediate",
                "notes": "Keep knees over ankles"
            }
        ]
    )
    
    # Mock database operations
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.workout_plans.find_one = AsyncMock(return_value=existing_plan.dict())
        mock_db.workout_plans.replace_one = AsyncMock()
        mock_get_db.return_value = mock_db
        
        # Call the function
        result = await update_workout_item(
            plan_id=plan_id,
            user_id=mock_user_data["_id"],
            day="Friday",
            item_index=0,
            workout_item=updated_item
        )
        
        # Verify the result
        assert result.version == 2  # Version should be incremented
        assert isinstance(result.updated_at, datetime)  # Should be updated
        assert len(result.days["Friday"].workout_items) == 1
        assert result.days["Friday"].workout_items[0].type == "strength"
        
        # Verify database calls
        mock_db.workout_plans.find_one.assert_called_once()
        mock_db.workout_plans.replace_one.assert_called_once()

@pytest.mark.asyncio
async def test_update_workout_day_invalid_day(mock_user_data):
    """Test updating a day with an invalid day name"""
    plan_id = str(ObjectId())
    
    # Create an existing workout plan
    existing_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,
        feedback_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="active",
        days={day: DayWorkout(workout_items=[], location="Rest day", time="N/A") for day in DAYS_OF_WEEK}
    )
    
    # Create an updated day workout
    updated_day = DayWorkout(
        workout_items=[],
        location="Gym",
        time="5:00-5:30PM"
    )
    
    # Mock database operations
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.workout_plans.find_one = AsyncMock(return_value=existing_plan.dict())
        mock_get_db.return_value = mock_db
        
        # Call the function with an invalid day name
        with pytest.raises(ValueError, match="Invalid day: InvalidDay"):
            await update_workout_day(
                plan_id=plan_id,
                user_id=mock_user_data["_id"],
                day="InvalidDay",
                day_workout=updated_day
            )

@pytest.mark.asyncio
async def test_update_workout_item_invalid_index(mock_user_data):
    """Test updating a workout item with an invalid index"""
    plan_id = str(ObjectId())
    
    # Create a day workout with an existing workout item
    existing_day = DayWorkout(
        workout_items=[
            WorkoutItem(
                type="cardio",
                duration="10 min",
                exercises=[]
            )
        ],
        location="Home",
        time="6:00-6:15AM"
    )
    
    # Create an existing workout plan
    existing_plan = WorkoutPlan(
        id=plan_id,
        user_id=mock_user_data["_id"],
        version=1,
        feedback_history=[],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        status="active",
        days={
            "Monday": existing_day,
            **{day: DayWorkout(workout_items=[], location="Rest day", time="N/A") 
               for day in DAYS_OF_WEEK if day != "Monday"}
        }
    )
    
    # Create an updated workout item
    updated_item = WorkoutItem(
        type="strength",
        duration="15 min",
        exercises=[]
    )
    
    # Mock database operations
    with patch('app.services.workout_service.get_database') as mock_get_db:
        mock_db = AsyncMock()
        mock_db.workout_plans.find_one = AsyncMock(return_value=existing_plan.dict())
        mock_get_db.return_value = mock_db
        
        # Call the function with an invalid index
        with pytest.raises(ValueError, match="Invalid item index: 1"):
            await update_workout_item(
                plan_id=plan_id,
                user_id=mock_user_data["_id"],
                day="Monday",
                item_index=1,  # There's only one item (index 0)
                workout_item=updated_item
            )