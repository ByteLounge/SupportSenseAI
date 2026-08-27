"""
API Router Module: router.py
Lead Engineer: Member 3 (AI Engineer)
Description: FastAPI endpoint definitions for AI Triage, Quality Check, Timeline Summary,
             Department Auto-Reply, and Dataset Streaming.
"""

from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    TriageRequest,
    QualityCheckRequest,
    TimelineSummaryRequest,
    WeeklyInsightsResponse,
    DepartmentAutoReplyRequest
)
from app.services.triage_service import (
    process_ticket_triage,
    process_ticket_triage_async,
    process_timeline_summary,
    process_timeline_summary_async
)
from app.services.quality_service import (
    evaluate_response_quality,
    evaluate_response_quality_async
)
from app.services.insights_service import (
    generate_weekly_learning_insights,
    generate_weekly_learning_insights_async
)
from app.services.auto_reply_service import (
    evaluate_department_auto_reply,
    evaluate_department_auto_reply_async
)
from app.services.dataset_service import (
    get_dataset_benchmark_metrics,
    stream_huggingface_dataset,
    get_department_definitions,
    load_local_kaggle_tickets
)

router = APIRouter()

@router.post("/ai/triage", response_model=dict)
async def triage_ticket_endpoint(request: TriageRequest):
    """
    Auto-classifies ticket, detects mood/patience score, predicts resolution duration, and generates checklist.
    Non-blocking async execution.
    """
    try:
        data = await process_ticket_triage_async(request.title, request.description)
        return {"success": True, "message": "Triage analysis completed", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/department-auto-reply", response_model=dict)
async def department_auto_reply_endpoint(request: DepartmentAutoReplyRequest):
    """
    Evaluates whether a ticket qualifies for automated department reply and generates the response.
    """
    try:
        data = await evaluate_department_auto_reply_async(
            title=request.title,
            description=request.description,
            category=request.category,
            department_name=request.department_name
        )
        return {"success": True, "message": "Department auto-reply evaluated", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/verify-response", response_model=dict)
async def verify_response_endpoint(request: QualityCheckRequest):
    """
    Evaluates pre-send agent response quality and tone against customer ticket.
    """
    try:
        data = await evaluate_response_quality_async(request.ticket_context, request.draft_reply)
        return {"success": True, "message": "Quality evaluation completed", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai/summarize-timeline", response_model=dict)
async def summarize_timeline_endpoint(request: TimelineSummaryRequest):
    """
    Generates a 5-6 bullet timeline summary of ticket history.
    """
    try:
        data = await process_timeline_summary_async(request.messages)
        return {"success": True, "message": "Timeline summary generated", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai/insights", response_model=dict)
async def weekly_insights_endpoint():
    """
    Returns weekly organizational learning insights and FAQ suggestions.
    """
    try:
        data = await generate_weekly_learning_insights_async()
        return {"success": True, "message": "Weekly insights generated", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ai/datasets/benchmark-metrics", response_model=dict)
async def dataset_benchmarks_endpoint():
    """
    Returns benchmark resolution metrics derived from Kaggle & Hugging Face datasets.
    """
    try:
        metrics = get_dataset_benchmark_metrics()
        return {"success": True, "message": "Dataset benchmarks retrieved", "data": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai/datasets/stream-sample", response_model=dict)
async def stream_sample_endpoint(
    dataset_name: str = Query("bitext/Bitext-customer-support-llm-chatbot-training-dataset"),
    limit: int = Query(5, ge=1, le=50)
):
    """
    Streams live sample records from Hugging Face dataset.
    """
    try:
        samples = stream_huggingface_dataset(dataset_name=dataset_name, limit=limit)
        return {"success": True, "message": f"Streamed {len(samples)} records from {dataset_name}", "data": samples}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai/departments/definitions", response_model=dict)
async def department_definitions_endpoint():
    """
    Returns configured support departments, categories, and auto-reply policies.
    """
    try:
        depts = get_department_definitions()
        return {"success": True, "message": "Department definitions retrieved", "data": depts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
