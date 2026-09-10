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
  const result = await db.query(
    "SELECT nextval('ticket_number_seq') AS ticket_number;"
  );

  return `T-${result.rows[0].ticket_number}`;
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
 * Create a ticket and its initial customer message atomically.
 */
async function createTicketWithInitialMessage({
  customerId,
  title,
  description,
  category = 'General',
  priority = 'MEDIUM',
  linkedTicketId = null
}) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // Generate ticket number inside the same transaction
    const numberResult = await client.query(
      "SELECT nextval('ticket_number_seq') AS ticket_number;"
    );
    const ticketNumber = `T-${numberResult.rows[0].ticket_number}`;

    // Create ticket
    const ticketResult = await client.query(
      `
        INSERT INTO tickets (
          ticket_number,
          customer_id,
          title,
          description,
          category,
          priority,
          status,
          linked_ticket_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', $7)
        RETURNING *;
      `,
      [ticketNumber, customerId, title, description, category, priority, linkedTicketId]
    );

    const ticket = ticketResult.rows[0];

    // Create initial customer message
    const messageResult = await client.query(
      `
        INSERT INTO ticket_messages (
          ticket_id,
          sender_id,
          message_body,
          is_internal_note
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [ticket.id, customerId, description, false]
    );

    await client.query('COMMIT');

    return {
      ticket,
      initialMessage: messageResult.rows[0]
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
async function getTicketById(ticketId, userRole = null) {
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

  // 2. Fetch threaded messages (Customers cannot see internal notes)
  let msgSql = `
    SELECT m.id, m.message_body, m.is_internal_note, m.created_at,
           u.name AS sender_name, u.role AS sender_role, u.avatar_url AS sender_avatar
    FROM ticket_messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.ticket_id = $1
  `;
  const msgParams = [ticketId];
  if (userRole === 'CUSTOMER') {
    msgSql += ` AND m.is_internal_note = FALSE`;
  }
  msgSql += ` ORDER BY m.created_at ASC;`;

  const msgRes = await db.query(msgSql, msgParams);
  ticket.messages = msgRes.rows;

  // 3. Fetch AI decision metadata
  const aiSql = `SELECT * FROM ai_metadata WHERE ticket_id = $1;`;
  const aiRes = await db.query(aiSql, [ticketId]);
  ticket.ai_metadata = aiRes.rows[0] || null;

  // 4. Fetch agent assist checklists
  const checkSql = `SELECT * FROM agent_checklists WHERE ticket_id = $1 ORDER BY created_at ASC;`;
  const checkRes = await db.query(checkSql, [ticketId]);
  ticket.checklists = checkRes.rows;

  // 5. Fetch linked and related tickets for this user and ticket
  const linkedSql = `
    SELECT id, ticket_number, title, status, category, priority, created_at
    FROM tickets
    WHERE (linked_ticket_id = $1 OR id = $2 OR (customer_id = $3 AND id != $1 AND category = $4))
    ORDER BY created_at DESC
    LIMIT 6;
  `;
  const linkedRes = await db.query(linkedSql, [
    ticketId,
    ticket.linked_ticket_id || ticketId,
    ticket.customer_id,
    ticket.category
  ]);
  ticket.linked_tickets = linkedRes.rows.filter(r => r.id !== ticket.id);

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
 * Modify ticket attributes (Admin / Agent escalation override).
 */
async function modifyTicket(ticketId, fields = {}) {
  const allowedFields = ['title', 'description', 'category', 'priority', 'status', 'assigned_agent_id'];
  const setClauses = ['updated_at = CURRENT_TIMESTAMP'];
  const params = [];

  for (const [key, val] of Object.entries(fields)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (allowedFields.includes(snakeKey) && val !== undefined) {
      params.push(val);
      setClauses.push(`${snakeKey} = $${params.length}`);
    }
  }

  params.push(ticketId);
  const sql = `
    UPDATE tickets 
    SET ${setClauses.join(', ')} 
    WHERE id = $${params.length} 
    RETURNING *;
  `;

  const result = await db.query(sql, params);
  return result.rows[0];
}

/**
 * Delete a ticket record by ID.
 */
async function deleteTicket(ticketId) {
  const sql = `DELETE FROM tickets WHERE id = $1 RETURNING id;`;
  const result = await db.query(sql, [ticketId]);
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

/**
 * Detect duplicate tickets or related tickets from the same user.
 * Prevents submitting duplicate tickets when an issue was already resolved.
 * Links follow-up requests to existing active tickets.
 */
async function findDuplicateOrRelatedTickets({ customerId, title, description, category }) {
  if (!customerId) return { isDuplicate: false, isFollowUp: false, relatedTickets: [] };

  const sql = `
    SELECT t.*,
      (SELECT message_body FROM ticket_messages WHERE ticket_id = t.id AND is_internal_note = FALSE ORDER BY created_at DESC LIMIT 1) as resolution_summary
    FROM tickets t
    WHERE t.customer_id = $1
    ORDER BY t.created_at DESC
    LIMIT 20;
  `;
  const result = await db.query(sql, [customerId]);
  const userTickets = result.rows;

  if (userTickets.length === 0) {
    return { isDuplicate: false, isFollowUp: false, relatedTickets: [] };
  }

  const queryText = `${title || ''} ${description || ''}`.toLowerCase();
  
  const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'hello', 'please', 'help', 'my', 'i', 'was', 'am', 'we', 'our', 'need']);
  const getKeywords = (text) => {
    return (text || '').toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  };

  const queryKeywords = new Set(getKeywords(queryText));
  const isFollowUpIntent = /\b(update|status|follow\s*up|following\s*up|any\s*news|check\s*status|progress|still\s*waiting|any\s*update)\b/i.test(queryText);

  let duplicateMatch = null;
  let followUpMatch = null;
  const relatedTickets = [];

  for (const t of userTickets) {
    const ticketText = `${t.title} ${t.description}`.toLowerCase();
    const tKeywords = getKeywords(ticketText);
    
    // Keyword match calculation
    let matchCount = 0;
    for (const kw of tKeywords) {
      if (queryKeywords.has(kw)) matchCount++;
    }
    const overlapRatio = queryKeywords.size > 0 ? matchCount / Math.min(queryKeywords.size, tKeywords.length || 1) : 0;
    const isCategoryMatch = category && t.category && category.toLowerCase() === t.category.toLowerCase();
    const isExactTitle = (title || '').trim().toLowerCase() === (t.title || '').trim().toLowerCase();

    // Check for follow-up on active tickets
    if (isFollowUpIntent && ['OPEN', 'IN_PROGRESS', 'PENDING'].includes(t.status)) {
      if (!followUpMatch && (isCategoryMatch || overlapRatio > 0.2 || userTickets.length === 1)) {
        followUpMatch = t;
      }
    }

    // Check for duplicate issue
    if (isExactTitle || overlapRatio >= 0.5) {
      if (!duplicateMatch) {
        duplicateMatch = t;
      }
    }

    // Related tickets
    if (isCategoryMatch || overlapRatio >= 0.3) {
      relatedTickets.push({
        id: t.id,
        ticket_number: t.ticket_number,
        title: t.title,
        status: t.status,
        category: t.category,
        priority: t.priority,
        created_at: t.created_at
      });
    }
  }

  return {
    isDuplicate: !!duplicateMatch && ['RESOLVED', 'CLOSED'].includes(duplicateMatch.status),
    duplicateTicket: duplicateMatch,
    isFollowUp: !!followUpMatch,
    existingTicket: followUpMatch,
    relatedTickets
  };
}

module.exports = {
  createTicket,
  createTicketWithInitialMessage,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  modifyTicket,
  deleteTicket,
  createMessage,
  toggleChecklistItem,
  findDuplicateOrRelatedTickets
};
