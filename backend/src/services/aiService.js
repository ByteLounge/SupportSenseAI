/**
 * Service: aiService.js
 * Lead Engineer: Member 2 & Member 3
 * Description: HTTP client interacting with Python FastAPI AI microservice (Gemini wrapper).
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
      body: JSON.stringify({ title, description })
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
      ]
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
      body: JSON.stringify({ ticket_context: ticketContext, draft_reply: draftReply })
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
      body: JSON.stringify({ messages: messagesHistory })
    });

    if (!response.ok) {
      throw new Error(`AI Service returned HTTP status ${response.status}`);
    }

    const json = await response.json();
    return json.data.timeline_summary;
  } catch (error) {
    logger.error('Failed to summarize timeline:', error.message);
    return '• Ticket history summary currently unavailable. Please review thread messages.';
  }
}

module.exports = {
  performAITriage,
  verifyResponseQuality,
  summarizeTimeline
};
