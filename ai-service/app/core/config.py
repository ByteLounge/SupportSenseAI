"""
Configuration Module: config.py
Lead Engineer: Member 3 (AI Engineer)
Description: Loads environment variables for FastAPI application and Gemini API keys.
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "SupportSense AI Microservice"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Gemini API Key (Loaded from environment)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "MOCK_GEMINI_KEY_FOR_LOCAL_DEV")
    GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-flash")

settings = Settings()
