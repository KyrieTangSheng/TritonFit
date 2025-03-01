from pydantic import BaseSettings, Field
from typing import Optional

class Settings(BaseSettings):
    MONGODB_URL: str
    DATABASE_NAME: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # OpenAI settings - make these optional with defaults
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: Optional[str] = "gpt-4"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()