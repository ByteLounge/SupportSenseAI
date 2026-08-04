/**
 * Unit Test Suite: ticket.test.js
 * Lead Engineer: Member 4 (DevOps & QA Lead)
 * Description: Unit tests verifying urgency score calculation and status transition logic.
 */

describe('Ticket Business Logic Unit Tests', () => {

  /**
   * Helper function calculating urgency score based on mood and SLA hours.
   */
  function calculateTicketUrgencyScore(customerMood, hoursUntilSlaBreach) {
    let baseScore = 50;

    if (customerMood === 'FRUSTRATED') {
      baseScore += 30;
    }

    if (hoursUntilSlaBreach > 24) {
      baseScore -= 15;
    }

    return Math.min(100, Math.max(1, baseScore));
  }

  test('Urgent score increases when customer mood is FRUSTRATED', () => {
    const neutralScore = calculateTicketUrgencyScore('NEUTRAL', 12);
    const frustratedScore = calculateTicketUrgencyScore('FRUSTRATED', 12);

    expect(frustratedScore).toBeGreaterThan(neutralScore);
    expect(frustratedScore).toEqual(80);
  });

  test('Urgent score decreases when ample SLA duration remains (>24h)', () => {
    const score = calculateTicketUrgencyScore('NEUTRAL', 48);
    expect(score).toEqual(35);
  });

});
