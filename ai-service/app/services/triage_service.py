"""
Service Module: triage_service.py
Lead Engineer: Member 3 (AI Engineer)
Description: Performs ticket classification, sentiment/mood detection, and checklist generation.
"""

from app.core.gemini_client import generate_json_response
from app.prompts.templates import TRIAGE_PROMPT, TIMELINE_SUMMARY_PROMPT
from app.models.schemas import TriageResponse, TimelineSummaryResponse

def process_ticket_triage(title: str, description: str) -> dict:
    """
    Analyzes ticket title & description, returning category, mood, patience score, and checklist.
    """
    prompt = TRIAGE_PROMPT.format(title=title, description=description)
    
    fallback = {
        "category": "Billing" if "charge" in description.lower() or "billing" in description.lower() else "General",
        "priority": "HIGH" if "urgent" in description.lower() or "immediately" in description.lower() else "MEDIUM",
        "customer_mood": "FRUSTRATED" if "refund" in description.lower() or "wrong" in description.lower() else "NEUTRAL",
        "mood_confidence": 0.85,
        "patience_score": "CRITICAL" if "immediately" in description.lower() else "CONCERNED",
        "predicted_resolution_time": "1-2 business days",
        "overall_confidence": 0.88,
        "checklist": [
            "Verify customer account & subscription status",
            "Review system backend logs for transaction anomalies",
            "Send polite confirmation response with resolution steps"
        ],
        "suggested_reply": f"Hello, thank you for reaching out regarding '{title}'. We are investigating your issue right now."
    }

    result = generate_json_response(prompt, fallback)
    return result

def process_timeline_summary(messages: list) -> dict:
    """
    Generates a 5-6 bullet point summary for reopened/reassigned tickets.
    """
    formatted_messages = []
    for idx, msg in enumerate(messages, start=1):
        role = getattr(msg, 'sender_role', 'USER')
        name = getattr(msg, 'sender_name', 'Customer')
        body = getattr(msg, 'message_body', '')
        formatted_messages.append(f"{idx}. [{role} - {name}]: {body}")

    messages_text = "\n".join(formatted_messages)
    prompt = TIMELINE_SUMMARY_PROMPT.format(messages_text=messages_text)

    bullets = [f"• {msg}" for msg in formatted_messages[:6]]
    fallback = {
        "timeline_summary": "\n".join(bullets) if bullets else "• Ticket history initialized.",
        "confidence_score": 0.90
    }

    result = generate_json_response(prompt, fallback)
    return result
