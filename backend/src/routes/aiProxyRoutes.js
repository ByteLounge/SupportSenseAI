/**
 * Express Router: aiProxyRoutes.js
 * Lead Engineer: Member 2 & Member 3
 * Description: Express routes forwarding AI decision queries.
 */

const express = require('express');
const router = express.Router();
const aiProxyController = require('../controllers/aiProxyController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// Pre-send response quality checker
router.post('/verify-response', authorizeRoles('AGENT', 'ADMIN'), aiProxyController.verifyResponse);

// Weekly Learning Insights
router.get('/insights', authorizeRoles('AGENT', 'ADMIN'), aiProxyController.getWeeklyInsights);

module.exports = router;
