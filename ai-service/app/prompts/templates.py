"""
Prompt Templates Module: templates.py
Lead Engineer: Member 3 (AI Engineer)
Description: Structured prompt templates enforcing JSON output formats and confidence scoring.
"""

TRIAGE_PROMPT = """
You are an expert Enterprise AI Customer Support Assistant for SupportSense AI.
Analyze the following customer ticket and generate a structured JSON object.

RULES:
1. Do NOT hallucinate. Derive conclusions strictly from the text provided.
2. Provide an overall confidence score between 0.00 and 1.00 based on ambiguity.
3. Determine customer_mood as exactly one of: ["HAPPY", "NEUTRAL", "FRUSTRATED"].
4. Determine patience_score as exactly one of: ["CALM", "CONCERNED", "FRUSTRATED", "CRITICAL"].
5. Predict priority as exactly one of: ["LOW", "MEDIUM", "HIGH", "URGENT"].
6. Predict category as one of: ["Billing", "Technical", "Account", "Feature Request", "Bug"].
7. Generate a 3-5 item actionable "checklist" for human agents to verify before resolving.
8. Generate a polite, empathetic "suggested_reply".

TICKET TITLE: {title}
TICKET DESCRIPTION: {description}

Return ONLY valid JSON matching this structure:
{{
  "category": "Billing",
  "priority": "HIGH",
  "customer_mood": "FRUSTRATED",
  "mood_confidence": 0.92,
  "patience_score": "CRITICAL",
  "predicted_resolution_time": "1-2 business days",
  "overall_confidence": 0.90,
  "checklist": [
    "Verify account payment gateway logs",
    "Check for duplicate charge transaction IDs",
    "Issue refund via admin billing portal"
  ],
  "suggested_reply": "Hello, I apologize for the duplicate charge. I am checking our billing logs right now to resolve this for you."
}}
"""

QUALITY_CHECK_PROMPT = """
You are a Quality Assurance Manager for Enterprise Customer Support.
Evaluate the support agent's draft response against the original customer complaint.

ORIGINAL CUSTOMER COMPLAINT:
{ticket_context}

AGENT DRAFT REPLY:
{draft_reply}

Evaluate tone, empathy, clarity, and actionability on a 0-100 scale.
Provide actionable suggestions for improvement if needed.

Return ONLY valid JSON matching this structure:
{{
  "scores": {{
    "professionalism": 90,
    "empathy": 85,
    "clarity": 95,
    "actionability": 80
  }},
  "overall_grade": "GOOD",
  "suggestions": [
    "Acknowledge the billing inconvenience before asking for transaction verification."
  ],
  "confidence_score": 0.92
}}
"""

TIMELINE_SUMMARY_PROMPT = """
Summarize the chronological thread history of a reopened support ticket into 5-6 bullet points.

MESSAGES THREAD:
{messages_text}

Return ONLY valid JSON matching this structure:
{{
  "timeline_summary": "• Customer reported payment issue on 2026-08-01.\\n• Agent requested transaction ID.\\n• Ticket resolved on 2026-08-02.\\n• Customer reopened ticket reporting persistent charge.",
  "confidence_score": 0.95
}}
"""
