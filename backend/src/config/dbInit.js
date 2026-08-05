/**
 * Database Initialization Script: dbInit.js
 * Ensures PostgreSQL tables & seed data are automatically initialized on startup (e.g. Render / Cloud DB).
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
const logger = require('../utils/logger');

async function initializeDatabase() {
  try {
    // Check if 'users' table exists
    const res = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      );
    `);

    const tableExists = res.rows[0].exists;

    if (!tableExists) {
      logger.info('Initializing PostgreSQL schema & seed data for cloud deployment...');

      // Find schema & seed file locations
      const schemaPath = path.join(__dirname, '../../../database/migrations/001_init_schema.sql');
      const seedPath = path.join(__dirname, '../../../database/seeds/001_seed_data.sql');

      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        logger.info('✅ Database schema initialized successfully.');
      }

      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSql);
        logger.info('✅ Database seed data inserted successfully.');
      }
    } else {
      logger.info('PostgreSQL database tables already present.');
    }
  } catch (error) {
    logger.error('Failed to auto-initialize database tables:', error);
  }
}

module.exports = initializeDatabase;
