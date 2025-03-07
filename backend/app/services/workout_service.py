from typing import Dict, Optional, List
import json
from datetime import datetime
from ..db.mongodb import get_database
from ..models.workout_model import WorkoutPlan, FeedbackEntry, DayWorkout, WorkoutItem
from .llm_service import llm_service

# List of all days in a week
DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Standard Json Format for the workout plan
plan_json_format = """
    {{
      "days": {{
        "Monday": {{
          "workout_items": [
            {{
              "type": "cardio|strength|flexibility",
              "duration": "30 min",
              "exercises": [
                {{
                  "name": "exercise name",
                  "sets": 3,
                  "reps_per_set": 10,
                  "rest_between_sets": "30 sec",
                  "equipment": ["none", "dumbbells"],
                  "difficulty": "beginner|intermediate|advanced",
                  "notes": "optional notes"
                }}
              ]
            }}
          ],
          "location": "Gym|Home|Outdoor",
          "time": "6:00-6:30AM"
        }},
        ...other days...
      }}
    }}
"""

async def generate_workout_plan(user_id: str) -> WorkoutPlan:
    """Generate a workout plan based on user profile and schedule"""
    # Get the user's profile and schedule from the database
    db = await get_database()
    user_profile = await db.profiles.find_one({"user_id": user_id})
    user_schedule = await db.schedules.find_one({"user_id": user_id})
    
    if not user_profile or not user_schedule:
        raise ValueError("User profile or schedule not found")
    
    # Prepare the prompt for LLM
    user_prompt = f"""
    Create a personalized workout plan based on the following information:
    
    User Profile:
    - Fitness Goals: {user_profile.get('fitness_goals', [])}
    - Fitness Level: {user_profile.get('fitness_level', 'beginner')}
    - Age: {user_profile.get('age')}
    - Weight: {user_profile.get('weight')}
    - Height: {user_profile.get('height')}
    - Health Conditions: {user_profile.get('health_conditions', [])}
    
    Available Schedule:
    {user_schedule.get('availability', {})}
    If user has no schedule, by default the user is available at any time of the day
    
    Please create a detailed weekly workout plan for ALL 7 days (Monday through Sunday) in the following JSON format:
    {plan_json_format}
    Note: If a day should be a rest day, include it with an empty workout_items array but add a note.
    Return ONLY the valid JSON with no additional text.
    """
    
    system_prompt = "You are a professional fitness trainer creating personalized workout plans."
    
    try:
        # Generate plan using LLM service
        plan_data = await llm_service.generate_json_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt
        )
        
        # Ensure all days of the week are included
        days_data = plan_data.get("days", {})
        for day in DAYS_OF_WEEK:
            if day not in days_data:
                # Add empty day if missing
                days_data[day] = {
                    "workout_items": [],
                    "location": "Rest day",
                    "time": "N/A"
                }
        
        # Create and save the workout plan
        # Ensure user_id is a string
        str_user_id = str(user_id)
        workout_plan = WorkoutPlan(
            user_id=str_user_id,
            days=days_data
        )
        
        # Save to database
        await db.workout_plans.insert_one(workout_plan.dict())
        
        return workout_plan
    
    except Exception as e:
        raise ValueError(f"Failed to generate workout plan: {str(e)}")

async def update_workout_plan(plan_id: str, user_id: str, feedback: str) -> WorkoutPlan:
    """Update a workout plan based on user feedback"""
    db = await get_database()
    
    # Get the existing plan
    str_plan_id = str(plan_id)
    str_user_id = str(user_id)
    existing_plan = await db.workout_plans.find_one({"id": str_plan_id, "user_id": str_user_id})
    if not existing_plan:
        raise ValueError("Workout plan not found")
    
    # Convert to WorkoutPlan object
    plan = WorkoutPlan(**existing_plan)
    
    # Update version and add feedback to history
    new_version = plan.version + 1
    plan.feedback_history.append(
        FeedbackEntry(
            feedback=feedback,
            resulted_in_version=new_version
        )
    )
    plan.version = new_version
    plan.updated_at = datetime.now()
    
    # Prepare prompts for LLM
    user_prompt = f"""
    Please update this workout plan based on the following feedback:
    
    FEEDBACK: {feedback}
    
    CURRENT PLAN:
    {json.dumps(plan.dict().get('days'), indent=2)}
    
    Please provide an updated workout plan for ALL 7 days (Monday through Sunday).
    Return ONLY the valid JSON with the format:
    {plan_json_format}
    """
    
    system_prompt = "You are a professional fitness trainer updating personalized workout plans based on user feedback. Return valid JSON matching the format exactly."
    
    try:
        # Generate updated plan using LLM service
        llm_response = await llm_service.generate_json_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt
        )
        
        print(f"LLM Response: {llm_response}")
        
        # Check if the response has the expected structure
        if "days" in llm_response:
            updated_plan = llm_response
        else:
            # If the top level has day names (Monday, Tuesday, etc.), wrap it in a days object
            if any(day in llm_response for day in DAYS_OF_WEEK):
                updated_plan = {"days": llm_response}
            else:
                raise ValueError(f"Unexpected response format from LLM: {llm_response}")
        
        # Ensure all days of the week are included
        days_data = updated_plan.get("days", {})
        
        # Convert the LLM response to match our expected workout item structure
        for day, day_data in days_data.items():
            if day not in DAYS_OF_WEEK:
                continue
                
            # Ensure workout_items exists and has the right format
            if "workout_items" not in day_data:
                day_data["workout_items"] = []
            elif not isinstance(day_data["workout_items"], list):
                day_data["workout_items"] = []
                
            # Convert each workout item to match our model
            standardized_items = []
            for item in day_data.get("workout_items", []):
                if isinstance(item, dict):
                    # Handle case where the API returns a different format
                    if "type" not in item and "exercise" in item:
                        # Map simple format to our model's format
                        exercise_type = "cardio"
                        if "strength" in item.get("exercise", "").lower():
                            exercise_type = "strength"
                        elif "yoga" in item.get("exercise", "").lower() or "stretch" in item.get("exercise", "").lower():
                            exercise_type = "flexibility"
                            
                        standardized_item = {
                            "type": exercise_type,
                            "duration": item.get("duration", "30 min"),
                            "exercises": [
                                {
                                    "name": item.get("exercise", ""),
                                    "sets": 1,
                                    "reps_per_set": item.get("reps", "").split(" of ")[-1] if "reps" in item else 1,
                                    "rest_between_sets": "30 sec",
                                    "equipment": ["none"],
                                    "difficulty": "intermediate",
                                    "notes": ""
                                }
                            ]
                        }
                        standardized_items.append(standardized_item)
                    else:
                        # Already in correct format or close enough
                        standardized_items.append(item)
            
            day_data["workout_items"] = standardized_items
                
            # Ensure location and time exist
            if "location" not in day_data:
                day_data["location"] = "Home"
            if "time" not in day_data:
                day_data["time"] = "Morning"
                
        # Add missing days
        for day in DAYS_OF_WEEK:
            if day not in days_data:
                days_data[day] = {
                    "workout_items": [],
                    "location": "Rest day",
                    "time": "N/A"
                }
        
        # Update the plan with new days
        plan.days = days_data
        
        # Save the updated plan
        await db.workout_plans.replace_one({"id": str_plan_id}, plan.dict())
        
        return plan
    
    except Exception as e:
        print(f"Error updating workout plan: {str(e)}")
        raise ValueError(f"Failed to update workout plan: {str(e)}")

async def get_today_workout(user_id: str) -> Optional[Dict]:
    """Get the workout plan for the current day of the week"""
    # Get the current day of the week
    today = datetime.now().strftime("%A")  # Returns full day name (Monday, Tuesday, etc.)
    
    # Get the user's latest workout plan
    db = await get_database()
    str_user_id = str(user_id)
    latest_plan = await db.workout_plans.find_one(
        {"user_id": str_user_id},
        sort=[("created_at", -1)]
    )
    
    if not latest_plan:
        await generate_workout_plan(user_id)
        latest_plan = await db.workout_plans.find_one(
            {"user_id": str_user_id},
            sort=[("created_at", -1)]
        )
    
    # Convert to WorkoutPlan object
    plan = WorkoutPlan(**latest_plan)
    # Return today's workout
    return {
        "plan_id": plan.id,
        "day": today,
        "workout": plan.days.get(today, {"workout_items": [], "location": "No workout scheduled", "time": "N/A"})
    } 

async def get_workout_plan_by_id(plan_id: str, user_id: str) -> Optional[WorkoutPlan]:
    """Get a workout plan by its ID"""
    db = await get_database()
    # Convert both IDs to string
    str_plan_id = str(plan_id)
    str_user_id = str(user_id)
    plan = await db.workout_plans.find_one({"id": str_plan_id, "user_id": str_user_id})
    return WorkoutPlan(**plan) if plan else None

async def manually_update_workout_plan(plan_id: str, user_id: str, updated_plan: WorkoutPlan) -> WorkoutPlan:
    """Manually update a workout plan with user-provided data"""
    db = await get_database()
    
    # Get the existing plan
    str_plan_id = str(plan_id)
    str_user_id = str(user_id)
    existing_plan = await db.workout_plans.find_one({"id": str_plan_id, "user_id": str_user_id})
    if not existing_plan:
        raise ValueError("Workout plan not found")
    
    # Convert to WorkoutPlan object
    plan = WorkoutPlan(**existing_plan)
    
    # Update version
    plan.version += 1
    plan.updated_at = datetime.now()
    plan.status = updated_plan.status

    # Update the days content
    plan.days = updated_plan.days
    
    # Save the updated plan
    await db.workout_plans.replace_one({"id": str_plan_id}, plan.dict())
    
    return plan

async def update_workout_day(plan_id: str, user_id: str, day: str, day_workout: DayWorkout) -> WorkoutPlan:
    """Update a specific day in a workout plan"""
    db = await get_database()
    
    # Validate day
    if day not in DAYS_OF_WEEK:
        raise ValueError(f"Invalid day: {day}. Must be one of {DAYS_OF_WEEK}")
    
    # Get the existing plan
    str_plan_id = str(plan_id)
    str_user_id = str(user_id)
    existing_plan = await db.workout_plans.find_one({"id": str_plan_id, "user_id": str_user_id})
    if not existing_plan:
        raise ValueError("Workout plan not found")
    
    # Convert to WorkoutPlan object
    plan = WorkoutPlan(**existing_plan)
    
    # Update version
    plan.version += 1
    plan.updated_at = datetime.now()
    
    # Update the specific day
    plan.days[day] = day_workout
    
    # Save the updated plan
    await db.workout_plans.replace_one({"id": str_plan_id}, plan.dict())
    
    return plan

async def update_workout_item(
    plan_id: str, 
    user_id: str, 
    day: str, 
    item_index: int, 
    workout_item: WorkoutItem
) -> WorkoutPlan:
    """Update a specific workout item within a day"""
    db = await get_database()
    
    # Validate day
    if day not in DAYS_OF_WEEK:
        raise ValueError(f"Invalid day: {day}. Must be one of {DAYS_OF_WEEK}")
    
    # Get the existing plan
    str_plan_id = str(plan_id)
    str_user_id = str(user_id)
    existing_plan = await db.workout_plans.find_one({"id": str_plan_id, "user_id": str_user_id})
    if not existing_plan:
        raise ValueError("Workout plan not found")
    
    # Convert to WorkoutPlan object
    plan = WorkoutPlan(**existing_plan)
    
    # Check if the day exists in the plan
    if day not in plan.days:
        raise ValueError(f"Day {day} not found in workout plan")
    
    # Check if the item index is valid
    if item_index < 0 or item_index >= len(plan.days[day].workout_items):
        raise ValueError(f"Invalid item index: {item_index}")
    
    # Update version
    plan.version += 1
    plan.updated_at = datetime.now()
    
    # Update the specific workout item
    plan.days[day].workout_items[item_index] = workout_item
    
    # Save the updated plan
    await db.workout_plans.replace_one({"id": str_plan_id}, plan.dict())
    
    return plan