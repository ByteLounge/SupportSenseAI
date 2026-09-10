/**
 * Controller: ticketController.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Manages support tickets lifecycle, threaded messages, checklist toggles,
 *              and automated department replies.
 */

const ticketModel = require('../models/ticketModel');
const aiMetadataModel = require('../models/aiMetadataModel');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');
const { sendSuccess, sendError } = require('../utils/responseFormatter');

const ALLOWED_STATUS_TRANSITIONS = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['OPEN', 'CLOSED'],
  CLOSED: []
};
/**
 * Create a new ticket & trigger AI Triage + Department Auto-Reply evaluation.
 * POST /api/v1/tickets
 */
async function createTicket(req, res, next) {
  try {
    const { title, description, category, priority, forceCreate } = req.body;

    if (!title || !description) {
      return sendError(res, 400, 'Ticket title and description are required.');
    }

    const customerId = req.user.id;

    // Check for duplicate issues or follow-ups
    const dupCheck = await ticketModel.findDuplicateOrRelatedTickets({
      customerId,
      title,
      description,
      category: category || 'General'
    });

    // 1. If exact/similar issue was ALREADY RESOLVED, inform user instead of creating duplicate
    if (dupCheck.isDuplicate && !forceCreate) {
      return res.status(409).json({
        success: false,
        is_duplicate: true,
        code: 'DUPLICATE_RESOLVED_TICKET',
        message: `A resolved ticket for this issue already exists: #${dupCheck.duplicateTicket.ticket_number} — "${dupCheck.duplicateTicket.title}". This issue was previously resolved.`,
        data: {
          resolved_ticket: dupCheck.duplicateTicket,
          resolution_summary: dupCheck.duplicateTicket.resolution_summary || 'Issue was investigated and resolved by support engineering.'
        }
      });
    }

    // 2. If user is issuing a new ticket as a follow-up on an active open ticket, link message to that ticket
    if (dupCheck.isFollowUp && dupCheck.existingTicket && !forceCreate) {
      const followUpMsg = await ticketModel.createMessage({
        ticketId: dupCheck.existingTicket.id,
        senderId: customerId,
        messageBody: `[Follow-up Inquiry from Customer]:\n${description}`,
        isInternalNote: false
      });

      return sendSuccess(res, 200, `Your follow-up has been linked to your existing active ticket #${dupCheck.existingTicket.ticket_number}.`, {
        linked_to_existing: true,
        ticket: dupCheck.existingTicket,
        message: followUpMsg
      });
    }

    // Determine linked ticket ID from related category tickets
    const linkedTicketId = (dupCheck.relatedTickets && dupCheck.relatedTickets[0]?.id) || null;

    // 3. Create ticket and initial customer message atomically
    const transactionResult = await ticketModel.createTicketWithInitialMessage({
      customerId,
      title,
      description,
      category,
      priority,
      linkedTicketId
    });

    const newTicket = transactionResult.ticket;
    newTicket.linked_tickets = dupCheck.relatedTickets || [];

    // 4. Trigger AI Triage microservice with role-based prompting & dataset benchmarks
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

    // 5. Evaluate Automated Department Response
    const autoReplyResult = await aiService.evaluateDepartmentAutoReply({
      title,
      description,
      category: aiResult.category || category
    });

    let autoReplyMessage = null;
    if (autoReplyResult && autoReplyResult.should_auto_reply && autoReplyResult.confidence_score >= 0.75) {
      // Post the department automated response to the ticket thread
      autoReplyMessage = await ticketModel.createMessage({
        ticketId: newTicket.id,
        senderId: req.user.id, // Or system bot
        messageBody: `[Automated Response from ${autoReplyResult.target_department}]:\n${autoReplyResult.automated_reply_body}`,
        isInternalNote: false
      });
    }

    newTicket.ai_metadata = aiMetadata;
    newTicket.checklists = checklistItems;
    newTicket.auto_reply = autoReplyResult;
    newTicket.initial_auto_message = autoReplyMessage;

    return sendSuccess(res, 201, 'Ticket created successfully with AI decision support and department routing.', newTicket);
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
    const ticket = await ticketModel.getTicketById(ticketId, req.user.role);

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
 * Fire-and-forget worker: summarizes the ticket's message history via the AI
 * microservice and persists it to ai_metadata.timeline_summary once ready.
 * Runs after the HTTP response has already been sent, so a slow/failed
 * Gemini call never delays or breaks the status transition.
 */
async function triggerReopenedTimelineSummary(ticketId, messages) {
  try {
    const summaryText = await aiService.summarizeTimeline(messages);
    await aiMetadataModel.updateTimelineSummary(ticketId, summaryText);
    logger.info('Reopened ticket timeline summary generated', { ticketId });
  } catch (error) {
    logger.error('Async timeline summarization failed', { ticketId, error: error.message });
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

if (status) {
  const allowedTransitions =
    ALLOWED_STATUS_TRANSITIONS[currentTicket.status] || [];

  if (!allowedTransitions.includes(status)) {
    return sendError(
      res,
      400,
      `Invalid status transition from ${currentTicket.status} to ${status}.`
    );
  }
}

const updatedTicket = await ticketModel.updateTicketStatus(ticketId, {
      status,
      assignedAgentId
    });
    logger.info('Timeline summary check', {
      ticketId,
      oldStatus: currentTicket.status,
      newStatus: status
    });

        // If ticket is being REOPENED (RESOLVED -> OPEN), asynchronously trigger the
    // AI timeline summarizer. This is fire-and-forget on purpose: the status
    // update response must not be blocked waiting on Gemini.
    if (status === 'OPEN' && currentTicket.status === 'RESOLVED') {
      triggerReopenedTimelineSummary(ticketId, currentTicket.messages);
    }

    return sendSuccess(res, 200, 'Ticket status updated successfully', updatedTicket);
  } catch (error) {
    next(error);
  }
}

/**
 * Forward ticket to specific department with agent comments.
 * POST /api/v1/tickets/:id/forward
 */
async function forwardTicket(req, res, next) {
  try {
    const ticketId = req.params.id;
    const { targetDepartment, comments, assignedAgentId } = req.body;

    if (!targetDepartment) {
      return sendError(res, 400, 'Target department is required for forwarding.');
    }

    const currentTicket = await ticketModel.getTicketById(ticketId);
    if (!currentTicket) {
      return sendError(res, 404, 'Ticket not found.');
    }

    // Update status to IN_PROGRESS and reassign if specified
    const updatedTicket = await ticketModel.modifyTicket(ticketId, {
      status: 'IN_PROGRESS',
      assigned_agent_id: assignedAgentId || currentTicket.assigned_agent_id
    });

    // Record internal handover note
    const handoverComment = comments ? ` [Comments: ${comments}]` : '';
    await ticketModel.createMessage({
      ticketId,
      senderId: req.user.id,
      messageBody: `[Inter-Department Forwarding]: Ticket routed to ${targetDepartment} by ${req.user.name}.${handoverComment}`,
      isInternalNote: true
    });

    return sendSuccess(res, 200, `Ticket successfully forwarded to ${targetDepartment}.`, updatedTicket);
  } catch (error) {
    next(error);
  }
}

/**
 * Modify any ticket attributes (Admin / Escalation control).
 * PATCH /api/v1/tickets/:id
 */
async function modifyTicket(req, res, next) {
  try {
    const ticketId = req.params.id;
    const { title, description, category, priority, status, assignedAgentId } = req.body;

    const currentTicket = await ticketModel.getTicketById(ticketId);
    if (!currentTicket) {
      return sendError(res, 404, 'Ticket not found.');
    }

    const updatedTicket = await ticketModel.modifyTicket(ticketId, {
      title,
      description,
      category,
      priority,
      status,
      assigned_agent_id: assignedAgentId
    });

    // Post an internal note for administrative override
    await ticketModel.createMessage({
      ticketId,
      senderId: req.user.id,
      messageBody: `[Ticket Modified by ${req.user.name} (${req.user.role})]: Properties updated.`,
      isInternalNote: true
    });

    return sendSuccess(res, 200, 'Ticket modified successfully.', updatedTicket);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete / Archive a ticket record (Admin only).
 * DELETE /api/v1/tickets/:id
 */
async function deleteTicket(req, res, next) {
  try {
    const ticketId = req.params.id;
    const result = await ticketModel.deleteTicket(ticketId);
    if (!result) {
      return sendError(res, 404, 'Ticket not found.');
    }
    return sendSuccess(res, 200, 'Ticket deleted successfully.', { id: ticketId });
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
  forwardTicket,
  modifyTicket,
  deleteTicket,
  postMessage,
  toggleChecklist
};
