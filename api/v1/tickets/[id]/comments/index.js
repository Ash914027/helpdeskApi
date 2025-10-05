const connectDB = require('../../../../../../src/config/database');
const Ticket = require('../../../../../../src/models/ticket.model');
const { validateComment } = require('../../../../_utils/validate');

async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (err) { reject(err); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean);
  // Expect path like /api/v1/tickets/:id/comments
  const id = parts[parts.length - 2];

  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: 'Missing ticket id' }));
  }

  try {
    await connectDB();
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ success: false, error: 'Ticket not found' }));
    }

    if (method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: ticket.comments }));
    }

    if (method === 'POST') {
      const body = await parseJsonBody(req);
      const errors = validateComment(body);
      if (errors.length) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ success: false, errors }));
      }
      ticket.comments.push(body);
      await ticket.save();
      const added = ticket.comments[ticket.comments.length - 1];
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: added }));
    }

    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    return res.end('Method Not Allowed');
  } catch (err) {
    console.error('Comments handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
  }
};
