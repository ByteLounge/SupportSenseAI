"""
Gemini Client Module: gemini_client.py
Lead Engineer: Member 3 (AI Engineer)
Description: Manages Google Gemini API initialization and JSON prompt execution with fallback handling.
"""

import json
import logging
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("ai_service")

# Initialize Gemini SDK if API key is provided
if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "MOCK_GEMINI_KEY_FOR_LOCAL_DEV":
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        logger.info("Google Gemini SDK configured successfully.")
    except Exception as e:
        logger.error(f"Failed to configure Gemini SDK: {e}")

def generate_json_response(prompt_text: str, fallback_payload: dict) -> dict:
    """
    Executes Gemini LLM request expecting a strict JSON response.
    If API fails, returns pre-configured safe fallback payload with lower confidence score.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "MOCK_GEMINI_KEY_FOR_LOCAL_DEV":
        logger.warning("Using mock fallback AI response (No active GEMINI_API_KEY configured).")
        return fallback_payload

    try:
        model = genai.GenerativeModel(
            settings.GEMINI_MODEL_NAME,
            generation_config={"response_mime_type": "application/json"}
        )
        response = model.generate_content(prompt_text)
        parsed_json = json.loads(response.text)
        return parsed_json
    except Exception as e:
        logger.error(f"Gemini API error during generation: {e}")
        fallback_payload["overall_confidence"] = 0.50
        return fallback_payload
