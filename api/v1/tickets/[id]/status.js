const connectDB = require('../../../../../../src/config/database');
const Ticket = require('../../../../../../src/models/ticket.model');

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
  if (req.method !== 'PATCH') {
    res.statusCode = 405;
    res.setHeader('Allow', 'PATCH');
    return res.end('Method Not Allowed');
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean);
  const id = parts[parts.length - 2];

  if (!id) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ success: false, error: 'Missing ticket id' }));
  }

  try {
    await connectDB();
    const body = await parseJsonBody(req);
    const { status } = body || {};
    const allowed = ['open', 'in-progress', 'resolved', 'closed'];
    if (!status || !allowed.includes(status)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: false, error: 'Invalid or missing status' }));
    }

    const ticket = await Ticket.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    if (!ticket) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ success: false, error: 'Ticket not found' }));
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: true, data: ticket }));
  } catch (err) {
    console.error('Status update error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
  }
};
