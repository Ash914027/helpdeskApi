require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  API_VERSION: process.env.API_VERSION || 'v1',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk',
  DB_NAME: process.env.DB_NAME || 'helpdesk',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // SLA
  SLA_TIMES: {
    critical: parseInt(process.env.SLA_CRITICAL) || 4,
    high: parseInt(process.env.SLA_HIGH) || 8,
    medium: parseInt(process.env.SLA_MEDIUM) || 24,
    low: parseInt(process.env.SLA_LOW) || 72
  },
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
