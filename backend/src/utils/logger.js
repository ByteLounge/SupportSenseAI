/**
 * Utility Module: logger.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Simple logging utility for structured console outputs.
 */

const isProd = process.env.NODE_ENV === 'production';

function formatMessage(level, message, meta = '') {
  const timestamp = new Date().toISOString();
  if (isProd) {
    return JSON.stringify({ timestamp, level, message, meta: meta || undefined });
  }
  return `[${level.toUpperCase()}] [${timestamp}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
}

const logger = {
  info: (message, meta = '') => console.log(formatMessage('info', message, meta)),
  warn: (message, meta = '') => console.warn(formatMessage('warn', message, meta)),
  error: (message, meta = '') => console.error(formatMessage('error', message, meta))
};

module.exports = logger;
