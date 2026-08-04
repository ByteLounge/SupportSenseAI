"""
Pydantic Schemas Module: schemas.py
Lead Engineer: Member 3 (AI Engineer)
Description: Input and Output JSON schemas enforcing strict field types and confidence scores.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict

# ----------------------------------------------------------------------------
# 1. TICKET TRIAGE SCHEMAS
# ----------------------------------------------------------------------------
class TriageRequest(BaseModel):
    title: str = Field(..., description="Ticket headline / subject line")
    description: str = Field(..., description="Customer message body")

class TriageResponse(BaseModel):
    category: str = Field(..., description="Categorized area (Billing, Technical, Account, Feature Request, Bug)")
    priority: str = Field(..., description="Assigned urgency (LOW, MEDIUM, HIGH, URGENT)")
    customer_mood: str = Field(..., description="Detected mood (HAPPY, NEUTRAL, FRUSTRATED)")
    mood_confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence rating for customer mood")
    patience_score: str = Field(..., description="Patience status (CALM, CONCERNED, FRUSTRATED, CRITICAL)")
    predicted_resolution_time: str = Field(..., description="Estimated completion duration, e.g. '1-2 business days'")
    overall_confidence: float = Field(..., ge=0.0, le=1.0, description="Overall AI classification confidence score")
    checklist: List[str] = Field(..., description="Actionable verification checkboxes for support agent")
    suggested_reply: str = Field(..., description="Suggested initial customer response draft")

# ----------------------------------------------------------------------------
# 2. RESPONSE QUALITY CHECK SCHEMAS
# ----------------------------------------------------------------------------
class QualityCheckRequest(BaseModel):
    ticket_context: str = Field(..., description="Original customer ticket description")
    draft_reply: str = Field(..., description="Agent's proposed draft response text")

class QualityScores(BaseModel):
    professionalism: int = Field(..., ge=0, le=100)
    empathy: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    actionability: int = Field(..., ge=0, le=100)

class QualityCheckResponse(BaseModel):
    scores: QualityScores
    overall_grade: str = Field(..., description="EXCELLENT | GOOD | NEEDS_IMPROVEMENT")
    suggestions: List[str] = Field(..., description="Constructive improvement recommendations")
    confidence_score: float = Field(..., ge=0.0, le=1.0)

# ----------------------------------------------------------------------------
# 3. REOPENED TIMELINE SUMMARY SCHEMAS
# ----------------------------------------------------------------------------
class MessageItem(BaseModel):
    sender_name: str
    sender_role: str
    message_body: str
    created_at: str

class TimelineSummaryRequest(BaseModel):
    messages: List[MessageItem]

class TimelineSummaryResponse(BaseModel):
    timeline_summary: str = Field(..., description="5-6 bullet history summary")
    confidence_score: float = Field(..., ge=0.0, le=1.0)

# ----------------------------------------------------------------------------
# 4. WEEKLY LEARNING INSIGHTS SCHEMAS
# ----------------------------------------------------------------------------
class WeeklyInsightsResponse(BaseModel):
    week_identifier: str
    top_issues: List[Dict[str, str]]
    common_mistakes: List[Dict[str, str]]
    knowledge_gaps: List[Dict[str, str]]
    recommended_faqs: List[Dict[str, str]]
    confidence_score: float = Field(..., ge=0.0, le=1.0)
