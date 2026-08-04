/**
 * Model: ticketModel.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Data Access Object for tickets, ticket_messages, and agent_checklists.
 */

const db = require('../config/db');

/**
 * Generate unique ticket number (e.g. T-1001)
 */
async function generateTicketNumber() {
  const result = await db.query("SELECT COUNT(*) FROM tickets;");
  const count = parseInt(result.rows[0].count, 10) + 1001;
  return `T-${count}`;
}

/**
 * Create a new ticket.
 */
async function createTicket({ customerId, title, description, category = 'General', priority = 'MEDIUM' }) {
  const ticketNumber = await generateTicketNumber();
  const sql = `
    INSERT INTO tickets (ticket_number, customer_id, title, description, category, priority, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'OPEN')
    RETURNING *;
  `;
  const result = await db.query(sql, [ticketNumber, customerId, title, description, category, priority]);
  return result.rows[0];
}

/**
 * Fetch list of tickets with optional status, priority, and role filtering.
 */
async function getAllTickets({ status, priority, search, userRole, userId }) {
  let sql = `
    SELECT 
      t.id, t.ticket_number, t.title, t.description, t.status, t.category, t.priority, t.created_at, t.updated_at,
      u.name AS customer_name, u.email AS customer_email,
      a.name AS assigned_agent_name,
      ai.customer_mood, ai.mood_confidence, ai.patience_score, ai.predicted_resolution_time
    FROM tickets t
    JOIN users u ON t.customer_id = u.id
    LEFT JOIN users a ON t.assigned_agent_id = a.id
    LEFT JOIN ai_metadata ai ON t.id = ai.ticket_id
    WHERE 1=1
  `;
  const params = [];

  // Filter by customer ownership if role is CUSTOMER
  if (userRole === 'CUSTOMER') {
    params.push(userId);
    sql += ` AND t.customer_id = $${params.length}`;
  }

  if (status) {
    params.push(status);
    sql += ` AND t.status = $${params.length}`;
  }

  if (priority) {
    params.push(priority);
    sql += ` AND t.priority = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    sql += ` AND (t.title ILIKE $${params.length} OR t.description ILIKE $${params.length} OR t.ticket_number ILIKE $${params.length})`;
  }

  sql += ` ORDER BY t.created_at DESC;`;

  const result = await db.query(sql, params);
  return result.rows;
}

/**
 * Fetch complete ticket detail by ID including messages, AI metadata, and checklists.
 */
async function getTicketById(ticketId) {
  // 1. Fetch ticket primary row
  const ticketSql = `
    SELECT 
      t.*,
      u.name AS customer_name, u.email AS customer_email, u.avatar_url AS customer_avatar,
      a.name AS assigned_agent_name
    FROM tickets t
    JOIN users u ON t.customer_id = u.id
    LEFT JOIN users a ON t.assigned_agent_id = a.id
    WHERE t.id = $1;
  `;
  const ticketRes = await db.query(ticketSql, [ticketId]);
  if (ticketRes.rows.length === 0) return null;
  const ticket = ticketRes.rows[0];

  // 2. Fetch threaded messages
  const msgSql = `
    SELECT m.id, m.message_body, m.is_internal_note, m.created_at,
           u.name AS sender_name, u.role AS sender_role, u.avatar_url AS sender_avatar
    FROM ticket_messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.ticket_id = $1
    ORDER BY m.created_at ASC;
  `;
  const msgRes = await db.query(msgSql, [ticketId]);
  ticket.messages = msgRes.rows;

  // 3. Fetch AI decision metadata
  const aiSql = `SELECT * FROM ai_metadata WHERE ticket_id = $1;`;
  const aiRes = await db.query(aiSql, [ticketId]);
  ticket.ai_metadata = aiRes.rows[0] || null;

  // 4. Fetch agent assist checklists
  const checkSql = `SELECT * FROM agent_checklists WHERE ticket_id = $1 ORDER BY created_at ASC;`;
  const checkRes = await db.query(checkSql, [ticketId]);
  ticket.checklists = checkRes.rows;

  return ticket;
}

/**
 * Update ticket status or assigned agent.
 */
async function updateTicketStatus(ticketId, { status, assignedAgentId }) {
  let sql = `UPDATE tickets SET updated_at = CURRENT_TIMESTAMP`;
  const params = [];

  if (status) {
    params.push(status);
    sql += `, status = $${params.length}`;
  }

  if (assignedAgentId !== undefined) {
    params.push(assignedAgentId);
    sql += `, assigned_agent_id = $${params.length}`;
  }

  params.push(ticketId);
  sql += ` WHERE id = $${params.length} RETURNING *;`;

  const result = await db.query(sql, params);
  return result.rows[0];
}

/**
 * Add message to ticket thread.
 */
async function createMessage({ ticketId, senderId, messageBody, isInternalNote = false }) {
  const sql = `
    INSERT INTO ticket_messages (ticket_id, sender_id, message_body, is_internal_note)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await db.query(sql, [ticketId, senderId, messageBody, isInternalNote]);
  return result.rows[0];
}

/**
 * Toggle checklist item completion status.
 */
async function toggleChecklistItem(itemId, isCompleted) {
  const sql = `
    UPDATE agent_checklists 
    SET is_completed = $1, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $2 
    RETURNING *;
  `;
  const result = await db.query(sql, [isCompleted, itemId]);
  return result.rows[0];
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  createMessage,
  toggleChecklistItem
};
