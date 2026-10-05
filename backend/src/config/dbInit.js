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

      // Find schema & seed file locations in database/ migrations directory
      let schemaPath = path.join(__dirname, '../../../database/migrations/001_init_schema.sql');
      let seedPath = path.join(__dirname, '../../../database/seeds/001_seed_data.sql');

      if (!fs.existsSync(schemaPath)) {
        schemaPath = path.join(process.cwd(), 'database/migrations/001_init_schema.sql');
      }
      if (!fs.existsSync(seedPath)) {
        seedPath = path.join(process.cwd(), 'database/seeds/001_seed_data.sql');
      }

      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        logger.info('✅ Database schema initialized successfully.');
      } else {
        logger.error(`Schema file not found at ${schemaPath}`);
      }

      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSql);
        logger.info('✅ Database seed data inserted successfully.');
      } else {
        logger.error(`Seed file not found at ${seedPath}`);
      }
    } else {
      logger.info('PostgreSQL database tables already present. Ensuring schema migrations are up to date...');
      try {
        await pool.query(`
          ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assigned_department VARCHAR(100) DEFAULT 'Technical Support';
          ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ai_routing_approved BOOLEAN DEFAULT FALSE;
          ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_status_check;
          ALTER TABLE tickets ADD CONSTRAINT tickets_status_check CHECK (status IN ('OPEN', 'APPROVED', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED'));
        `);
        logger.info('✅ Schema migrations verified (APPROVED status & triage columns).');
      } catch (migrationErr) {
        logger.warn('Schema incremental migration warning:', migrationErr.message);
      }
    }
  } catch (error) {
    logger.error('Failed to auto-initialize database tables:', error);
  }
}

module.exports = initializeDatabase;
