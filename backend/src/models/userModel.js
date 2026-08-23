/**
 * Model: userModel.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Data Access Object for users table in PostgreSQL.
 */

const db = require('../config/db');

/**
 * Find user by email address.
 * 
 * @param {string} email - Email address to query.
 * @returns {Promise<object|null>} User object or null if not found.
 */
async function findUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

/**
 * Find user by primary UUID.
 * 
 * @param {string} id - User UUID.
 * @returns {Promise<object|null>} User object or null.
 */
async function findUserById(id) {
  const result = await db.query(
    'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Create a new user record.
 * 
 * @param {object} userData - { name, email, passwordHash, role, avatarUrl }
 * @returns {Promise<object>} Newly created user record (excluding password_hash).
 */
async function createUser({ name, email, passwordHash, role = 'CUSTOMER', avatarUrl = null }) {
  const sql = `
    INSERT INTO users (name, email, password_hash, role, avatar_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role, avatar_url, created_at;
  `;
  const values = [name, email, passwordHash, role, avatarUrl];
  const result = await db.query(sql, values);
  return result.rows[0];
}

/**
 * Get all users for admin management.
 */
async function getAllUsers() {
  const result = await db.query(
    'SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at ASC;'
  );
  return result.rows;
}

/**
 * Update user role.
 */
async function updateUserRole(id, role) {
  const result = await db.query(
    'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role, avatar_url;',
    [role, id]
  );
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getAllUsers,
  updateUserRole
};
