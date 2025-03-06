from datetime import datetime, time, timedelta
from typing import List, Optional
import asyncio
from ..models.schedule import Schedule, WeeklyTimeSlot, DayOfWeek
from ..db.mongodb import get_database
from bson import ObjectId
from ..services.workout_service import get_today_workout, update_workout_plan

class ScheduleService:
    async def create_schedule(self, user_id: str) -> Schedule:
        db = await get_database()
        schedule = Schedule(
            user_id=ObjectId(user_id),
            weekly_slots=[]
        )
        result = await db.schedules.insert_one(schedule.dict(by_alias=True))
        schedule.id = result.inserted_id
        return schedule

    async def get_user_schedule(self, user_id: str) -> Optional[Schedule]:
        db = await get_database()
        schedule_doc = await db.schedules.find_one({"user_id": ObjectId(user_id)})
        if schedule_doc:
            # Convert time strings back to time objects
            if "weekly_slots" in schedule_doc:
                for slot in schedule_doc["weekly_slots"]:
                    if isinstance(slot["start_time"], str):
                        h, m, s = map(int, slot["start_time"].split(":"))
                        slot["start_time"] = time(h, m, s)
                    if isinstance(slot["end_time"], str):
                        h, m, s = map(int, slot["end_time"].split(":"))
                        slot["end_time"] = time(h, m, s)
            return Schedule(**schedule_doc)
        return None

    async def update_schedule(self, user_id: str, slots: List[WeeklyTimeSlot]) -> Schedule:
        db = await get_database()
        # Convert time objects to strings for MongoDB storage
        slots_dict = []
        for slot in slots:
            slot_dict = slot.dict()
            slot_dict["start_time"] = slot.start_time.strftime("%H:%M:%S")
            slot_dict["end_time"] = slot.end_time.strftime("%H:%M:%S")
            slots_dict.append(slot_dict)
            
        schedule_update = {
            "weekly_slots": slots_dict,
            "updated_at": datetime.utcnow()
        }
        await db.schedules.update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": schedule_update}
        )
        
        # Get the updated schedule
        updated_schedule = await self.get_user_schedule(user_id)
        
        # Start workout plan update in background without waiting
        asyncio.create_task(self._update_workout_plan_background(user_id))
        
        return updated_schedule
    
    async def _update_workout_plan_background(self, user_id: str):
        """Background task to update workout plan after schedule changes"""
        try:
            # Get the current workout plan
            today_workout = await get_today_workout(user_id)
            
            if today_workout and today_workout.get("plan_id"):
                # Generate feedback about schedule change
                feedback = "My availability has changed. Please adjust my workout plan to fit my new schedule."
                
                # Update the workout plan with the new schedule information
                await update_workout_plan(
                    plan_id=today_workout["plan_id"],
                    user_id=user_id,
                    feedback=feedback
                )
        except Exception as e:
            # Log the error but don't fail the schedule update
            print(f"Error updating workout plan after schedule change: {str(e)}")

    def generate_schedule_instances(self, weekly_slots: List[WeeklyTimeSlot], 
                                  start_date: datetime, 
                                  weeks_ahead: int = 4) -> List[datetime]:
        instances = []
        end_date = start_date + timedelta(weeks=weeks_ahead)
        
        for slot in weekly_slots:
            current_date = start_date
            # Find first occurrence of this day of week
            while current_date.weekday() != slot.day_of_week:
                current_date += timedelta(days=1)
            
            # Generate all instances within range
            while current_date < end_date:
                slot_start = datetime.combine(current_date, slot.start_time)
                slot_end = datetime.combine(current_date, slot.end_time)
                instances.append({
                    "start_datetime": slot_start,
                    "end_datetime": slot_end
                })
                current_date += timedelta(days=7)
                
        return sorted(instances, key=lambda x: x["start_datetime"]) 