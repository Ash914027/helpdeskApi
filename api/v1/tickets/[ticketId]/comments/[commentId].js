const connectDB = require('../../../../../../src/config/database');
const Ticket = require('../../../../../../src/models/ticket.model');

module.exports = async (req, res) => {
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean);
  // Expect path /api/v1/tickets/:ticketId/comments/:commentId
  const commentId = parts[parts.length - 1];
  const ticketId = parts[parts.length - 3];

  if (!ticketId || !commentId) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: 'Missing ids' }));
  }

  try {
    await connectDB();
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ success: false, error: 'Ticket not found' }));
    }

    if (method === 'DELETE') {
      const comment = ticket.comments.id(commentId);
      if (!comment) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Comment not found' }));
      }
      comment.remove();
      await ticket.save();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: comment }));
    }

    res.statusCode = 405;
    res.setHeader('Allow', 'DELETE');
    return res.end('Method Not Allowed');
  } catch (err) {
    console.error('Comment delete error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
  }
};
