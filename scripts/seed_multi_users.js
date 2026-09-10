const db = require('../backend/src/config/db');
const hash = '$2a$10$FBLhHX7RCAJ1XUbATW0WNu058jal/0iNztj6Lyrq1ZIawJQyukZyG'; // Password123!

async function seed() {
  const users = [
    ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin@supportsense.ai', hash, 'ADMIN', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', 'Operations & Governance'],
    ['b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Sarah Agent', 'agent.sarah@supportsense.ai', hash, 'AGENT', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'Tier 1 Support & AI Triage'],
    ['c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Alex Rivera', 'alex.rivera@customer.com', hash, 'CUSTOMER', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 'Acme Corp'],
    ['c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Samantha Reed', 'samantha.reed@globex.com', hash, 'CUSTOMER', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha', 'Globex Systems'],
    ['c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'David Kim', 'david.kim@nexus.io', hash, 'CUSTOMER', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', 'Nexus Technologies'],
    ['b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Elena Rostova', 'elena.r@supportsense.ai', hash, 'AGENT', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', 'Finance & Billing'],
    ['b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Marcus Vance', 'marcus.vance@supportsense.ai', hash, 'AGENT', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', 'Technical Support'],
    ['b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Liam Scott', 'liam.scott@supportsense.ai', hash, 'AGENT', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam', 'Identity & Access'],
    ['b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Priya Sharma', 'priya.sharma@supportsense.ai', hash, 'AGENT', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', 'API Platform Team']
  ];

  for (const u of users) {
    await db.query(`
      INSERT INTO users (id, name, email, password_hash, role, avatar_url, department)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role,
          avatar_url = EXCLUDED.avatar_url,
          department = EXCLUDED.department;
    `, u);
  }
  console.log('Seeded ' + users.length + ' users successfully');

  // Seed resolved ticket for Alex Rivera
  await db.query(`
    INSERT INTO tickets (id, ticket_number, customer_id, assigned_agent_id, title, description, status, category, priority)
    VALUES (
      'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10',
      'T-1040',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
      'Cannot download EU VAT invoice from billing portal',
      'Customer requested help downloading certified VAT invoice for tax filing.',
      'RESOLVED',
      'Billing',
      'MEDIUM'
    )
    ON CONFLICT (ticket_number) DO NOTHING;
  `);

  // Seed message with resolution
  await db.query(`
    INSERT INTO ticket_messages (id, ticket_id, sender_id, message_body, is_internal_note)
    VALUES (
      'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a10',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
      'Resolution: Generated and uploaded the certified EU VAT invoice PDF to customer portal. Customer confirmed receipt.',
      FALSE
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  // Seed resolved ticket for Samantha Reed
  await db.query(`
    INSERT INTO tickets (id, ticket_number, customer_id, assigned_agent_id, title, description, status, category, priority)
    VALUES (
      'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
      'T-1041',
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
      'Okta SAML 2.0 metadata certificate rotation assistance',
      'Need guidance rotating expiring X.509 cert in SSO settings.',
      'RESOLVED',
      'Account',
      'HIGH'
    )
    ON CONFLICT (ticket_number) DO NOTHING;
  `);

  await db.query(`
    INSERT INTO ticket_messages (id, ticket_id, sender_id, message_body, is_internal_note)
    VALUES (
      'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
      'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
      'Resolution: Updated Azure/Okta SAML 2.0 metadata XML and renewed signing certificate. Verified login handshake.',
      FALSE
    )
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log('Seeded resolved tickets T-1040 and T-1041');
}

seed().then(() => {
  console.log('Seed completed successfully');
  process.exit(0);
}).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
