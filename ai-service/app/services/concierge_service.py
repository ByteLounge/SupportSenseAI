"""
Concierge Service Module: concierge_service.py
Lead Engineer: AI Concierge Architect
Description: Powers the conversational AI Chatbot that listens to user queries in simple words,
             converses naturally, crafts formal enterprise tickets, and provides 1-click tone polishing.
"""

import logging
from typing import List, Optional, Dict, Any
from app.prompts.templates import AI_CONCIERGE_TICKET_CRAFTER_PROMPT, AI_TONE_POLISH_PROMPT
from app.core.gemini_client import generate_json_response_async, generate_json_response
from app.models.schemas import ConciergeHistoryMessage

logger = logging.getLogger("ai_service")

def _format_history(history: Optional[List[Any]]) -> str:
    if not history:
        return "No previous conversation history. This is the first interaction."
    lines = []
    for item in history:
        if isinstance(item, dict):
            role = item.get("role", "user")
            content = item.get("content", "")
        else:
            role = getattr(item, "role", "user")
            content = getattr(item, "content", "")
        lines.append(f"[{role.upper()}]: {content}")
    return "\n".join(lines)


def _generate_heuristic_ticket_draft(
    message: str,
    customer_name: Optional[str] = None,
    customer_email: Optional[str] = None
) -> Dict[str, Any]:
    """
    Intelligent heuristic fallback to formulate enterprise-grade tickets when Gemini is offline.
    """
    lower = message.lower()
    customer_label = customer_name or "Customer"

    # Category and routing heuristics
    if any(k in lower for k in ["charge", "refund", "card", "bill", "invoice", "payment", "stripe", "subscription", "$", "dollar"]):
        category = "Billing"
        dept = "Finance & Billing"
        priority = "URGENT" if any(k in lower for k in ["twice", "duplicate", "locked", "immediately", "asap", "budget", "emergency"]) else "HIGH"
        summary = f"Billing inquiry regarding payment transaction or account charges reported by {customer_label}."
        title = f"[Billing] Payment Discrepancy & Transaction Audit Request - {customer_label}"
        checklist = [
            "Verify transaction ID in payment gateway records (Stripe/Adyen)",
            "Review customer subscription tier and recent renewal invoices",
            "Evaluate duplicate authorization vs settled capture status",
            "Process refund or invoice adjustment if overbilled"
        ]
        diagnostics = "Payment gateway telemetry review indicated. Check settled charges vs temporary authorization holds."
    elif any(k in lower for k in ["login", "password", "mfa", "2fa", "sso", "okta", "saml", "locked out", "credentials", "access"]):
        category = "Account"
        dept = "Identity & Access"
        priority = "HIGH"
        summary = f"Authentication or identity access barrier preventing user access for {customer_label}."
        title = f"[Access] Identity Authentication & MFA Barrier Resolution - {customer_label}"
        checklist = [
            "Verify identity directory status in Okta / Auth0 / Active Directory",
            "Check for consecutive failed password or MFA challenge lockouts",
            "Issue time-bounded secure credential reset link",
            "Confirm user session validation upon re-authentication"
        ]
        diagnostics = "Identity provider lockout or push notification failure. Session audit required."
    elif any(k in lower for k in ["webhook", "api", "401", "403", "404", "500", "502", "504", "endpoint", "rate limit", "token", "header"]):
        category = "Technical"
        dept = "API Platform Team"
        priority = "URGENT" if any(k in lower for k in ["outage", "stopped", "production", "broken", "critical"]) else "HIGH"
        summary = f"API connectivity or webhook ingestion error affecting integration for {customer_label}."
        title = f"[API] Integration Disruption & Endpoint Verification - {customer_label}"
        checklist = [
            "Inspect API Gateway request logs and response status codes",
            "Validate client webhook signing secret and HMAC headers",
            "Check rate limiter token bucket quota for tenant",
            "Re-dispatch undelivered webhook event payloads"
        ]
        diagnostics = "API telemetry indicates authentication or gateway error. Check ingress logs and authorization headers."
    elif any(k in lower for k in ["crash", "bug", "error", "exception", "freeze", "blank", "glitch"]):
        category = "Bug"
        dept = "Technical Support"
        priority = "HIGH"
        summary = f"Software defect or unexpected runtime error reported by {customer_label}."
        title = f"[Bug] Software Runtime Defect & Application Anomaly - {customer_label}"
        checklist = [
            "Gather client browser, OS, and client version metadata",
            "Review frontend Sentry / error tracking logs for matching stack traces",
            "Attempt reproduction in staging environment with client dataset",
            "File engineering bug report with reproduction steps"
        ]
        diagnostics = "Frontend or backend runtime exception. Sentry telemetry cross-reference advised."
    else:
        category = "Technical"
        dept = "Technical Support"
        priority = "MEDIUM"
        summary = f"Support inquiry submitted by {customer_label}."
        title = f"[Support] General Assistance Request - {customer_label}"
        checklist = [
            "Review customer account history and recent activity",
            "Acknowledge receipt and clarify reproduction steps if needed",
            "Route to specialized tier engineer if necessary"
        ]
        diagnostics = "Standard support intake. Initial discovery triage needed."

    formal_desc = f"""### 1. Executive Summary
{summary}

### 2. Customer Statement & Observed Behavior
"{message}"

### 3. Business & Operational Impact
Issue currently prevents optimal user workflow and requires prompt departmental verification.

### 4. Steps to Reproduce / User Journey
1. Customer initiated workflow in SupportSense workspace.
2. Encountered unexpected obstacle or failure state as described above.
3. Escalated to SupportSense AI Concierge for formal resolution.

### 5. Initial AI Diagnostic Assessment
{diagnostics}
"""

    return {
        "reply": f"Hello {customer_name or 'there'}! I understand this is concerning. I have reviewed your inquiry, formulated a formal enterprise ticket for our {dept} team, and pre-configured the diagnostic checklist. You can review the ticket draft below and click 'Dispatch Ticket' to send it immediately.",
        "ticket_draft": {
            "title": title,
            "category": category,
            "priority": priority,
            "target_department": dept,
            "executive_summary": summary,
            "formal_description": formal_desc,
            "checklist": checklist,
            "customer_mood": "FRUSTRATED" if any(w in lower for w in ["angry", "upset", "emergency", "broken", "failed", "asap", "locked"]) else "NEUTRAL",
            "patience_score": "CONCERNED",
            "predicted_resolution_time": "2-4 hours" if priority == "URGENT" else "1-2 business days",
            "urgency_reasoning": f"Derived from reported operational friction in {category.lower()} domain.",
            "is_ready_for_ticket": True
        },
        "suggested_quick_actions": [
            f"Dispatch to {dept}",
            "Add more reproduction details",
            "Check system status page"
        ],
        "confidence_score": 0.92
    }


async def process_concierge_chat_async(
    message: str,
    history: Optional[List[Any]] = None,
    customer_name: Optional[str] = None,
    customer_email: Optional[str] = None
) -> Dict[str, Any]:
    """
    Processes natural language message from customer/agent, engages conversationally,
    and synthesizes an enterprise ticket specification.
    """
    fallback = _generate_heuristic_ticket_draft(message, customer_name, customer_email)

    # If the user input is very short greeting, don't generate formal ticket yet
    cleaned = message.strip().lower()
    if cleaned in ["hi", "hello", "hey", "good morning", "good evening", "help", "anyone there?"]:
        return {
            "reply": f"Hello {customer_name or 'there'}! 👋 Welcome to SupportSense AI. How can I assist you today? You can describe any technical issue, billing discrepancy, or account question in your own words, and I'll immediately investigate and formulate a formal ticket for our team.",
            "ticket_draft": None,
            "suggested_quick_actions": [
                "I was charged twice on my card",
                "Can't log in due to MFA push error",
                "API Webhook returning 401 error",
                "Database queries are running slow"
            ],
            "confidence_score": 0.98
        }

    history_text = _format_history(history)
    prompt = AI_CONCIERGE_TICKET_CRAFTER_PROMPT.format(
        customer_name=customer_name or "Anonymous User",
        customer_email=customer_email or "user@example.com",
        history_text=history_text,
        user_message=message
    )

    try:
        response_data = await generate_json_response_async(
            prompt_text=prompt,
            fallback_payload=fallback,
            max_output_tokens=1024,
            temperature=0.2
        )
        return response_data
    except Exception as e:
        logger.error(f"Error in process_concierge_chat_async: {e}")
        return fallback


async def process_tone_polish_async(draft: str, tone: str = "empathetic", variation: int = 1) -> Dict[str, Any]:
    """
    Rewrites an agent's draft message according to the specified tone style and variation index.
    """
    normalized_tone = tone.lower().strip()
    var_idx = max(1, variation)
    clean_draft = draft.strip()
    
    # Strip any accidental nested greetings if re-polishing
    import re
    cleaned = re.sub(r'^(Hello|Hi|Dear Client|Update on your inquiry|Diagnostic Status Report|Diagnostic Update)[^\n]*\n*', '', clean_draft, flags=re.IGNORECASE).strip()
    base_content = cleaned if cleaned else clean_draft

    # Diverse Fallback heuristic varieties (3 distinct variations per tone)
    if normalized_tone == "empathetic":
        variations_pool = [
            (
                f"Hello, thank you for your patience and for bringing this to our attention. I completely understand how frustrating this disruption is for your workflow. {base_content} Please rest assured we are actively working on this, and I will keep you updated every step of the way.",
                "Added warm, reassuring validation of customer frustration and proactive follow-up commitment (Variation 1: Compassionate & Reassuring)."
            ),
            (
                f"Hi there, thank you for reaching out. We deeply appreciate your partnership and hear your concerns loud and clear. Regarding this matter: {base_content} Our senior engineering team is prioritized on this to ensure your service is restored smoothly.",
                "Focused on active partnership acknowledgment and direct operational advocacy (Variation 2: Proactive Partnership)."
            ),
            (
                f"Greetings! I want to personally apologize for any disruption this issue has caused to your day. Here is where things stand: {base_content} We are tracking this closely and I will follow up with another milestone update shortly.",
                "Direct personal ownership, transparent milestone checkpointing, and sincere empathy (Variation 3: Personal Ownership)."
            )
        ]
    elif normalized_tone == "concise":
        variations_pool = [
            (
                f"Update on your inquiry:\n• Action taken: {base_content}\n• Next steps: Reviewing logs and monitoring system stability.\n• Expected follow-up: Within 2 hours.",
                "Streamlined into clean bullet points with fluff removed and explicit next steps (Variation 1: Bulleted Action Plan)."
            ),
            (
                f"Status: In Progress.\nDetails: {base_content}\nETA: Next update scheduled in under 2 hours.",
                "High-density executive summary minimizing reader cognitive load (Variation 2: Micro Status)."
            ),
            (
                f"Action Item Summary:\n1. Triage: Verified reported incident.\n2. Work in progress: {base_content}\n3. Checkpoint: Direct update will follow once patch is validated.",
                "Numbered chronological milestone layout for instant scanning (Variation 3: Chronological Milestones)."
            )
        ]
    elif normalized_tone == "formal":
        variations_pool = [
            (
                f"Dear Client,\n\nThank you for contacting SupportSense Enterprise Support. Regarding your reported issue: {base_content}\n\nOur engineering and operations teams are actively reviewing the matter under our standard Service Level Agreement. We appreciate your partnership.\n\nSincerely,\nSupportSense Support Directorate",
                "Dignified corporate correspondence adhering to standard SLA governance (Variation 1: Standard Enterprise)."
            ),
            (
                f"Dear Valued Customer,\n\nWe acknowledge receipt of your service request. In alignment with our enterprise support commitments: {base_content}\n\nOur technical operations group has initiated formal incident diagnostics and will furnish an official progress report shortly.\n\nRespectfully,\nSupportSense Enterprise Operations",
                "Executive formal memorandum emphasizing incident diagnostics and client commitment (Variation 2: Formal Operations Memorandum)."
            ),
            (
                f"Official Support Advisory:\n\nPlease be advised that SupportSense Client Solutions has accepted and prioritized your ticket: {base_content}\n\nAll subsequent measures conform strictly to enterprise resolution protocols. We remain dedicated to your success.\n\nSincerely,\nSupportSense Global Support",
                "Authoritative institutional advisory structure suitable for compliance and governance (Variation 3: Institutional Advisory)."
            )
        ]
    elif normalized_tone == "technical":
        variations_pool = [
            (
                f"Diagnostic Update:\n{base_content}\nTelemetry & Stack Trace Status: Verifying endpoint ingress, TLS certificates, and service worker logs. Reproducing under staging environment.",
                "Emphasized precision, diagnostic telemetry, and architectural terminology (Variation 1: Telemetry & Ingress)."
            ),
            (
                f"Engineering Triage Status:\nObserved Behavior: {base_content}\nRoot Cause Investigation: Inspecting API gateway latency percentiles (p95/p99), database connection pool utilization, and replica lag metrics.",
                "Deep systems engineering triage focusing on gateway latency percentiles and database replica synchronization (Variation 2: Systems Architecture)."
            ),
            (
                f"Technical Incident Report:\nContext: {base_content}\nDiagnostic Protocol: Correlating distributed trace spans across microservice mesh, evaluating Redis cache eviction rates, and testing hotfix in container sandbox.",
                "Distributed systems observability format citing trace spans and container sandbox verification (Variation 3: Distributed Observability)."
            )
        ]
    else:
        variations_pool = [(clean_draft, "Original draft maintained.")]

    chosen_variation_tuple = variations_pool[(var_idx - 1) % len(variations_pool)]
    fallback_polished = chosen_variation_tuple[0]
    rationale = chosen_variation_tuple[1]

    fallback_payload = {
        "polished_text": fallback_polished,
        "tone": normalized_tone,
        "variation": var_idx,
        "rationale": rationale,
        "confidence_score": 0.95
    }

    prompt = AI_TONE_POLISH_PROMPT.format(
        target_tone=normalized_tone.upper(),
        variation_number=var_idx,
        original_draft=base_content
    )

    try:
        response_data = await generate_json_response_async(
            prompt_text=prompt,
            fallback_payload=fallback_payload,
            max_output_tokens=512,
            temperature=0.6
        )
        if "variation" not in response_data:
            response_data["variation"] = var_idx
        return response_data
    except Exception as e:
        logger.error(f"Error in process_tone_polish_async: {e}")
        return fallback_payload
