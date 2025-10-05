const Ticket = require('../models/ticket.model');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

exports.getOverview = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'open' });
    const inProgress = await Ticket.countDocuments({ status: 'in-progress' });
    const resolved = await Ticket.countDocuments({ status: 'resolved' });

    sendSuccess(res, 'Stats retrieved', { total, open, inProgress, resolved });
  } catch (error) {
    logger.error('Error getting stats:', error);
    sendError(res, error.message);
  }
};
