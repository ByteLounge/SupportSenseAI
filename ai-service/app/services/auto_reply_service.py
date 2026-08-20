"""
Service Module: auto_reply_service.py
Lead Engineer: AI & Automation Specialist
Description: Evaluates and generates department-specific automated ticket replies based on
             department policies, category eligibility, and historical resolution benchmarks.
"""

import logging
from typing import Dict, Any, Optional
from app.core.gemini_client import generate_json_response
from app.prompts.templates import DEPARTMENT_AUTO_REPLY_ROLE_PROMPT
from app.services.dataset_service import (
    get_department_definitions,
    get_dataset_benchmark_metrics,
    get_few_shot_examples_for_category
)

logger = logging.getLogger("ai_service")


def evaluate_department_auto_reply(
    title: str,
    description: str,
    category: Optional[str] = None,
    department_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Evaluates whether an incoming ticket qualifies for automated response by a specific department.
    If qualified, produces an empathetic, authoritative auto-reply and automated actions.
    """
    dept_defs = get_department_definitions()

    # Determine matched department based on category if not explicitly specified
    inferred_category = category or ("Billing" if "bill" in (title + " " + description).lower() or "charge" in (title + " " + description).lower() else "Technical")
    
    target_dept = department_name
    if not target_dept:
        for dept, config in dept_defs.items():
            if any(cat.lower() in inferred_category.lower() for cat in config["categories"]):
                target_dept = dept
                break
        if not target_dept:
            target_dept = "Technical Support"

    dept_config = dept_defs.get(target_dept, dept_defs["Technical Support"])
    allowed_cats = ", ".join(dept_config["categories"])

    prompt = DEPARTMENT_AUTO_REPLY_ROLE_PROMPT.format(
        department_name=target_dept,
        allowed_categories=allowed_cats,
        auto_reply_enabled=dept_config["auto_reply_enabled"],
        min_confidence=dept_config["min_confidence"],
        title=title,
        description=description,
        category=inferred_category
    )

    fallback = {
        "should_auto_reply": dept_config["auto_reply_enabled"],
        "target_department": target_dept,
        "confidence_score": 0.88,
        "automated_reply_body": dept_config["auto_reply_template"],
        "actions_triggered": dept_config["allowed_actions"][:2],
        "requires_human_escalation": False,
        "reasoning": f"Automated confirmation dispatched by {target_dept} based on category '{inferred_category}' rules."
    }

    result = generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=DEPARTMENT_AUTO_REPLY_ROLE_PROMPT
    )

    return result
