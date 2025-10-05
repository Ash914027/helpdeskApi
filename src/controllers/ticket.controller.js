const ticketService = require('../services/ticket.service');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const tickets = await ticketService.getAllTickets({ status, priority, search });
    
    sendSuccess(res, 'Tickets retrieved successfully', tickets);
  } catch (error) {
    logger.error('Error getting tickets:', error);
    sendError(res, error.message);
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    
    if (!ticket) {
      return sendError(res, 'Ticket not found', 404);
    }
    
    sendSuccess(res, 'Ticket retrieved successfully', ticket);
  } catch (error) {
    logger.error('Error getting ticket:', error);
    sendError(res, error.message);
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    sendSuccess(res, 'Ticket created successfully', ticket, 201);
  } catch (error) {
    logger.error('Error creating ticket:', error);
    sendError(res, error.message);
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    
    if (!ticket) {
      return sendError(res, 'Ticket not found', 404);
    }
    
    sendSuccess(res, 'Ticket updated successfully', ticket);
  } catch (error) {
    logger.error('Error updating ticket:', error);
    sendError(res, error.message);
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const ticket = await ticketService.updateTicketStatus(req.params.id, req.body.status);
    
    if (!ticket) {
      return sendError(res, 'Ticket not found', 404);
    }
    
    sendSuccess(res, 'Ticket status updated successfully', ticket);
  } catch (error) {
    logger.error('Error updating status:', error);
    sendError(res, error.message);
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await ticketService.deleteTicket(req.params.id);
    
    if (!ticket) {
      return sendError(res, 'Ticket not found', 404);
    }
    
    sendSuccess(res, 'Ticket deleted successfully', ticket);
  } catch (error) {
    logger.error('Error deleting ticket:', error);
    sendError(res, error.message);
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await ticketService.getComments(req.params.id);
    sendSuccess(res, 'Comments retrieved successfully', comments);
  } catch (error) {
    logger.error('Error getting comments:', error);
    sendError(res, error.message);
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = await ticketService.addComment(req.params.id, req.body);
    sendSuccess(res, 'Comment added successfully', comment, 201);
  } catch (error) {
    logger.error('Error adding comment:', error);
    sendError(res, error.message);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await ticketService.deleteComment(
      req.params.ticketId,
      req.params.commentId
    );
    
    if (!comment) {
      return sendError(res, 'Comment not found', 404);
    }
    
    sendSuccess(res, 'Comment deleted successfully', comment);
  } catch (error) {
    logger.error('Error deleting comment:', error);
    sendError(res, error.message);
  }
};
