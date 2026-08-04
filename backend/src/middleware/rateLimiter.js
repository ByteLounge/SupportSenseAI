/**
 * Middleware: rateLimiter.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Restricts excessive API requests to prevent DDoS and brute-force attacks.
 */

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter (100 requests per 15 minutes)
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict Auth Limiter for login and registration (10 requests per 15 minutes)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
