# backend/tests/test_llm_service.py
import pytest
import json
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.llm_service import LLMService, llm_service

@pytest.fixture
def mock_openai_response():
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = """
    {
        "days": {
            "Monday": {
                "workout_items": [
                    {
                        "type": "cardio",
                        "duration": "10 min",
                        "exercises": [
                            {
                                "name": "jumping jacks",
                                "sets": 3,
                                "reps_per_set": 10
                            }
                        ]
                    }
                ],
                "location": "Main Gym",
                "time": "3:00-3:15PM"
            }
        }
    }
    """
    return mock_response

@pytest.fixture
def setup_llm_service(mock_openai_response):
    # Create a mock client
    mock_client = MagicMock()
    mock_client.chat = MagicMock()
    mock_client.chat.completions = MagicMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_openai_response)
    
    # Set the mock client
    llm_service.set_mock_client(mock_client)
    
    yield llm_service
    
    # Clean up after test
    llm_service.client = None

@pytest.mark.asyncio
async def test_generate_completion(setup_llm_service):
    # Use the mocked LLM service
    result = await setup_llm_service.generate_completion(
        system_prompt="Test system prompt",
        user_prompt="Test user prompt"
    )
    
    # Verify the client was called correctly
    setup_llm_service.client.chat.completions.create.assert_called_once()
    
    # Verify we got the expected response
    assert "days" in result
    assert "Monday" in json.loads(result)["days"]

@pytest.mark.asyncio
async def test_generate_json_completion(setup_llm_service):
    # Use the mocked LLM service
    result = await setup_llm_service.generate_json_completion(
        system_prompt="Test system prompt",
        user_prompt="Test user prompt"
    )
    
    # Verify we got parsed JSON
    assert isinstance(result, dict)
    assert "days" in result
    assert "Monday" in result["days"]

@pytest.mark.asyncio
async def test_generate_json_completion_with_code_blocks():
    # Create a specific mock response for this test
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = """
    ```json
    {
        "days": {
            "Tuesday": {
                "workout_items": []
            }
        }
    }
    ```
    """
    
    # Create a mock client with this specific response
    mock_client = MagicMock()
    mock_client.chat = MagicMock()
    mock_client.chat.completions = MagicMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
    
    # Set the mock client
    llm_service.set_mock_client(mock_client)
    
    result = await llm_service.generate_json_completion(
        system_prompt="Test system prompt",
        user_prompt="Test user prompt"
    )
    
    # Verify code blocks were properly removed
    assert isinstance(result, dict)
    assert "days" in result
    assert "Tuesday" in result["days"]

@pytest.mark.asyncio
async def test_generate_json_completion_invalid_json():
    # Create a specific mock response for this test
    mock_response = MagicMock()
    mock_response.choices = [MagicMock()]
    mock_response.choices[0].message.content = "Not a valid JSON"
    
    # Create a mock client with this specific response
    mock_client = MagicMock()
    mock_client.chat = MagicMock()
    mock_client.chat.completions = MagicMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
    
    # Set the mock client
    llm_service.set_mock_client(mock_client)
    
    with pytest.raises(ValueError):
        await llm_service.generate_json_completion(
            system_prompt="Test system prompt",
            user_prompt="Test user prompt"
        )