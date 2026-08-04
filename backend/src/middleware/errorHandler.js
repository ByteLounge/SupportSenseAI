/**
 * Middleware: errorHandler.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Global Express error handler for catching uncaught exceptions.
 */

const logger = require('../utils/logger');
const { sendError } = require('../utils/responseFormatter');

function globalErrorHandler(err, req, res, next) {
  logger.error('Unhandled Application Error:', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error. Please contact system support.';

  return sendError(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : null);
}

module.exports = globalErrorHandler;
