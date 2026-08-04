"""
API Router Module: router.py
Lead Engineer: Member 3 (AI Engineer)
Description: FastAPI endpoint definitions for AI Triage, Quality Check, Timeline Summary, and Insights.
"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    TriageRequest, TriageResponse,
    QualityCheckRequest, QualityCheckResponse,
    TimelineSummaryRequest, TimelineSummaryResponse,
    WeeklyInsightsResponse
)
from app.services.triage_service import process_ticket_triage, process_timeline_summary
from app.services.quality_service import evaluate_response_quality
from app.services.insights_service import generate_weekly_learning_insights

router = APIRouter()

@router.post("/ai/triage", response_model=dict)
async def triage_ticket_endpoint(request: TriageRequest):
    """
    Auto-classifies ticket, detects mood/patience score, predicts resolution duration, and generates checklist.
    """
    try:
        data = process_ticket_triage(request.title, request.description)
        return {"success": True, "message": "Triage analysis completed", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/verify-response", response_model=dict)
async def verify_response_endpoint(request: QualityCheckRequest):
    """
    Evaluates pre-send agent response quality and tone against customer ticket.
    """
    try:
        data = evaluate_response_quality(request.ticket_context, request.draft_reply)
        return {"success": True, "message": "Quality evaluation completed", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/summarize-timeline", response_model=dict)
async def summarize_timeline_endpoint(request: TimelineSummaryRequest):
    """
    Generates a 5-6 bullet timeline summary of ticket history.
    """
    try:
        data = process_timeline_summary(request.messages)
        return {"success": True, "message": "Timeline summary generated", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai/insights", response_model=dict)
async def weekly_insights_endpoint():
    """
    Returns weekly organizational learning insights and FAQ suggestions.
    """
    try:
        data = generate_weekly_learning_insights()
        return {"success": True, "message": "Weekly insights generated", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
