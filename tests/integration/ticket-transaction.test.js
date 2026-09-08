const ticketModel = require('../../backend/src/models/ticketModel');
const db = require('../../backend/src/config/db');

describe('SCRUM-112: Ticket Creation Transaction', () => {
  afterAll(async () => {
    await db.pool.end();
  });

  test('creates ticket and initial message together', async () => {
    const result = await ticketModel.createTicketWithInitialMessage({
      customerId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      title: 'Transaction Test Ticket',
      description: 'Testing atomic ticket creation',
      category: 'General',
      priority: 'MEDIUM'
    });

    expect(result.ticket).toBeDefined();
    expect(result.initialMessage).toBeDefined();
    expect(result.initialMessage.ticket_id).toBe(result.ticket.id);
  });
    test('rolls back ticket creation if the initial message fails', async () => {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const ticketNumberResult = await client.query(
        "SELECT nextval('ticket_number_seq') AS ticket_number;"
      );
      const ticketNumber = `T-${ticketNumberResult.rows[0].ticket_number}`;

      const ticketResult = await client.query(
        `
          INSERT INTO tickets (
            ticket_number,
            customer_id,
            title,
            description,
            category,
            priority,
            status
          )
          VALUES ($1, $2, $3, $4, $5, $6, 'OPEN')
          RETURNING id;
        `,
        [
          ticketNumber,
          'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
          'Rollback Test Ticket',
          'Testing transaction rollback',
          'General',
          'MEDIUM'
        ]
      );

      const ticketId = ticketResult.rows[0].id;

      // Deliberately use an invalid sender ID to make message creation fail.
      await expect(
        client.query(
          `
            INSERT INTO ticket_messages (
              ticket_id,
              sender_id,
              message_body,
              is_internal_note
            )
            VALUES ($1, $2, $3, $4);
          `,
          [
            ticketId,
            '00000000-0000-0000-0000-000000000000',
            'This message should fail',
            false
          ]
        )
      ).rejects.toThrow();

      await client.query('ROLLBACK');

      const checkResult = await client.query(
        'SELECT id FROM tickets WHERE id = $1;',
        [ticketId]
      );

      expect(checkResult.rows).toHaveLength(0);
    } finally {
      client.release();
    }
  });
});