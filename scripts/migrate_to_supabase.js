/**
 * SupportSense AI — Supabase Database Migration Tool
 * File: scripts/migrate_to_supabase.js
 * 
 * Usage:
 *   node scripts/migrate_to_supabase.js [SUPABASE_URL]
 *   node scripts/migrate_to_supabase.js --target "postgresql://..."
 *   node scripts/migrate_to_supabase.js --source "postgresql://..." --target "postgresql://..."
 * 
 * Features:
 *   1. Establishes SSL connection to Supabase (direct or pooler).
 *   2. Applies schema migration (tables, sequences, indexes, triggers).
 *   3. If --source is provided, migrates existing data from Render/source DB to Supabase.
 *   4. Otherwise, seeds initial accounts and test tickets.
 *   5. Verifies and displays row count telemetry for all tables.
 */

const fs = require('fs');
const path = require('path');

// Resolve 'pg' package from local or backend/node_modules
let pg;
try {
  pg = require('pg');
} catch {
  try {
    pg = require(path.resolve(__dirname, '../backend/node_modules/pg'));
  } catch {
    console.error('❌ Error: "pg" module not found. Please run "npm install" inside backend directory.');
    process.exit(1);
  }
}
const { Client } = pg;

// Parse command line arguments
const args = process.argv.slice(2);
let targetUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
let sourceUrl = process.env.SOURCE_DATABASE_URL || null;
let seedData = true;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1]) {
    targetUrl = args[i + 1];
    i++;
  } else if (args[i] === '--source' && args[i + 1]) {
    sourceUrl = args[i + 1];
    i++;
  } else if (args[i] === '--no-seed') {
    seedData = false;
  } else if (!args[i].startsWith('--') && !targetUrl) {
    targetUrl = args[i];
  }
}

console.log('='.repeat(70));
console.log('  🚀 SupportSense AI — Database Migration to Supabase');
console.log('='.repeat(70));

if (!targetUrl) {
  console.error('\n❌ ERROR: Target Supabase database URL is required.');
  console.log('\nUsage:');
  console.log('  node scripts/migrate_to_supabase.js <SUPABASE_DATABASE_URL>');
  console.log('  node scripts/migrate_to_supabase.js --target <SUPABASE_URL> [--source <RENDER_URL>]\n');
  console.log('Example Supabase URLs:');
  console.log('  Direct:       postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
  console.log('  Transaction:  postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres\n');
  process.exit(1);
}

function maskConnectionString(uri) {
  try {
    const url = new URL(uri);
    return `${url.protocol}//${url.username}:****@${url.host}${url.pathname}`;
  } catch {
    return uri.replace(/:[^:@]+@/, ':****@');
  }
}

console.log(`\n• Target (Supabase): ${maskConnectionString(targetUrl)}`);
if (sourceUrl) {
  console.log(`• Source (Render):   ${maskConnectionString(sourceUrl)}`);
}

const targetClient = new Client({
  connectionString: targetUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000
});

async function runMigration() {
  try {
    console.log('\n[1/5] Connecting to Supabase...');
    await targetClient.connect();
    const verRes = await targetClient.query('SELECT version(), current_database(), current_user;');
    console.log(`✅ Connected successfully to Supabase!`);
    console.log(`   Database: ${verRes.rows[0].current_database}`);
    console.log(`   User:     ${verRes.rows[0].current_user}`);
    console.log(`   Version:  ${verRes.rows[0].version.split(',')[0]}`);

    // Read Schema SQL
    console.log('\n[2/5] Applying 001_init_schema.sql to Supabase...');
    const schemaPath = path.resolve(__dirname, '../database/migrations/001_init_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await targetClient.query(schemaSql);
    console.log('✅ Core schema, sequences, indexes, and triggers applied successfully.');

    // If source database provided, migrate existing records
    if (sourceUrl) {
      console.log('\n[3/5] Migrating live records from Source Database to Supabase...');
      const sourceClient = new Client({
        connectionString: sourceUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 15000
      });
      await sourceClient.connect();

      const tables = [
        'users',
        'tickets',
        'ticket_messages',
        'ai_metadata',
        'agent_checklists',
        'weekly_insights'
      ];

      for (const table of tables) {
        const rows = (await sourceClient.query(`SELECT * FROM ${table}`)).rows;
        console.log(`   • Table ${table}: Copying ${rows.length} rows...`);
        for (const row of rows) {
          const keys = Object.keys(row);
          const values = Object.values(row);
          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
          const columns = keys.map(k => `"${k}"`).join(', ');
          const conflictCol = table === 'users' ? 'email' : (table === 'tickets' ? 'ticket_number' : (table === 'ai_metadata' ? 'ticket_id' : (table === 'weekly_insights' ? 'week_identifier' : 'id')));

          const insertSql = `
            INSERT INTO ${table} (${columns})
            VALUES (${placeholders})
            ON CONFLICT (${conflictCol}) DO NOTHING;
          `;
          await targetClient.query(insertSql, values);
        }
      }

      // Sync ticket_number_seq
      try {
        await targetClient.query(`
          SELECT setval('ticket_number_seq', COALESCE((SELECT MAX(NULLIF(regexp_replace(ticket_number, '\\D', '', 'g'), '')::bigint) FROM tickets), 1000) + 1, false);
        `);
        console.log('✅ Synchronized ticket_number_seq with migrated tickets.');
      } catch (err) {
        console.warn('⚠️ Sequence sync notice:', err.message);
      }

      await sourceClient.end();
      console.log('✅ Data migration from source database completed.');
    } else if (seedData) {
      // Apply Seed Data
      console.log('\n[3/5] Inserting initial seed data (Sarah Agent, Alex Customer, tickets)...');
      const seedPath = path.resolve(__dirname, '../database/seeds/001_seed_data.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await targetClient.query(seedSql);
        console.log('✅ Initial seed records inserted successfully.');
      } else {
        console.warn(`⚠️ Seed file not found at ${seedPath}. Skipping seed data.`);
      }
    } else {
      console.log('\n[3/5] Skipping seed data (--no-seed passed).');
    }

    // Verify row counts
    console.log('\n[4/5] Verifying Supabase Database Tables & Records:');
    console.log('-'.repeat(50));
    console.log(String('Table Name').padEnd(25) + String('Row Count').padStart(15));
    console.log('-'.repeat(50));

    const checkTables = [
      'users',
      'tickets',
      'ticket_messages',
      'ai_metadata',
      'agent_checklists',
      'weekly_insights'
    ];

    for (const table of checkTables) {
      const res = await targetClient.query(`SELECT COUNT(*)::int AS count FROM ${table};`);
      const count = res.rows[0].count;
      console.log(table.padEnd(25) + String(count).padStart(15));
    }
    console.log('-'.repeat(50));

    // Next steps
    console.log('\n[5/5] Migration Complete! 🎉');
    console.log('\nNext Steps to Complete Supabase Setup:');
    console.log('  1. In .env (local development):');
    console.log(`     DATABASE_URL="${targetUrl}"`);
    console.log('     DB_SSL=true');
    console.log('\n  2. In Render.com Dashboard (Production Backend Service):');
    console.log('     Add Environment Variable:');
    console.log(`     DATABASE_URL = ${targetUrl}`);
    console.log('     DB_SSL       = true\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await targetClient.end();
  }
}

runMigration();
