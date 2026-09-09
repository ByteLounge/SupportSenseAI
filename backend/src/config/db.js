/**
 * Database Module: db.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Initializes a PostgreSQL connection pool and provides query helper.
 */

const { Pool } = require('pg');
const env = require('./env');

/**
 * Configure PostgreSQL Pool connection options.
 * Natively supports Supabase (Direct port 5432 & Transaction Pooler port 6543)
 * as well as standard local/containerized PostgreSQL instances.
 */
const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

const isCloudOrSupabase = Boolean(
  connectionString && (
    connectionString.includes('supabase.co') ||
    connectionString.includes('supabase.com') ||
    connectionString.includes('pooler.supabase.com') ||
    connectionString.includes('render.com') ||
    process.env.DB_SSL === 'true' ||
    process.env.NODE_ENV === 'production'
  )
);

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: isCloudOrSupabase ? { rejectUnauthorized: false } : false,
      max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    }
  : {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    };

const pool = new Pool(poolConfig);

/**
 * Execute SQL query with parameter binding.
 * 
 * @param {string} text - SQL query string with $1, $2 placehholders.
 * @param {Array} params - Array of parameter values.
 * @returns {Promise<object>} Query result object.
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === 'development') {
      console.log(`[SQL Query] Executed in ${duration}ms: ${text.substring(0, 80)}...`);
    }
    return res;
  } catch (error) {
    console.error(`[SQL Error] Failed executing query: ${text}`, error);
    throw error;
  }
}

module.exports = {
  pool,
  query
};
