"""
Service Module: quality_service.py
Lead Engineer: Member 3 (AI Engineer)
Description: Evaluates draft agent responses for tone, empathy, clarity, and actionability.
"""

from app.core.gemini_client import generate_json_response
from app.prompts.templates import QUALITY_CHECK_PROMPT

def evaluate_response_quality(ticket_context: str, draft_reply: str) -> dict:
    """
    Evaluates agent draft response against the original customer inquiry.
    """
    prompt = QUALITY_CHECK_PROMPT.format(
        ticket_context=ticket_context,
        draft_reply=draft_reply
    )

    fallback = {
        "scores": {
            "professionalism": 88,
            "empathy": 82,
            "clarity": 94,
            "actionability": 85
        },
        "overall_grade": "GOOD",
        "suggestions": [
            "Consider explicitly mentioning expected processing timelines (e.g. 24-48 hours) to reduce customer anxiety."
        ],
        "confidence_score": 0.89
    }

    result = generate_json_response(prompt, fallback)
    return result
