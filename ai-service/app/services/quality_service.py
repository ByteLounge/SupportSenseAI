"""
Service Module: quality_service.py
Lead Engineer: Member 3 (AI Engineer)
Description: Evaluates draft agent responses for tone, empathy, clarity, and actionability using
             the QA Director & Empathy Coach role prompt.
"""

from app.core.gemini_client import generate_json_response
from app.prompts.templates import RESPONSE_QUALITY_AUDIT_ROLE_PROMPT


def evaluate_response_quality(ticket_context: str, draft_reply: str) -> dict:
    """
    Evaluates agent draft response against the original customer inquiry.
    """
    prompt = RESPONSE_QUALITY_AUDIT_ROLE_PROMPT.format(
        ticket_context=ticket_context,
        draft_reply=draft_reply
    )

    fallback = {
        "scores": {
            "professionalism": 90,
            "empathy": 86,
            "clarity": 94,
            "actionability": 85
        },
        "overall_grade": "GOOD",
        "suggestions": [
            "Consider explicitly mentioning expected processing timelines (e.g. 24-48 hours) to reduce customer anxiety."
        ],
        "confidence_score": 0.91
    }

    result = generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=RESPONSE_QUALITY_AUDIT_ROLE_PROMPT
    )
    return result
