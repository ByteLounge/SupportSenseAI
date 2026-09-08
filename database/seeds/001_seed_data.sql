-- ============================================================================
-- SupportSense AI — Database Seed Data Script
-- Script: 001_seed_data.sql
-- Description: Inserts test users, tickets, AI metadata, checklists & insights
-- Lead Engineer: Member 2 & Member 4
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED USERS (Passwords hashed using bcrypt for 'Password123!')
-- ----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, avatar_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin@supportsense.ai', '$2a$10$I8VaAVy7Jkqg87tXPHyRCe3tA2aXgFHiGwPZa9if1WaJ34HVBeD7m', 'ADMIN', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Sarah Agent', 'agent.sarah@supportsense.ai', '$2a$10$I8VaAVy7Jkqg87tXPHyRCe3tA2aXgFHiGwPZa9if1WaJ34HVBeD7m', 'AGENT', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Alex Rivera', 'alex.rivera@customer.com', '$2a$10$I8VaAVy7Jkqg87tXPHyRCe3tA2aXgFHiGwPZa9if1WaJ34HVBeD7m', 'CUSTOMER', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex')
ON CONFLICT (email) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. SEED TICKETS
-- ----------------------------------------------------------------------------
INSERT INTO tickets (id, ticket_number, customer_id, assigned_agent_id, title, description, status, category, priority) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'T-1042', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
 'Double charged on annual subscription renewal', 
 'Hello support, I was charged twice on my credit card for the annual enterprise subscription upgrade yesterday. Card ending in 4921 charged $1,200 twice! Please refund the duplicate charge immediately as this is affecting my company budget.', 
 'IN_PROGRESS', 'Billing', 'URGENT')
ON CONFLICT (ticket_number) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. SEED TICKET MESSAGES
-- ----------------------------------------------------------------------------
INSERT INTO ticket_messages (id, ticket_id, sender_id, message_body, is_internal_note) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 
 'Hello support, I was charged twice on my credit card for the annual enterprise subscription upgrade yesterday. Card ending in 4921 charged $1,200 twice! Please refund the duplicate charge immediately as this is affecting my company budget.', FALSE),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
 'Internal Note: Verified Stripe transaction logs. Found duplicate charge ID ch_3N9x821a. Initiated $1,200 refund via payment portal.', TRUE);

-- ----------------------------------------------------------------------------
-- 4. SEED AI METADATA
-- ----------------------------------------------------------------------------
INSERT INTO ai_metadata (id, ticket_id, customer_mood, mood_confidence, patience_score, predicted_resolution_time, overall_confidence, timeline_summary) VALUES
('00eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 
 'FRUSTRATED', 0.945, 'CRITICAL', '1-2 business days', 0.920,
 '• Customer reported duplicate charge of $1,200 on card ending 4921.\n• Expressed strong frustration regarding budget impact.\n• Agent Sarah verified Stripe logs and identified duplicate transaction ch_3N9x821a.\n• Refund process initiated in internal billing system.')
ON CONFLICT (ticket_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. SEED AGENT CHECKLIST
-- ----------------------------------------------------------------------------
INSERT INTO agent_checklists (id, ticket_id, item_text, is_completed) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Verify Stripe Payment Gateway transaction logs for duplicate IDs', TRUE),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Issue $1,200 refund via payment admin portal', TRUE),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a00', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Send polite apology email with bank processing timeline (3-5 days)', FALSE);

-- ----------------------------------------------------------------------------
-- 6. SEED WEEKLY INSIGHTS
-- ----------------------------------------------------------------------------
INSERT INTO weekly_insights (id, week_identifier, top_issues, common_mistakes, knowledge_gaps, recommended_faqs) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', '2026-W31', 
 '[{"issue": "Duplicate subscription charges", "count": 14}, {"issue": "API JWT Token expiration", "count": 9}]'::jsonb,
 '[{"mistake": "Agents forgetting to mention bank processing times on refunds", "frequency": 6}]'::jsonb,
 '[{"gap": "Lack of clear self-serve refund portal documentation for customers"}]'::jsonb,
 '[{"question": "How long do credit card refunds take to reflect in my bank account?", "suggested_answer": "Refunds typically process within 3-5 business days depending on your financial institution."}]'::jsonb)
ON CONFLICT (week_identifier) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. SYNCHRONIZE TICKET NUMBER SEQUENCE
-- Ensures generated ticket numbers continue after seeded tickets.
-- ----------------------------------------------------------------------------
SELECT setval(
    'ticket_number_seq',
    COALESCE(
        (
            SELECT MAX(
                CAST(SUBSTRING(ticket_number FROM 3) AS INTEGER)
            )
            FROM tickets
            WHERE ticket_number LIKE 'T-%'
        ),
        1000
    ),
    true
);