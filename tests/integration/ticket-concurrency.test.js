const ticketModel = require('../../backend/src/models/ticketModel');
const db = require('../../backend/src/config/db');

describe('SCRUM-110: Concurrent Ticket Creation', () => {
  const customerId = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  const createdTicketIds = [];

  afterAll(async () => {
    if (createdTicketIds.length > 0) {
      await db.query(
        `DELETE FROM tickets WHERE id = ANY($1::uuid[])`,
        [createdTicketIds]
      );
    }

    await db.pool.end();
  });

  test('handles multiple ticket creation requests concurrently', async () => {
    const numberOfRequests = 10;

    const requests = Array.from(
      { length: numberOfRequests },
      (_, index) =>
        ticketModel.createTicket({
          customerId,
          title: `Concurrent Test Ticket ${Date.now()}-${index}`,
          description: `Testing concurrent ticket creation request ${index}`,
          category: 'Technical',
          priority: 'MEDIUM'
        })
    );

    const results = await Promise.allSettled(requests);

    const successfulTickets = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    const failedRequests = results.filter(
      result => result.status === 'rejected'
    );

    successfulTickets.forEach(ticket => {
      createdTicketIds.push(ticket.id);
    });

    console.log(`Successful ticket creations: ${successfulTickets.length}`);
    console.log(`Failed ticket creations: ${failedRequests.length}`);

    if (failedRequests.length > 0) {
      console.log(
        'Concurrent creation errors:',
        failedRequests.map(error => error.reason.message)
      );
    }

    expect(failedRequests).toHaveLength(0);
    expect(successfulTickets).toHaveLength(numberOfRequests);

    const ticketNumbers = successfulTickets.map(
      ticket => ticket.ticket_number
    );

    expect(new Set(ticketNumbers).size).toBe(numberOfRequests);
  });
});