/**
 * Express Router: authRoutes.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Express routes for user authentication.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Public auth endpoints protected by rate limiting
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);

// Authenticated user route
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
