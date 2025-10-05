const connectDB = require('../../../../src/config/database');
const Ticket = require('../../../../src/models/ticket.model');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.end('Method Not Allowed');
  }

  try {
    await connectDB();

    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'open' });
    const inProgress = await Ticket.countDocuments({ status: 'in-progress' });
    const resolved = await Ticket.countDocuments({ status: 'resolved' });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, data: { total, open, inProgress, resolved } }));
  } catch (err) {
    console.error('Error in stats overview:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
  }
};
