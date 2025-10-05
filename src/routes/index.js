const express = require('express');
const router = express.Router();

const ticketRoutes = require('./ticket.routes');
const statsRoutes = require('./stats.routes');

// API version
router.use('/v1/tickets', ticketRoutes);
router.use('/v1/stats', statsRoutes);

module.exports = router;
