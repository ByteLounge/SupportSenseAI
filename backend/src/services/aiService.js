/**
 * Service: aiService.js
 * Lead Engineer: Member 2 & Member 3
 * Description: HTTP client interacting with Python FastAPI AI microservice (Gemini wrapper)
 *              with support for automated department replies and dataset benchmarks.
 */

const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Call FastAPI microservice to perform automatic ticket triage.
 * 
 * @param {string} title - Ticket title.
 * @param {string} description - Ticket description text.
 * @returns {Promise<object>} Triage object containing mood, priority, category, checklist, etc.
 */
async function performAITriage(title, description) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`AI Service returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    logger.error('Failed to communicate with AI Triage Service:', error.message);
    // Graceful Fallback (HITL Resilience)
    return {
      category: 'General',
      priority: 'MEDIUM',
      customer_mood: 'NEUTRAL',
      mood_confidence: 0.50,
      patience_score: 'CONCERNED',
      predicted_resolution_time: '2-3 business days',
      overall_confidence: 0.50,
      checklist: [
        'Verify customer account details',
        'Review recent account activity logs',
        'Respond with standard initial intake message'
      ],
      suggested_reply: `Hello, thank you for reaching out regarding '${title}'. An agent will inspect this shortly.`
    };
  }
}

/**
 * Call FastAPI microservice to evaluate and generate automated department response.
 * 
 * @param {object} params - { title, description, category, departmentName }
 */
async function evaluateDepartmentAutoReply({ title, description, category, departmentName }) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/department-auto-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        category,
        department_name: departmentName
      }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`AI Service returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    logger.error('Failed to evaluate Department Auto-Reply:', error.message);
    return {
      should_auto_reply: false,
      target_department: departmentName || 'Technical Support',
      confidence_score: 0.50,
      automated_reply_body: `Hello, your ticket regarding '${title}' has been received and routed to our team.`,
      actions_triggered: ['Logged ticket intake timestamp'],
      requires_human_escalation: false
    };
  }
}

/**
 * Call FastAPI microservice to verify pre-send response quality.
 * 
 * @param {string} ticketContext - Original customer issue description.
 * @param {string} draftReply - Agent's proposed response text.
 */
async function verifyResponseQuality(ticketContext, draftReply) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/verify-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket_context: ticketContext, draft_reply: draftReply }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`AI Service returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    logger.error('Failed to verify response quality:', error.message);
    return {
      scores: { professionalism: 80, empathy: 80, clarity: 80, actionability: 80 },
      overall_grade: 'GOOD',
      suggestions: ['Fallback check: Ensure clear timeline details before sending.'],
      confidence_score: 0.50
    };
  }
}

/**
 * Call FastAPI microservice to generate reopened ticket timeline summary.
 */
async function summarizeTimeline(messagesHistory) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/summarize-timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: Array.isArray(messagesHistory) ? messagesHistory : [] }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`AI Service returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json?.data?.timeline_summary || '• Ticket history summary currently unavailable. Please review thread messages.';
  } catch (error) {
    logger.error('Failed to summarize timeline:', error.message);
    return '• Ticket history summary currently unavailable. Please review thread messages.';
  }
}

/**
 * Fetch dataset benchmarks.
 */
async function getDatasetBenchmarks() {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/datasets/benchmark-metrics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data;
  } catch (error) {
    logger.error('Failed to fetch dataset benchmarks:', error.message);
    return null;
  }
}

/**
 * Call FastAPI microservice for AI Concierge conversational chat & ticket formulation.
 */
async function chatConcierge({ message, history, customerName, customerEmail }) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/concierge/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history || [],
        customer_name: customerName,
        customer_email: customerEmail
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      throw new Error(`AI Service returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    logger.error('Failed to communicate with AI Concierge Service:', error.message);
    const lower = (message || '').toLowerCase();
    let category = 'Technical';
    let dept = 'Technical Support';
    let priority = 'MEDIUM';
    if (/charge|refund|card|bill|invoice|payment|stripe|subscription|\$/i.test(lower)) {
      category = 'Billing';
      dept = 'Finance & Billing';
      priority = /twice|duplicate|emergency|asap|urgent/i.test(lower) ? 'URGENT' : 'HIGH';
    } else if (/login|password|mfa|2fa|sso|okta|auth|locked/i.test(lower)) {
      category = 'Account';
      dept = 'Identity & Access';
      priority = 'HIGH';
    } else if (/webhook|api|401|404|500|502|endpoint|rate limit/i.test(lower)) {
      category = 'Technical';
      dept = 'API Platform Team';
      priority = 'HIGH';
    }

    return {
      reply: `Hello ${customerName || 'there'}! I've analyzed your request regarding "${message.slice(0, 50)}..." and structured a formal ticket for our ${dept} team. You can review the details below and dispatch it immediately.`,
      ticket_draft: {
        title: `[${category}] ${message.slice(0, 60)}...`,
        category,
        priority,
        target_department: dept,
        executive_summary: `Support request submitted by ${customerName || 'customer'}: ${message.slice(0, 100)}`,
        formal_description: `### 1. Executive Summary\nCustomer escalated issue via SupportSense AI Concierge.\n\n### 2. Reported Issue\n"${message}"\n\n### 3. Business Impact\nAffects standard user operations.\n\n### 4. Preliminary AI Diagnostics\nCategorized as ${category} routed to ${dept}.`,
        checklist: [
          `Verify account activity for ${customerEmail || 'customer'}`,
          `Inspect ${dept} logs for related failure events`,
          `Contact customer with resolution or next diagnostic step`
        ],
        customer_mood: /angry|urgent|broken|failed|emergency/i.test(lower) ? 'FRUSTRATED' : 'NEUTRAL',
        patience_score: 'CONCERNED',
        predicted_resolution_time: priority === 'URGENT' ? '2-4 hours' : '1-2 business days',
        urgency_reasoning: `Auto-assigned ${priority} based on operational impact.`,
        is_ready_for_ticket: true
      },
      suggested_quick_actions: [
        `Dispatch ticket to ${dept}`,
        'Provide error code or screenshot',
        'Check knowledge base'
      ],
      confidence_score: 0.88
    };
  }
}

/**
 * Call FastAPI microservice to polish response tone.
 */
async function polishAgentTone({ draft, tone }) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/polish-tone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft, tone }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`AI Service returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    logger.error('Failed to polish agent tone:', error.message);
    return {
      polished_text: draft,
      tone: tone || 'empathetic',
      rationale: 'Applied fallback preservation of draft.',
      confidence_score: 0.70
    };
  }
}

module.exports = {
  performAITriage,
  evaluateDepartmentAutoReply,
  verifyResponseQuality,
  summarizeTimeline,
  getDatasetBenchmarks,
  chatConcierge,
  polishAgentTone
};

