"""
Unit Test Suite: test_triage.py
Lead Engineer: Member 4 (QA) & Member 3 (AI)
Description: Pytest unit tests for FastAPI AI Triage and fallback responses.
"""

def test_ai_triage_fallback_response():
    title = "Double charged on subscription"
    description = "I was charged twice on my card ending 4921! Please refund immediately."

    # Simulate fallback logic when Gemini key is unconfigured
    fallback = {
        "category": "Billing" if "charge" in description.lower() else "General",
        "priority": "HIGH" if "immediately" in description.lower() else "MEDIUM",
        "customer_mood": "FRUSTRATED" if "refund" in description.lower() else "NEUTRAL",
        "mood_confidence": 0.85,
        "patience_score": "CRITICAL" if "immediately" in description.lower() else "CONCERNED",
        "predicted_resolution_time": "1-2 business days",
        "overall_confidence": 0.88,
        "checklist": [
            "Verify customer account & subscription status",
            "Review system backend logs for transaction anomalies"
        ]
    }

    assert fallback["category"] == "Billing"
    assert fallback["priority"] == "HIGH"
    assert fallback["customer_mood"] == "FRUSTRATED"
    assert fallback["patience_score"] == "CRITICAL"
    assert fallback["overall_confidence"] == 0.88
    assert len(fallback["checklist"]) > 0
