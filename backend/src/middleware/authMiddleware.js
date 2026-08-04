/**
 * Middleware: authMiddleware.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Verifies JWT authentication token and enforces Role-Based Access Control (RBAC).
 */

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { sendError } = require('../utils/responseFormatter');

/**
 * Protect routes by verifying Bearer JWT token in Authorization header.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return sendError(res, 401, 'Access denied. No authentication token provided.');
  }

  try {
    const decodedUser = jwt.verify(token, env.JWT_SECRET);
    req.user = decodedUser; // Attach user payload to request object
    next();
  } catch (error) {
    return sendError(res, 403, 'Invalid or expired authentication token.');
  }
}

/**
 * Enforce Role-Based Access Control (RBAC).
 * 
 * @param  {...string} allowedRoles - Roles permitted to access route (e.g. 'ADMIN', 'AGENT').
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, `Forbidden. Role '${req.user ? req.user.role : 'Guest'}' is not authorized for this operation.`);
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
