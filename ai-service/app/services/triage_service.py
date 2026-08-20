"""
Service Module: triage_service.py
Lead Engineer: Member 3 (AI Engineer)
Description: Performs ticket classification, sentiment/mood detection, resolution duration forecasting
             grounded in Kaggle/HuggingFace dataset benchmarks, and checklist generation.
"""

import json
from app.core.gemini_client import generate_json_response
from app.prompts.templates import (
    TRIAGE_AND_CATEGORIZATION_ROLE_PROMPT,
    TIMELINE_SUMMARIZER_ROLE_PROMPT
)
from app.services.dataset_service import (
    get_dataset_benchmark_metrics,
    get_few_shot_examples_for_category
)


def process_ticket_triage(title: str, description: str) -> dict:
    """
    Analyzes ticket title & description using Role-Based System Prompting and Dataset Benchmarks.
    Returns category, priority, mood, patience score, resolution time, and agent checklist.
    """
    # 1. Fetch benchmark metrics from local Kaggle / streamed datasets
    benchmarks = get_dataset_benchmark_metrics()
    few_shots = get_few_shot_examples_for_category(count=2)

    benchmark_str = json.dumps(benchmarks, indent=2)
    if few_shots:
        benchmark_str += "\n\nSAMPLE HISTORICAL RESOLUTION BENCHMARKS:\n"
        for idx, ex in enumerate(few_shots, 1):
            benchmark_str += f"- Example #{idx}: [{ex['category']} / {ex['priority']}] -> {ex['resolution']} (Time: {ex['resolution_time']})\n"

    # 2. Build prompt with role constraints and dataset benchmarks
    prompt = TRIAGE_AND_CATEGORIZATION_ROLE_PROMPT.format(
        benchmark_context=benchmark_str,
        title=title,
        description=description
    )

    fallback = {
        "category": "Billing" if "charge" in description.lower() or "billing" in description.lower() else "General",
        "priority": "HIGH" if "urgent" in description.lower() or "immediately" in description.lower() else "MEDIUM",
        "customer_mood": "FRUSTRATED" if "refund" in description.lower() or "wrong" in description.lower() else "NEUTRAL",
        "mood_confidence": 0.88,
        "patience_score": "CRITICAL" if "immediately" in description.lower() else "CONCERNED",
        "predicted_resolution_time": "1-2 business days",
        "overall_confidence": 0.90,
        "checklist": [
            "Verify customer account & subscription status",
            "Review system backend logs for transaction anomalies",
            "Send polite confirmation response with resolution steps"
        ],
        "suggested_reply": f"Hello, thank you for reaching out regarding '{title}'. We are investigating your issue right now."
    }

    result = generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=TRIAGE_AND_CATEGORIZATION_ROLE_PROMPT
    )
    return result


def process_timeline_summary(messages: list) -> dict:
    """
    Generates a 5-6 bullet point summary for reopened/reassigned tickets using Incident Historian role.
    """
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

    result = generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=TIMELINE_SUMMARIZER_ROLE_PROMPT
    )
    return result
