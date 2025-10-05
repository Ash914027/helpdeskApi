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

  try {
    await connectDB();

    if (method === 'GET') {
      // Simple listing with optional query params: status, priority, search
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const params = Object.fromEntries(url.searchParams.entries());

      const query = {};
      if (params.status && params.status !== 'all') query.status = params.status;
      if (params.priority && params.priority !== 'all') query.priority = params.priority;
      if (params.search) query.$or = [
        { title: new RegExp(params.search, 'i') },
        { description: new RegExp(params.search, 'i') }
      ];

      const tickets = await Ticket.find(query).sort({ createdAt: -1 });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: tickets }));
    }

    if (method === 'POST') {
      const body = await parseJsonBody(req);
      // Apply SLA
      const slaDeadline = slaService.calculateSLADeadline(body.priority || 'medium');
      const ticket = new Ticket({ ...body, slaDeadline });
      await ticket.save();
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, data: ticket }));
    }

    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    return res.end('Method Not Allowed');
  } catch (err) {
    console.error('Tickets handler error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
  }
};
