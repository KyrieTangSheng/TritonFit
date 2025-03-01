import json
import os
import logging
from typing import Dict, Any, List, Optional
from openai import AsyncOpenAI
from dotenv import load_dotenv
from ..core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Force load environment variables
load_dotenv()

# Get API key directly from environment
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4")

# Log the API key status (redacted for security)
if OPENAI_API_KEY:
    logger.info(f"OPENAI_API_KEY found with length: {len(OPENAI_API_KEY)}")
else:
    logger.warning("OPENAI_API_KEY not found in environment")

class LLMService:
    """Service for interacting with Language Learning Models"""
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, api_key: Optional[str] = None, mock_client: Optional[Any] = None):
        """Initialize the LLM service"""
        # Only initialize once
        if hasattr(self, 'client'):
            return
        
        # Use direct environment variable - bypass settings
        self.api_key = api_key or OPENAI_API_KEY
        self.model = OPENAI_MODEL
        
        if mock_client is not None:
            self.client = mock_client
        else:
            # Force direct API key usage
            self.client = AsyncOpenAI(api_key=self.api_key)
            logger.info(f"AsyncOpenAI client initialized with model: {self.model}")

    def set_mock_client(self, mock_client):
        """Set a mock client for testing purposes"""
        self.client = mock_client

    async def generate_completion(self, 
                                 system_prompt: str, 
                                 user_prompt: str, 
                                 temperature: float = 0.7) -> str:
        """Generate a completion using the LLM"""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature,
        )
        
        return response.choices[0].message.content

    async def generate_json_completion(self, 
                                     system_prompt: str, 
                                     user_prompt: str, 
                                     temperature: float = 0.7) -> Dict[str, Any]:
        """Generate a completion and parse it as JSON"""
        content = await self.generate_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=temperature
        )
        
        # Clean up the response to ensure it's valid JSON
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        
        return json.loads(content)

# Create singleton instance - with hardcoded API key for testing if needed
API_KEY = os.environ.get("OPENAI_API_KEY", "Your API Key Here")
llm_service = LLMService(api_key=API_KEY) 