const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { validateTicket, validateComment } = require('../middleware/validation.middleware');

// Ticket routes
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/', validateTicket, ticketController.createTicket);
router.put('/:id', validateTicket, ticketController.updateTicket);
router.patch('/:id/status', ticketController.updateTicketStatus);
router.delete('/:id', ticketController.deleteTicket);

// Comment routes
router.get('/:id/comments', ticketController.getComments);
router.post('/:id/comments', validateComment, ticketController.addComment);
router.delete('/:ticketId/comments/:commentId', ticketController.deleteComment);

module.exports = router;
