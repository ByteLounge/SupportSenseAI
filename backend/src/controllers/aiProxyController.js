/**
 * Controller: aiProxyController.js
 * Lead Engineer: Member 2 & Member 3
 * Description: Controller handling AI decision assistance routes (Quality check, Insights, Department Auto-Reply, Benchmarks).
 */

const aiService = require('../services/aiService');
const aiMetadataModel = require('../models/aiMetadataModel');
const env = require('../config/env');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

/**
 * Perform pre-send response quality verification on agent draft.
 * POST /api/v1/ai/verify-response
 */
async function verifyResponse(req, res, next) {
  try {
    const { ticketContext, draftReply } = req.body;

    if (!ticketContext || !draftReply) {
      return sendError(res, 400, 'Please provide both ticketContext and draftReply.');
    }

    const verificationResult = await aiService.verifyResponseQuality(ticketContext, draftReply);
    return sendSuccess(res, 200, 'Response quality verified', verificationResult);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch latest weekly organizational learning insights.
 * GET /api/v1/ai/insights
 */
async function getWeeklyInsights(req, res, next) {
  try {
    const insights = await aiMetadataModel.getLatestWeeklyInsights();
    return sendSuccess(res, 200, 'Weekly AI Learning Insights retrieved', insights);
  } catch (error) {
    next(error);
  }
}

/**
 * Evaluate department auto-reply for a given ticket.
 * POST /api/v1/ai/department-auto-reply
 */
async function evaluateAutoReply(req, res, next) {
  try {
    const { title, description, category, departmentName } = req.body;
    if (!title || !description) {
      return sendError(res, 400, 'Title and description are required.');
    }

    const result = await aiService.evaluateDepartmentAutoReply({
      title,
      description,
      category,
      departmentName
    });

    return sendSuccess(res, 200, 'Department auto-reply evaluated successfully', result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get department definitions and active auto-reply rules.
 * GET /api/v1/ai/departments
 */
async function getDepartmentRules(req, res, next) {
  try {
    const response = await fetch(`${env.AI_SERVICE_URL}/api/v1/ai/departments/definitions`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }
    const json = await response.json();
    return sendSuccess(res, 200, 'Department auto-reply rules retrieved', json.data);
  } catch (error) {
    // Return standard fallback definitions
    return sendSuccess(res, 200, 'Department rules retrieved (fallback)', {
      "Finance & Billing": {
        categories: ["Billing", "Refund", "Invoice"],
        auto_reply_enabled: true,
        min_confidence: 0.85,
        target_sla_hours: 4,
        allowed_actions: ["Lookup transaction ID", "Check active subscription status"]
      },
      "Technical Support": {
        categories: ["Technical", "Bug", "Hardware", "Performance"],
        auto_reply_enabled: true,
        min_confidence: 0.80,
        target_sla_hours: 8,
        allowed_actions: ["Check system status health", "Fetch API error logs"]
      },
      "Identity & Access": {
        categories: ["Account", "Login", "SSO", "Password"],
        auto_reply_enabled: true,
        min_confidence: 0.90,
        target_sla_hours: 2,
        allowed_actions: ["Verify registered user email", "Initiate secure reset link"]
      },
      "API Platform Team": {
        categories: ["API Platform", "Rate Limit", "Webhook", "SDK"],
        auto_reply_enabled: true,
        min_confidence: 0.85,
        target_sla_hours: 6,
        allowed_actions: ["Check API Gateway rate limits", "Inspect webhook delivery attempts"]
      }
    });
  }
}

/**
 * Fetch dataset benchmarks.
 * GET /api/v1/ai/benchmarks
 */
async function getBenchmarks(req, res, next) {
  try {
    const benchmarks = await aiService.getDatasetBenchmarks();
    return sendSuccess(res, 200, 'Dataset benchmarks retrieved', benchmarks);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  verifyResponse,
  getWeeklyInsights,
  evaluateAutoReply,
  getDepartmentRules,
  getBenchmarks
};
