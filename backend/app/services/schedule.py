from datetime import datetime, time, timedelta
from typing import List, Optional
from ..models.schedule import Schedule, WeeklyTimeSlot, DayOfWeek
from ..db.mongodb import get_database
from bson import ObjectId

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
        return await self.get_user_schedule(user_id)

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