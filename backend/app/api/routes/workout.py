from fastapi import APIRouter, Depends, HTTPException, Body, Path, Query
from typing import Optional, List, Dict, Any
from ...services.workout_service import (
    generate_workout_plan, 
    update_workout_plan, 
    get_today_workout, 
    get_workout_plan_by_id,
    manually_update_workout_plan,
    update_workout_day,
    update_workout_item
)
from ...models.workout_model import WorkoutPlan, WorkoutFeedback, DayWorkout, WorkoutItem
from ...core.auth import get_current_user
from ...models.user import UserInDB

router = APIRouter()

@router.post("/", response_model=WorkoutPlan)
async def create_workout_plan(current_user: UserInDB = Depends(get_current_user)):
    """Generate a new workout plan for the user"""
    return await generate_workout_plan(user_id=current_user.id)

@router.get("/today")
async def get_todays_workout(current_user: UserInDB = Depends(get_current_user)):
    """Get the workout for today"""
    result = await get_today_workout(user_id=current_user.id)
    if not result:
        return {"plan_id": None, "day": None, "workout": None}
    return result 

@router.get("/{plan_id}", response_model=WorkoutPlan)
async def get_workout_plan(plan_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Get a specific workout plan"""
    plan = await get_workout_plan_by_id(plan_id=plan_id, user_id=current_user.id)
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    return plan

@router.put("/{plan_id}", response_model=WorkoutPlan)
async def update_plan(
    plan_id: str,
    updated_plan: WorkoutPlan = Body(...),
    current_user: UserInDB = Depends(get_current_user)
):
    """Manually update a workout plan"""
    try:
        return await manually_update_workout_plan(
            plan_id=plan_id,
            user_id=current_user.id,
            updated_plan=updated_plan
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{plan_id}/days/{day}", response_model=WorkoutPlan)
async def update_day(
    plan_id: str,
    day: str = Path(..., description="Day of the week"),
    day_workout: DayWorkout = Body(...),
    current_user: UserInDB = Depends(get_current_user)
):
    """Update a specific day in a workout plan"""
    try:
        return await update_workout_day(
            plan_id=plan_id,
            user_id=current_user.id,
            day=day,
            day_workout=day_workout
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{plan_id}/days/{day}/items/{item_index}", response_model=WorkoutPlan)
async def update_workout_item_endpoint(
    plan_id: str,
    day: str = Path(..., description="Day of the week"),
    item_index: int = Path(..., description="Index of the workout item"),
    workout_item: WorkoutItem = Body(...),
    current_user: UserInDB = Depends(get_current_user)
):
    """Update a specific workout item within a day"""
    try:
        return await update_workout_item(
            plan_id=plan_id,
            user_id=current_user.id,
            day=day,
            item_index=item_index,
            workout_item=workout_item
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{plan_id}/feedback", response_model=WorkoutPlan)
async def provide_feedback(
    plan_id: str, 
    feedback: WorkoutFeedback, 
    current_user: UserInDB = Depends(get_current_user)
):
    """Update a workout plan based on user feedback"""
    return await update_workout_plan(
        plan_id=plan_id,
        user_id=current_user.id,
        feedback=feedback.feedback
    )