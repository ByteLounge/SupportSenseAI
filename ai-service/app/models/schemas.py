"""
Pydantic Schemas Module: schemas.py
Lead Engineer: Member 3 (AI Engineer)
Description: Input and Output JSON schemas enforcing strict field types, confidence scores,
             and department automated response payload structures.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

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
# 2. DEPARTMENT AUTO-REPLY SCHEMAS
# ----------------------------------------------------------------------------
class DepartmentAutoReplyRequest(BaseModel):
    title: str = Field(..., description="Ticket title")
    description: str = Field(..., description="Ticket description")
    category: Optional[str] = Field(None, description="Assigned category if already triaged")
    department_name: Optional[str] = Field(None, description="Department name, e.g. Finance & Billing, Technical Support")

class DepartmentAutoReplyResponse(BaseModel):
    should_auto_reply: bool = Field(..., description="Whether auto-reply should be dispatched")
    target_department: str = Field(..., description="Assigned department")
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    automated_reply_body: str = Field(..., description="Generated automated response text")
    actions_triggered: List[str] = Field(default=[], description="Automated diagnostics / ledger tasks triggered")
    requires_human_escalation: bool = Field(default=False)
    reasoning: Optional[str] = None

# ----------------------------------------------------------------------------
# 3. RESPONSE QUALITY CHECK SCHEMAS
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
# 4. REOPENED TIMELINE SUMMARY SCHEMAS
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
# 5. WEEKLY LEARNING INSIGHTS SCHEMAS
# ----------------------------------------------------------------------------
class WeeklyInsightsResponse(BaseModel):
    week_identifier: str
    top_issues: List[Dict[str, str]]
    common_mistakes: List[Dict[str, str]]
    knowledge_gaps: List[Dict[str, str]]
    recommended_faqs: List[Dict[str, str]]
    confidence_score: float = Field(..., ge=0.0, le=1.0)

# ----------------------------------------------------------------------------
# 6. AI CONCIERGE & CHATBOT SCHEMAS
# ----------------------------------------------------------------------------
class ConciergeHistoryMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text")

class ConciergeChatRequest(BaseModel):
    message: str = Field(..., description="User's query in natural / simple language")
    history: Optional[List[ConciergeHistoryMessage]] = Field(default=[], description="Previous conversation turns")
    customer_name: Optional[str] = Field(default=None, description="Customer full name")
    customer_email: Optional[str] = Field(default=None, description="Customer email address")

class FormalTicketDraft(BaseModel):
    title: str = Field(..., description="Structured, professional enterprise title")
    category: str = Field(..., description="Billing, Technical, Account, Feature Request, Bug, Security, or General")
    priority: str = Field(..., description="LOW, MEDIUM, HIGH, or URGENT")
    target_department: str = Field(..., description="Target department for ticket dispatch")
    executive_summary: str = Field(..., description="1-2 sentence executive overview")
    formal_description: str = Field(..., description="Markdown-formatted formal enterprise problem specification")
    checklist: List[str] = Field(default=[], description="Actionable verification checkboxes for support team")
    customer_mood: str = Field(default="NEUTRAL", description="HAPPY, NEUTRAL, or FRUSTRATED")
    patience_score: str = Field(default="CALM", description="CALM, CONCERNED, FRUSTRATED, or CRITICAL")
    predicted_resolution_time: str = Field(default="1-2 business days")
    urgency_reasoning: Optional[str] = None
    is_ready_for_ticket: bool = Field(default=True, description="Whether inquiry has enough info to create ticket")

class ConciergeChatResponse(BaseModel):
    reply: str = Field(..., description="Conversational assistant reply to user")
    ticket_draft: Optional[FormalTicketDraft] = Field(default=None, description="Synthesized formal ticket draft")
    suggested_quick_actions: List[str] = Field(default=[], description="Follow-up quick reply suggestions")
    confidence_score: float = Field(default=0.92, ge=0.0, le=1.0)

# ----------------------------------------------------------------------------
# 7. AI TONE POLISHER SCHEMAS
# ----------------------------------------------------------------------------
class TonePolishRequest(BaseModel):
    draft: str = Field(..., description="Original draft response text")
    tone: str = Field(default="empathetic", description="Desired tone: empathetic, concise, formal, or technical")
    variation: int = Field(default=1, description="Variation index for rephrasing variety")

class TonePolishResponse(BaseModel):
    polished_text: str = Field(..., description="Polished response text")
    tone: str = Field(..., description="Target tone applied")
    variation: int = Field(default=1, description="Variation index applied")
    rationale: str = Field(..., description="Brief explanation of adjustments made")
    confidence_score: float = Field(default=0.95, ge=0.0, le=1.0)

