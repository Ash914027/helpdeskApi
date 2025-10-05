const serverless = require('serverless-http');
const app = require('../src/app');
const connectDB = require('../src/config/database');

// Connect to DB once per warm function (reused across invocations when possible)
let dbConnected = false;

const handler = async (req, res) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      // Return 500 if DB connection fails
      console.error('DB connection failed:', err);
      res.statusCode = 500;
      return res.end('Database connection error');
    }
  }

  return serverless(app)(req, res);
};

module.exports = handler;
