import sys
import os
from pathlib import Path
from dotenv import load_dotenv
import pytest
from datetime import datetime
import asyncio

# Add the parent directory to PYTHONPATH
root_dir = Path(__file__).parent.parent
sys.path.append(str(root_dir))

# Load test environment variables
load_dotenv(root_dir / ".env.test")

@pytest.fixture
def valid_user_data():
    return {
        "username": "testuser",
        "email": "test@ucsd.edu",
        "password": "TestPass123!",
        "created_at": datetime.utcnow().isoformat()
    } 


@pytest.fixture(scope="session")
def event_loop():
    """Create a new event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
