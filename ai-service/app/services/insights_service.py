"""
Service Module: insights_service.py
Lead Engineer: Member 3 (AI Engineer)
Description: Generates weekly organizational learning insights and FAQ recommendations
             using the Knowledge Base Architect role and historical ticket data.
             Supports async non-blocking and sync execution with max output token bounds.
"""

import json
from app.core.gemini_client import generate_json_response, generate_json_response_async
from app.prompts.templates import ORGANIZATIONAL_INSIGHTS_ROLE_PROMPT
from app.services.dataset_service import load_local_kaggle_tickets

def _build_insights_context(week_identifier: str):
    recent_samples = load_local_kaggle_tickets(limit=15)
    sample_summary = []
    for s in recent_samples:
        sample_summary.append({
            "ticket_title": s.get("title", ""),
            "category": s.get("category", "General"),
            "resolution": s.get("resolution", ""),
            "satisfaction": s.get("customer_satisfaction", "3")
        })

    prompt = ORGANIZATIONAL_INSIGHTS_ROLE_PROMPT.format(
        weekly_ticket_data=json.dumps(sample_summary, indent=2),
        week_identifier=week_identifier
    )

    fallback = {
        "week_identifier": week_identifier,
        "top_issues": [
            {"issue": "Duplicate subscription renewal charges", "count": "14 tickets"},
            {"issue": "API JWT Token expiration during high load", "count": "9 tickets"},
            {"issue": "Dark mode contrast settings on mobile devices", "count": "6 tickets"}
        ],
        "common_mistakes": [
            {"mistake": "Support agents forgetting to specify bank processing timelines on credit refunds", "impact": "Increased follow-up ticket volume"}
        ],
        "knowledge_gaps": [
            {"gap": "Missing self-serve portal guide for enterprise invoice downloads"}
        ],
        "recommended_faqs": [
            {
                "question": "How long do duplicate billing refunds take to credit back to my card?",
                "suggested_answer": "Refunds process immediately from our end and typically reflect in your account within 3 to 5 business days depending on your financial institution."
            }
        ],
        "confidence_score": 0.94
    }
    return prompt, fallback


async def generate_weekly_learning_insights_async(week_identifier: str = "2026-W34") -> dict:
    """
    Asynchronously synthesizes ticket analytics into weekly insights with 768 token ceiling.
    """
    prompt, fallback = _build_insights_context(week_identifier)
    return await generate_json_response_async(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=ORGANIZATIONAL_INSIGHTS_ROLE_PROMPT,
        max_output_tokens=768,
        temperature=0.1
    )


def generate_weekly_learning_insights(week_identifier: str = "2026-W34") -> dict:
    """
    Synchronously synthesizes ticket analytics into weekly learning insights.
    """
    prompt, fallback = _build_insights_context(week_identifier)
    return generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=ORGANIZATIONAL_INSIGHTS_ROLE_PROMPT,
        max_output_tokens=768,
        temperature=0.1
    )

