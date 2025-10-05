// For this project comments are handled in ticket.controller; this file is a placeholder
const ticketController = require('./ticket.controller');

exports.getComments = ticketController.getComments;
exports.addComment = ticketController.addComment;
exports.deleteComment = ticketController.deleteComment;
