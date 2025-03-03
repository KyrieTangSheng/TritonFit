from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.mongodb import connect_to_mongo, close_mongo_connection
from .api.routes import auth, schedule, profile, workout

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers for database connection
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(schedule.router, prefix="/users", tags=["users"])
app.include_router(profile.router, prefix="/users", tags=["users"])
app.include_router(workout.router, prefix="/workout-plans", tags=["workout-plans"])

@app.get("/")
async def root():
    return {"message": "Welcome to TritonFit API"}