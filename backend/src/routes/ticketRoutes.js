/**
 * Express Router: ticketRoutes.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Express routes for ticket management, messaging, and checklists.
 */

const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// All ticket routes require a valid JWT token
router.use(authenticateToken);

// Ticket CRUD endpoints
router.post('/', ticketController.createTicket);
router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicketById);

// Agent / Admin restricted routes
router.patch('/:id/status', authorizeRoles('AGENT', 'ADMIN'), ticketController.updateStatus);
router.post('/:id/forward', authorizeRoles('AGENT', 'ADMIN'), ticketController.forwardTicket);
router.patch('/:id', authorizeRoles('AGENT', 'ADMIN'), ticketController.modifyTicket);
router.delete('/:id', authorizeRoles('ADMIN'), ticketController.deleteTicket);
router.post('/:id/messages', ticketController.postMessage);
router.patch('/:id/checklist/:itemId', authorizeRoles('AGENT', 'ADMIN'), ticketController.toggleChecklist);

module.exports = router;
