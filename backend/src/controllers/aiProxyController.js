/**
 * Controller: aiProxyController.js
 * Lead Engineer: Member 2 & Member 3
 * Description: Controller handling AI decision assistance routes (Quality check, Insights).
 */

const aiService = require('../services/aiService');
const aiMetadataModel = require('../models/aiMetadataModel');
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

module.exports = {
  verifyResponse,
  getWeeklyInsights
};
