const connectDB = require('../../../../src/config/database');
const Ticket = require('../../../../src/models/ticket.model');
const slaService = require('../../../../src/services/sla.service');

async function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean);
  const id = parts[parts.length - 1];

  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: 'Missing id' }));
  }

  try {
    await connectDB();

    if (method === 'GET') {
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Ticket not found' }));
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: ticket }));
    }

    if (method === 'PUT') {
      const body = await parseJsonBody(req);
      if (body.priority) body.slaDeadline = slaService.calculateSLADeadline(body.priority);
      const ticket = await Ticket.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
      if (!ticket) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Ticket not found' }));
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: ticket }));
    }

    if (method === 'DELETE') {
      const ticket = await Ticket.findByIdAndDelete(id);
      if (!ticket) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Ticket not found' }));
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: ticket }));
    }

    res.statusCode = 405;
    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.end('Method Not Allowed');
  } catch (err) {
    console.error('Ticket [id] handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
  }
};
