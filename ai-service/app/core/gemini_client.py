"""
Gemini Client Module: gemini_client.py
Lead Engineer: Member 3 (AI Engineer)
Description: Manages Google Gemini API initialization and JSON prompt execution with fallback handling
             and native support for Role-Based System Instructions.
"""

import json
import logging
from typing import Optional, Dict, Any
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


def generate_json_response(
    prompt_text: str,
    fallback_payload: dict,
    system_instruction: Optional[str] = None
) -> dict:
    """
    Executes Gemini LLM request expecting a strict JSON response.
    Supports system_instruction for role-based persona enforcement.
    If API fails or mock mode is active, returns safe fallback payload.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "MOCK_GEMINI_KEY_FOR_LOCAL_DEV":
        logger.warning("Using mock fallback AI response (No active GEMINI_API_KEY configured).")
        return fallback_payload

    try:
        model_kwargs = {
            "model_name": settings.GEMINI_MODEL_NAME,
            "generation_config": {"response_mime_type": "application/json"}
        }
        if system_instruction:
            model_kwargs["system_instruction"] = system_instruction

        model = genai.GenerativeModel(**model_kwargs)
        response = model.generate_content(prompt_text)
        parsed_json = json.loads(response.text)
        return parsed_json
    except Exception as e:
        logger.error(f"Gemini API error during generation: {e}")
        if "overall_confidence" in fallback_payload:
            fallback_payload["overall_confidence"] = 0.50
        elif "confidence_score" in fallback_payload:
            fallback_payload["confidence_score"] = 0.50
        return fallback_payload
