const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

exports.notFound = (req, res, next) => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};

exports.errorHandler = (err, req, res, next) => {
  logger.error(err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return sendError(res, 'Validation Error', 400, errors);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return sendError(res, 'Duplicate field value', 400);
  }
  
  // Mongoose cast error
  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format', 400);
  }
  
  // Default error
  sendError(res, err.message || 'Internal Server Error', err.statusCode || 500);
};
