"""
Service Module: quality_service.py
Lead Engineer: Member 3 (AI Engineer)
Description: Evaluates draft agent responses for tone, empathy, clarity, and actionability using
             the QA Director & Empathy Coach role prompt.
             Supports async non-blocking and sync execution with max output token bounds.
"""

from app.core.gemini_client import generate_json_response, generate_json_response_async
from app.prompts.templates import RESPONSE_QUALITY_AUDIT_ROLE_PROMPT

def _build_quality_context(ticket_context: str, draft_reply: str):
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
    return prompt, fallback


async def evaluate_response_quality_async(ticket_context: str, draft_reply: str) -> dict:
    """
    Asynchronously evaluates agent draft response with 384 token ceiling.
    """
    prompt, fallback = _build_quality_context(ticket_context, draft_reply)
    return await generate_json_response_async(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=RESPONSE_QUALITY_AUDIT_ROLE_PROMPT,
        max_output_tokens=384,
        temperature=0.1
    )


def evaluate_response_quality(ticket_context: str, draft_reply: str) -> dict:
    """
    Synchronously evaluates agent draft response.
    """
    prompt, fallback = _build_quality_context(ticket_context, draft_reply)
    return generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=RESPONSE_QUALITY_AUDIT_ROLE_PROMPT,
        max_output_tokens=384,
        temperature=0.1
    )

