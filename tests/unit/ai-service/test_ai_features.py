"""
Unit Test Suite: test_ai_features.py
Lead Engineer: QA & AI Team
Description: Pytest tests for role-based AI services, dataset metrics, HuggingFace streaming, and auto-replies.
"""

import sys
import os

# Add ai-service to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ai-service")))

from app.services.dataset_service import (
    get_dataset_benchmark_metrics,
    load_local_kaggle_tickets,
    get_department_definitions,
    stream_huggingface_dataset
)
from app.services.auto_reply_service import evaluate_department_auto_reply
from app.services.triage_service import process_ticket_triage, process_timeline_summary
from app.services.quality_service import evaluate_response_quality
from app.services.insights_service import generate_weekly_learning_insights


def test_kaggle_dataset_loading_and_benchmarks():
    tickets = load_local_kaggle_tickets(limit=10)
    assert isinstance(tickets, list)
    assert len(tickets) > 0
    assert "category" in tickets[0]
    assert "priority" in tickets[0]

    metrics = get_dataset_benchmark_metrics()
    assert "Billing" in metrics
    assert "Technical" in metrics
    assert "avg_resolution" in metrics["Billing"]


def test_department_auto_reply_evaluation():
    # Test Billing auto-reply
    res_billing = evaluate_department_auto_reply(
        title="Duplicate invoice payment",
        description="I was charged twice on invoice INV-9021. Please issue refund.",
        category="Billing"
    )
    assert res_billing["should_auto_reply"] is True
    assert res_billing["target_department"] == "Finance & Billing"
    assert len(res_billing["automated_reply_body"]) > 0
    assert "actions_triggered" in res_billing

    # Test Tech Support auto-reply
    res_tech = evaluate_department_auto_reply(
        title="API 500 error on checkout webhook",
        description="Our checkout webhook is failing with 500 internal server error.",
        category="Technical"
    )
    assert res_tech["should_auto_reply"] is True
    assert res_tech["target_department"] in ["Technical Support", "API Platform Team"]


def test_triage_with_role_prompt():
    triage = process_ticket_triage(
        title="Urgent SSO login failure",
        description="None of our enterprise users can log in via Okta SAML immediately."
    )
    assert "category" in triage
    assert "priority" in triage
    assert "checklist" in triage
    assert len(triage["checklist"]) > 0
    assert "suggested_reply" in triage


def test_quality_and_insights_services():
    quality = evaluate_response_quality(
        ticket_context="My account is locked out.",
        draft_reply="Hello, I have unlocked your account and sent a reset token."
    )
    assert "scores" in quality
    assert quality["overall_grade"] in ["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT"]

    insights = generate_weekly_learning_insights("2026-W34")
    assert insights["week_identifier"] == "2026-W34"
    assert len(insights["top_issues"]) > 0
    assert len(insights["recommended_faqs"]) > 0
