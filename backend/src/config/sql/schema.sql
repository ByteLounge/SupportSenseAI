-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'AGENT', 'ADMIN')),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TICKETS TABLE
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED')),
    category VARCHAR(50) DEFAULT 'General',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TICKET_MESSAGES TABLE
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_body TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AI_METADATA TABLE
CREATE TABLE IF NOT EXISTS ai_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID UNIQUE NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    customer_mood VARCHAR(20) CHECK (customer_mood IN ('HAPPY', 'NEUTRAL', 'FRUSTRATED')),
    mood_confidence NUMERIC(4, 3) CHECK (mood_confidence BETWEEN 0.000 AND 1.000),
    patience_score VARCHAR(20) CHECK (patience_score IN ('CALM', 'CONCERNED', 'FRUSTRATED', 'CRITICAL')),
    predicted_resolution_time VARCHAR(50),
    overall_confidence NUMERIC(4, 3) CHECK (overall_confidence BETWEEN 0.000 AND 1.000),
    timeline_summary TEXT,
    related_ticket_ids JSONB DEFAULT '[]'::jsonb,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. AGENT_CHECKLISTS TABLE
CREATE TABLE IF NOT EXISTS agent_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    item_text VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. WEEKLY_INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS weekly_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_identifier VARCHAR(20) UNIQUE NOT NULL,
    top_issues JSONB DEFAULT '[]'::jsonb,
    common_mistakes JSONB DEFAULT '[]'::jsonb,
    knowledge_gaps JSONB DEFAULT '[]'::jsonb,
    recommended_faqs JSONB DEFAULT '[]'::jsonb,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tickets_status_priority ON tickets (status, priority);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets (customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_agent ON tickets (assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_created ON ticket_messages (ticket_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ai_metadata_ticket_id ON ai_metadata (ticket_id);
CREATE INDEX IF NOT EXISTS idx_agent_checklists_ticket_id ON agent_checklists (ticket_id);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE OR REPLACE TRIGGER update_tickets_modtime
    BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE OR REPLACE TRIGGER update_checklists_modtime
    BEFORE UPDATE ON agent_checklists
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
