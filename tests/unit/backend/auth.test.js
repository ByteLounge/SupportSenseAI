/**
 * Unit Test Suite: auth.test.js
 * Lead Engineer: Member 4 (DevOps & QA Lead)
 * Description: Unit tests verifying JWT signing, password hashing, and user registration data validation.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Backend Auth Unit Tests', () => {

  test('Password hashing produces secure non-plaintext string', async () => {
    const rawPassword = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    expect(hash).not.toEqual(rawPassword);
    expect(hash).toMatch(/^\$2b\$10\$/); // Valid bcrypt salt prefix

    const match = await bcrypt.compare(rawPassword, hash);
    expect(match).toBe(true);
  });

  test('JWT sign and verify returns valid user payload', () => {
    const secret = 'test_secret_key_123';
    const payload = { id: 'user-uuid-1', email: 'agent@supportsense.ai', role: 'AGENT' };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toEqual(payload.id);
    expect(decoded.role).toEqual('AGENT');
  });

});
