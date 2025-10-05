const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

exports.validateTicket = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description')
    .notEmpty().withMessage('Description is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 400, errors.array());
    }
    next();
  }
];

exports.validateComment = [
  body('author')
    .notEmpty().withMessage('Author is required'),
  body('text')
    .notEmpty().withMessage('Comment text is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 400, errors.array());
    }
    next();
  }
];
