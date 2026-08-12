const request = require('supertest');
const app = require('../../backend/src/app');

describe('HTTP REST API Integration Tests', () => {

  test('GET /health returns HTTP 200 OK with status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('UP');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });

  test('Protected endpoint /api/v1/tickets returns HTTP 401 without Bearer token', async () => {
    const res = await request(app).get('/api/v1/tickets');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/v1/auth/register fails with 400 when missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ email: 'test@example.com' }));
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/name, email, and password/i);
  });

});
