/**
 * Express Router: aiProxyRoutes.js
 * Lead Engineer: Member 2 & Member 3
 * Description: Express routes forwarding AI decision queries, department auto-replies, and benchmarks.
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

// Department Auto-Reply evaluation
router.post('/department-auto-reply', authorizeRoles('AGENT', 'ADMIN'), aiProxyController.evaluateAutoReply);

// Department Rules & Policies
router.get('/departments', authorizeRoles('AGENT', 'ADMIN'), aiProxyController.getDepartmentRules);

// Dataset Benchmarks
router.get('/benchmarks', authorizeRoles('AGENT', 'ADMIN'), aiProxyController.getBenchmarks);

module.exports = router;
