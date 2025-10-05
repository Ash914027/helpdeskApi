const Ticket = require('../models/ticket.model');
const slaService = require('./sla.service');

class TicketService {
  async getAllTickets(filters = {}) {
    const query = {};
    
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    
    if (filters.priority && filters.priority !== 'all') {
      query.priority = filters.priority;
    }
    
    if (filters.search) {
      query.$or = [
        { title: new RegExp(filters.search, 'i') },
        { description: new RegExp(filters.search, 'i') }
      ];
    }
    
    return await Ticket.find(query).sort({ createdAt: -1 });
  }

  async getTicketById(id) {
    return await Ticket.findById(id);
  }

  async createTicket(data) {
    const slaDeadline = slaService.calculateSLADeadline(data.priority || 'medium');
    
    const ticket = new Ticket({
      ...data,
      slaDeadline
    });
    
    return await ticket.save();
  }

  async updateTicket(id, data) {
    if (data.priority) {
      data.slaDeadline = slaService.calculateSLADeadline(data.priority);
    }
    
    return await Ticket.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async updateTicketStatus(id, status) {
    return await Ticket.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
  }

  async deleteTicket(id) {
    return await Ticket.findByIdAndDelete(id);
  }

  async getComments(ticketId) {
    const ticket = await Ticket.findById(ticketId);
    return ticket ? ticket.comments : [];
  }

  async addComment(ticketId, commentData) {
    const ticket = await Ticket.findById(ticketId);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.comments.push(commentData);
    await ticket.save();
    
    return ticket.comments[ticket.comments.length - 1];
  }

  async deleteComment(ticketId, commentId) {
    const ticket = await Ticket.findById(ticketId);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const comment = ticket.comments.id(commentId);
    
    if (!comment) {
      return null;
    }
    
    comment.remove();
    await ticket.save();
    
    return comment;
  }
}

module.exports = new TicketService();
