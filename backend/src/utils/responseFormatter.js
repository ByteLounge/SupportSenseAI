/**
 * Utility Module: responseFormatter.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Standardized JSON response structure for API consistency.
 */

/**
 * Send success HTTP response.
 * 
 * @param {object} res - Express response object.
 * @param {number} statusCode - HTTP status code (e.g. 200, 201).
 * @param {string} message - User-friendly message.
 * @param {any} data - Payload data.
 */
function sendSuccess(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Send error HTTP response.
 * 
 * @param {object} res - Express response object.
 * @param {number} statusCode - HTTP status code (e.g. 400, 401, 404, 500).
 * @param {string} message - Error explanation message.
 * @param {any} errorDetails - Additional error context or validation array.
 */
function sendError(res, statusCode, message, errorDetails = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails
  });
}

module.exports = {
  sendSuccess,
  sendError
};
