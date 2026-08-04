/**
 * Controller: ticketController.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Manages support tickets lifecycle, threaded messages, and checklist toggles.
 */

const ticketModel = require('../models/ticketModel');
const aiMetadataModel = require('../models/aiMetadataModel');
const aiService = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

/**
 * Create a new ticket & trigger asynchronous AI Triage.
 * POST /api/v1/tickets
 */
async function createTicket(req, res, next) {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return sendError(res, 400, 'Ticket title and description are required.');
    }

    // 1. Create ticket record in database
    const newTicket = await ticketModel.createTicket({
      customerId: req.user.id,
      title,
      description,
      category,
      priority
    });

    // 2. Also insert initial customer message into thread
    await ticketModel.createMessage({
      ticketId: newTicket.id,
      senderId: req.user.id,
      messageBody: description,
      isInternalNote: false
    });

    // 3. Trigger AI Triage microservice
    const aiResult = await aiService.performAITriage(title, description);

    // 4. Save AI decision metadata & generated checklist items
    const aiMetadata = await aiMetadataModel.saveAIMetadata({
      ticketId: newTicket.id,
      customerMood: aiResult.customer_mood,
      moodConfidence: aiResult.mood_confidence,
      patienceScore: aiResult.patience_score,
      predictedResolutionTime: aiResult.predicted_resolution_time,
      overallConfidence: aiResult.overall_confidence
    });

    const checklistItems = await aiMetadataModel.saveAgentChecklist(
      newTicket.id,
      aiResult.checklist || []
    );

    newTicket.ai_metadata = aiMetadata;
    newTicket.checklists = checklistItems;

    return sendSuccess(res, 201, 'Ticket created successfully with AI decision support.', newTicket);
  } catch (error) {
    next(error);
  }
}

/**
 * List all tickets with optional filtering.
 * GET /api/v1/tickets
 */
async function getTickets(req, res, next) {
  try {
    const { status, priority, search } = req.query;

    const tickets = await ticketModel.getAllTickets({
      status,
      priority,
      search,
      userRole: req.user.role,
      userId: req.user.id
    });

    return sendSuccess(res, 200, 'Tickets retrieved successfully', tickets);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetch detailed ticket record by ID.
 * GET /api/v1/tickets/:id
 */
async function getTicketById(req, res, next) {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketModel.getTicketById(ticketId);

    if (!ticket) {
      return sendError(res, 404, 'Ticket not found.');
    }

    // Role Security Check: Customers can only view their own tickets
    if (req.user.role === 'CUSTOMER' && ticket.customer_id !== req.user.id) {
      return sendError(res, 403, 'Forbidden. You are not authorized to view this ticket.');
    }

    return sendSuccess(res, 200, 'Ticket details retrieved', ticket);
  } catch (error) {
    next(error);
  }
}

/**
 * Update ticket status or assigned agent. Reopening triggers AI summary update.
 * PATCH /api/v1/tickets/:id/status
 */
async function updateStatus(req, res, next) {
  try {
    const ticketId = req.params.id;
    const { status, assignedAgentId } = req.body;

    const currentTicket = await ticketModel.getTicketById(ticketId);
    if (!currentTicket) {
      return sendError(res, 404, 'Ticket not found.');
    }

    const updatedTicket = await ticketModel.updateTicketStatus(ticketId, {
      status,
      assignedAgentId
    });

    // If ticket is being REOPENED or reassigned, generate AI timeline summary
    if (status === 'OPEN' && currentTicket.status === 'RESOLVED') {
      const summaryText = await aiService.summarizeTimeline(currentTicket.messages);
      await aiMetadataModel.updateTimelineSummary(ticketId, summaryText);
    }

    return sendSuccess(res, 200, 'Ticket status updated successfully', updatedTicket);
  } catch (error) {
    next(error);
  }
}

/**
 * Post message or internal note to ticket thread.
 * POST /api/v1/tickets/:id/messages
 */
async function postMessage(req, res, next) {
  try {
    const ticketId = req.params.id;
    const { messageBody, isInternalNote } = req.body;

    if (!messageBody) {
      return sendError(res, 400, 'Message body cannot be empty.');
    }

    // Customers cannot create internal agent-only notes
    const isInternal = req.user.role === 'CUSTOMER' ? false : (isInternalNote || false);

    const newMessage = await ticketModel.createMessage({
      ticketId,
      senderId: req.user.id,
      messageBody,
      isInternalNote: isInternal
    });

    return sendSuccess(res, 201, 'Message posted to thread', newMessage);
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle agent checklist item state.
 * PATCH /api/v1/tickets/:id/checklist/:itemId
 */
async function toggleChecklist(req, res, next) {
  try {
    const { itemId } = req.params;
    const { isCompleted } = req.body;

    const updatedItem = await ticketModel.toggleChecklistItem(itemId, isCompleted);
    if (!updatedItem) {
      return sendError(res, 404, 'Checklist item not found.');
    }

    return sendSuccess(res, 200, 'Checklist item updated', updatedItem);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateStatus,
  postMessage,
  toggleChecklist
};
