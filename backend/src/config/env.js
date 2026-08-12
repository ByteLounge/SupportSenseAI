/**
 * Configuration Module: env.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Loads and exports environment variables with default fallbacks.
 */

const dotenv = require('dotenv');
dotenv.config();

const isProduction = (process.env.NODE_ENV === 'production');
const defaultJwtSecret = 'supportsense_super_secret_jwt_key_2026';

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === defaultJwtSecret)) {
  console.warn('[SECURITY WARNING] Running in production with default/missing JWT_SECRET!');
}

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || defaultJwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:80'],
  
  // PostgreSQL Database Credentials
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'supportsense_db',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',

  // Python FastAPI AI Service URL
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000'
};
