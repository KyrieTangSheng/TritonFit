import pytest
from unittest.mock import AsyncMock
from datetime import time, datetime
from bson import ObjectId
from app.models.schedule import WeeklyTimeSlot, DayOfWeek, Schedule
from app.services.schedule import ScheduleService

# Fixture for a mocked async database connection.
@pytest.fixture
def mock_db():
    return AsyncMock()

# Test for update_schedule
@pytest.mark.asyncio
async def test_update_schedule(mock_db, monkeypatch):
    """
    Test updating a schedule using a monkeypatched get_database.
    This test patches the module-level get_database in app.services.schedule,
    so that update_schedule and get_user_schedule use our mock DB.
    """
    service = ScheduleService()
    # Patch the module-level get_database function.
    from app.services import schedule as schedule_module
    monkeypatch.setattr(schedule_module, "get_database", AsyncMock(return_value=mock_db))
    
    valid_user_id = str(ObjectId())  # Generate a valid ObjectId.
    slots = [
        WeeklyTimeSlot(
            day_of_week=DayOfWeek.MONDAY, 
            start_time=time(9, 0), 
            end_time=time(10, 0)
        )
    ]
    
    # Mock update_one to simulate a successful update (matched_count=1).
    mock_update = AsyncMock()
    mock_update.matched_count = 1
    mock_db.schedules.update_one = AsyncMock(return_value=mock_update)
    
    # Mock find_one to return a valid schedule dictionary.
    mock_db.schedules.find_one = AsyncMock(return_value={
        "_id": ObjectId(),
        "user_id": ObjectId(valid_user_id),
        "weekly_slots": [{
            "day_of_week": DayOfWeek.MONDAY.value,  # Use .value since DayOfWeek is an Enum.
            "start_time": "09:00:00",
            "end_time": "10:00:00"
        }],
        "updated_at": datetime.utcnow()
    })
    
    updated_schedule = await service.update_schedule(valid_user_id, slots)
    
    # Validate that update_schedule returns a valid schedule.
    assert updated_schedule is not None, "Expected a valid Schedule, got None."
    assert str(updated_schedule.user_id) == valid_user_id
    assert len(updated_schedule.weekly_slots) == 1
    mock_db.schedules.update_one.assert_called_once()

# Test for get_schedule
@pytest.mark.asyncio
async def test_get_schedule(monkeypatch, mock_db):
    """
    Test getting a schedule by patching the module-level get_database.
    First, we simulate a case where a schedule exists. Then, we simulate a case
    where the schedule does not exist (i.e. find_one returns None).
    """
    service = ScheduleService()
    from app.services import schedule as schedule_module
    monkeypatch.setattr(schedule_module, "get_database", AsyncMock(return_value=mock_db))
    
    valid_user_id = str(ObjectId())
    
    # Simulate when a schedule exists.
    mock_db.schedules.find_one = AsyncMock(return_value={
        "_id": ObjectId(),
        "user_id": ObjectId(valid_user_id),
        "weekly_slots": [{
            "day_of_week": DayOfWeek.MONDAY.value,
            "start_time": "09:00:00",
            "end_time": "10:00:00"
        }],
        "updated_at": datetime.utcnow()
    })
    schedule_obj = await service.get_user_schedule(valid_user_id)
    assert schedule_obj is not None
    assert str(schedule_obj.user_id) == valid_user_id
    assert len(schedule_obj.weekly_slots) == 1
    
    # Simulate when a schedule does NOT exist.
    mock_db.schedules.find_one = AsyncMock(return_value=None)
    schedule_none = await service.get_user_schedule(valid_user_id)
    assert schedule_none is None
