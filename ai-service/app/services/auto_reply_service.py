"""
Service Module: auto_reply_service.py
Lead Engineer: AI & Automation Specialist
Description: Evaluates and generates department-specific automated ticket replies based on
             department policies, category eligibility, and historical resolution benchmarks.
             Supports async non-blocking and sync execution with max output token bounds.
"""

import logging
from typing import Dict, Any, Optional
from app.core.gemini_client import generate_json_response, generate_json_response_async
from app.prompts.templates import DEPARTMENT_AUTO_REPLY_ROLE_PROMPT
from app.services.dataset_service import get_department_definitions

logger = logging.getLogger("ai_service")

def _build_auto_reply_context(
    title: str,
    description: str,
    category: Optional[str] = None,
    department_name: Optional[str] = None
):
    dept_defs = get_department_definitions()
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
    return prompt, fallback


async def evaluate_department_auto_reply_async(
    title: str,
    description: str,
    category: Optional[str] = None,
    department_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Asynchronously evaluates department auto-reply with 384 token ceiling.
    """
    prompt, fallback = _build_auto_reply_context(title, description, category, department_name)
    return await generate_json_response_async(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=DEPARTMENT_AUTO_REPLY_ROLE_PROMPT,
        max_output_tokens=384,
        temperature=0.1
    )


def evaluate_department_auto_reply(
    title: str,
    description: str,
    category: Optional[str] = None,
    department_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Synchronously evaluates department auto-reply for testing and sync callers.
    """
    prompt, fallback = _build_auto_reply_context(title, description, category, department_name)
    return generate_json_response(
        prompt_text=prompt,
        fallback_payload=fallback,
        system_instruction=DEPARTMENT_AUTO_REPLY_ROLE_PROMPT,
        max_output_tokens=384,
        temperature=0.1
    )

