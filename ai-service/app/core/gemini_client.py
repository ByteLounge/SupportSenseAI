"""
Gemini Client Module: gemini_client.py
Lead Engineer: Member 3 (AI Engineer)
Description: Manages Google Gemini API initialization, model instance pooling,
             asynchronous JSON prompt execution, in-memory TTL response caching,
             and optimized generation parameters for minimum response latency.
"""

import json
import time
import hashlib
import logging
import asyncio
from typing import Optional, Dict, Any, Tuple
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

# ----------------------------------------------------------------------------
# 1. MODEL INSTANCE POOLING (Eliminates repeated GenerativeModel creation overhead)
# ----------------------------------------------------------------------------
_MODEL_CACHE: Dict[Tuple[str, Optional[str]], genai.GenerativeModel] = {}

def get_or_create_model(
    model_name: str,
    system_instruction: Optional[str] = None,
    response_mime_type: str = "application/json"
) -> genai.GenerativeModel:
    """
    Retrieves a cached GenerativeModel instance or instantiates and caches a new one.
    """
    cache_key = (model_name, system_instruction, response_mime_type)
    if cache_key in _MODEL_CACHE:
        return _MODEL_CACHE[cache_key]

    model_kwargs: Dict[str, Any] = {
        "model_name": model_name,
        "generation_config": {
            "response_mime_type": response_mime_type,
            "temperature": 0.1,  # Low temperature for deterministic & faster token decoding
            "top_p": 0.95
        }
    }
    if system_instruction:
        model_kwargs["system_instruction"] = system_instruction

    model = genai.GenerativeModel(**model_kwargs)
    _MODEL_CACHE[cache_key] = model
    return model


# ----------------------------------------------------------------------------
# 2. IN-MEMORY TTL RESPONSE CACHE (Sub-millisecond latency for identical queries)
# ----------------------------------------------------------------------------
_RESPONSE_CACHE: Dict[str, Tuple[float, dict]] = {}
CACHE_TTL_SECONDS = 300  # 5-minute cache for identical requests
MAX_CACHE_ENTRIES = 500

def _get_cache_key(prompt_text: str, system_instruction: Optional[str] = None) -> str:
    raw = f"{system_instruction or ''}___{prompt_text}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def _get_from_cache(cache_key: str) -> Optional[dict]:
    if cache_key in _RESPONSE_CACHE:
        timestamp, data = _RESPONSE_CACHE[cache_key]
        if time.time() - timestamp < CACHE_TTL_SECONDS:
            return data
        else:
            del _RESPONSE_CACHE[cache_key]
    return None

def _save_to_cache(cache_key: str, data: dict):
    if len(_RESPONSE_CACHE) >= MAX_CACHE_ENTRIES:
        # Evict oldest 20%
        oldest = sorted(_RESPONSE_CACHE.items(), key=lambda x: x[1][0])[:100]
        for k, _ in oldest:
            _RESPONSE_CACHE.pop(k, None)
    _RESPONSE_CACHE[cache_key] = (time.time(), data)


# ----------------------------------------------------------------------------
# 3. ASYNC & SYNC JSON GENERATION METHODS
# ----------------------------------------------------------------------------
async def generate_json_response_async(
    prompt_text: str,
    fallback_payload: dict,
    system_instruction: Optional[str] = None,
    max_output_tokens: int = 512,
    temperature: float = 0.1
) -> dict:
    """
    Asynchronously executes Gemini LLM request expecting a strict JSON response.
    Non-blocking: leverages model.generate_content_async to preserve FastAPI event-loop concurrency.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "MOCK_GEMINI_KEY_FOR_LOCAL_DEV":
        return fallback_payload

    cache_key = _get_cache_key(prompt_text, system_instruction)
    cached_result = _get_from_cache(cache_key)
    if cached_result is not None:
        return cached_result

    try:
        model = get_or_create_model(
            model_name=settings.GEMINI_MODEL_NAME,
            system_instruction=system_instruction,
            response_mime_type="application/json"
        )
        
        gen_config = {
            "response_mime_type": "application/json",
            "temperature": temperature,
            "max_output_tokens": max_output_tokens,
            "top_p": 0.95
        }

        # Asynchronous call with 4.5 second timeout to prevent backend stall
        response = await asyncio.wait_for(
            model.generate_content_async(prompt_text, generation_config=gen_config),
            timeout=4.5
        )
        parsed_json = json.loads(response.text)
        _save_to_cache(cache_key, parsed_json)
        return parsed_json

    except asyncio.TimeoutError:
        logger.warning("Gemini API async call timed out (>4.5s). Returning fallback payload.")
        return fallback_payload
    except Exception as e:
        logger.error(f"Gemini API async error during generation: {e}")
        if "overall_confidence" in fallback_payload:
            fallback_payload["overall_confidence"] = 0.50
        elif "confidence_score" in fallback_payload:
            fallback_payload["confidence_score"] = 0.50
        return fallback_payload


def generate_json_response(
    prompt_text: str,
    fallback_payload: dict,
    system_instruction: Optional[str] = None,
    max_output_tokens: int = 512,
    temperature: float = 0.1
) -> dict:
    """
    Synchronous fallback for testing or non-async callers with model pooling and caching.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "MOCK_GEMINI_KEY_FOR_LOCAL_DEV":
        return fallback_payload

    cache_key = _get_cache_key(prompt_text, system_instruction)
    cached_result = _get_from_cache(cache_key)
    if cached_result is not None:
        return cached_result

    try:
        model = get_or_create_model(
            model_name=settings.GEMINI_MODEL_NAME,
            system_instruction=system_instruction,
            response_mime_type="application/json"
        )
        
        gen_config = {
            "response_mime_type": "application/json",
            "temperature": temperature,
            "max_output_tokens": max_output_tokens,
            "top_p": 0.95
        }

        response = model.generate_content(prompt_text, generation_config=gen_config)
        parsed_json = json.loads(response.text)
        _save_to_cache(cache_key, parsed_json)
        return parsed_json
    except Exception as e:
        logger.error(f"Gemini API error during generation: {e}")
        if "overall_confidence" in fallback_payload:
            fallback_payload["overall_confidence"] = 0.50
        elif "confidence_score" in fallback_payload:
            fallback_payload["confidence_score"] = 0.50
        return fallback_payload

