/**
 * Utility Module: logger.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Simple logging utility for structured console outputs.
 */

const logger = {
  info: (message, meta = '') => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  },
  error: (message, meta = '') => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, meta ? JSON.stringify(meta) : '');
  }
};

module.exports = logger;
