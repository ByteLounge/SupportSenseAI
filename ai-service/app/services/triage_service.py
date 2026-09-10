"""
Service Module: triage_service.py
Lead Engineer: Member 3 (AI Engineer)
Description: Performs ticket classification, sentiment/mood detection, resolution duration forecasting
             grounded in Kaggle/HuggingFace dataset benchmarks, and checklist generation.
             Supports both async non-blocking and sync execution with max output token bounds.
"""

import json
from app.core.gemini_client import generate_json_response, generate_json_response_async
from app.prompts.templates import (
    TRIAGE_AND_CATEGORIZATION_ROLE_PROMPT,
    TIMELINE_SUMMARIZER_ROLE_PROMPT
)
from app.services.dataset_service import (
    get_dataset_benchmark_metrics,
    get_few_shot_examples_for_category
)

def _build_triage_context(title: str, description: str):
    benchmarks = get_dataset_benchmark_metrics()
    few_shots = get_few_shot_examples_for_category(count=2)

    benchmark_str = json.dumps(benchmarks, indent=2)
    if few_shots:
        benchmark_str += "\n\nSAMPLE HISTORICAL RESOLUTION BENCHMARKS:\n"
        for idx, ex in enumerate(few_shots, 1):
            benchmark_str += f"- Example #{idx}: [{ex['category']} / {ex['priority']}] -> {ex['resolution']} (Time: {ex['resolution_time']})\n"

    prompt = TRIAGE_AND_CATEGORIZATION_ROLE_PROMPT.format(
        benchmark_context=benchmark_str,
        title=title,
        description=description
    )

    full_text = f"{title} {description}".lower()
    has_severe_impact = any(k in full_text for k in ["outage", "downtime", "data loss", "breach", "security exploit", "overcharge", "double charged"])
    is_minor_inquiry = any(k in full_text for k in ["how to", "faq", "question", "typo", "button", "color", "feature request", "where can i"])
    claimed_urgent = any(k in full_text for k in ["urgent", "immediately", "asap", "emergency", "hurry", "right now", "livid"])

    # Determine objective priority decoupled from emotion
    if has_severe_impact:
        priority = "URGENT" if ("outage" in full_text or "data loss" in full_text) else "HIGH"
        urgency_reasoning = "Verified high operational impact based on technical severity keywords."
    elif is_minor_inquiry:
        priority = "LOW"
        urgency_reasoning = "User expressed urgency, but underlying issue is an informational query or cosmetic item. Calibrated to LOW per SLA anti-gaming policy." if claimed_urgent else "Standard low-severity informational inquiry."
    else:
        priority = "MEDIUM"
        urgency_reasoning = "Emotional urgency claims detected without proof of production stoppage. Assigned standard MEDIUM priority." if claimed_urgent else "Standard operational troubleshooting priority."

    fallback = {
        "category": "Billing" if ("charge" in full_text or "billing" in full_text or "invoice" in full_text) else "General",
        "priority": priority,
        "customer_mood": "FRUSTRATED" if ("refund" in full_text or "wrong" in full_text or "broken" in full_text or claimed_urgent) else "NEUTRAL",
        "mood_confidence": 0.88,
        "patience_score": "CRITICAL" if ("cancel" in full_text or "legal" in full_text) else ("CONCERNED" if claimed_urgent else "CALM"),
        "predicted_resolution_time": "1-2 business days",
        "urgency_reasoning": urgency_reasoning,
        "overall_confidence": 0.90,
        "checklist": [
            "Verify customer account & subscription status",
            "Review system backend logs for transaction anomalies",
            "Send polite confirmation response with resolution steps"
        ],
        "suggested_reply": f"Hello, thank you for reaching out regarding '{title}'. We are investigating your issue right now."
    }
    return prompt, fallback


async def process_ticket_triage_async(title: str, description: str) -> dict:
    """
    Asynchronously analyzes ticket with non-blocking Gemini call and 512 token ceiling.
    """
    prompt, fallback = _build_triage_context(title, description)
    return await generate_json_response_async(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=TRIAGE_AND_CATEGORIZATION_ROLE_PROMPT,
        max_output_tokens=512,
        temperature=0.1
    )


def process_ticket_triage(title: str, description: str) -> dict:
    """
    Synchronous ticket triage function for backward compatibility and test runners.
    """
    prompt, fallback = _build_triage_context(title, description)
    return generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=TRIAGE_AND_CATEGORIZATION_ROLE_PROMPT,
        max_output_tokens=512,
        temperature=0.1
    )


def _build_timeline_context(messages: list):
    formatted_messages = []
    for idx, msg in enumerate(messages, start=1):
        role = getattr(msg, 'sender_role', 'USER') if not isinstance(msg, dict) else msg.get('sender_role', 'USER')
        name = getattr(msg, 'sender_name', 'Customer') if not isinstance(msg, dict) else msg.get('sender_name', 'Customer')
        body = getattr(msg, 'message_body', '') if not isinstance(msg, dict) else msg.get('message_body', '')
        formatted_messages.append(f"{idx}. [{role} - {name}]: {body}")

    messages_text = "\n".join(formatted_messages)
    prompt = TIMELINE_SUMMARIZER_ROLE_PROMPT.format(messages_text=messages_text)
    bullets = [f"• {msg}" for msg in formatted_messages[:6]]
    fallback = {
        "timeline_summary": "\n".join(bullets) if bullets else "• Ticket history initialized.",
        "confidence_score": 0.92
    }
    return prompt, fallback


async def process_timeline_summary_async(messages: list) -> dict:
    """
    Asynchronously generates timeline summary with 384 token ceiling.
    """
    prompt, fallback = _build_timeline_context(messages)
    return await generate_json_response_async(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=TIMELINE_SUMMARIZER_ROLE_PROMPT,
        max_output_tokens=384,
        temperature=0.1
    )


def process_timeline_summary(messages: list) -> dict:
    """
    Synchronous timeline summarizer function.
    """
    prompt, fallback = _build_timeline_context(messages)
    return generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=TIMELINE_SUMMARIZER_ROLE_PROMPT,
        max_output_tokens=384,
        temperature=0.1
    )

