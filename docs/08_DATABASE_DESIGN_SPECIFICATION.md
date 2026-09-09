# Module 08: Database Design Specification (PostgreSQL)

---

## 1. Schema Architecture & ER Diagram

```mermaid
erDiagram
    USERS ||--o{ TICKETS : "customer / assigned_agent"
    USERS ||--o{ TICKET_MESSAGES : "sender"
    TICKETS ||--o{ TICKET_MESSAGES : "contains"
    TICKETS ||--o{ AGENT_CHECKLISTS : "has"
    TICKETS ||--|| AI_METADATA : "possesses"

    USERS {
        uuid id PK
        string name
        string email UK
        string password_hash
        string role
        string avatar_url
        timestamp created_at
    }

    TICKETS {
        uuid id PK
        string ticket_number UK
        uuid customer_id FK
        uuid assigned_agent_id FK
        string title
        text description
        string status
        string category
        string priority
        timestamp created_at
    }

    TICKET_MESSAGES {
        uuid id PK
        uuid ticket_id FK
        uuid sender_id FK
        text message_body
        boolean is_internal_note
        timestamp created_at
    }

    AI_METADATA {
        uuid id PK
        uuid ticket_id FK_UK
        string customer_mood
        numeric mood_confidence
        string patience_score
        string predicted_resolution_time
        numeric overall_confidence
        text timeline_summary
        jsonb related_ticket_ids
        timestamp analyzed_at
    }

    AGENT_CHECKLISTS {
        uuid id PK
        uuid ticket_id FK
        string item_text
        boolean is_completed
        timestamp created_at
    }

    WEEKLY_INSIGHTS {
        uuid id PK
        string week_identifier UK
        jsonb top_issues
        jsonb common_mistakes
        jsonb knowledge_gaps
        jsonb recommended_faqs
        timestamp generated_at
    }
```

---

## 2. Database Normalization (3NF)

- **First Normal Form (1NF)**: All attributes contain atomic values. Arrays of related IDs or AI insights use structured JSONB data types rather than unparsed delimited strings.
- **Second Normal Form (2NF)**: All non-key fields depend on the whole primary key (`id`).
- **Third Normal Form (3NF)**: No transitive dependencies exist. AI analytics metadata resides in `ai_metadata` rather than polluting core `tickets` rows.

---

## 3. High Performance Indexing Strategy

1. **`idx_tickets_status_priority` (`tickets(status, priority)`)**: Compound B-tree index enabling high-speed agent ticket queue rendering and sorting.
2. **`idx_tickets_customer_id` (`tickets(customer_id)`)**: Speeds up customer dashboard queries (`WHERE customer_id = $1`).
3. **`idx_ticket_messages_ticket_created` (`ticket_messages(ticket_id, created_at ASC)`)**: Ensures instant threaded messaging retrieval ordered chronologically.
4. **`idx_ai_metadata_ticket_id` (`ai_metadata(ticket_id)`)**: Unique 1:1 join lookup for AI decision drawer data.

---

## 4. Constraint Rules & Data Integrity

- **Foreign Keys**: `ON DELETE CASCADE` applied to ticket messages, checklists, and AI metadata when a parent ticket is removed. `ON DELETE SET NULL` applied to `assigned_agent_id`.
- **Check Constraints**:
  - `users.role IN ('CUSTOMER', 'AGENT', 'ADMIN')`
  - `tickets.status IN ('OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED')`
  - `tickets.priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')`
  - `ai_metadata.customer_mood IN ('HAPPY', 'NEUTRAL', 'FRUSTRATED')`
  - `ai_metadata.patience_score IN ('CALM', 'CONCERNED', 'FRUSTRATED', 'CRITICAL')`
  - `confidence values BETWEEN 0.000 AND 1.000`

---

## 5. Migration & Seed File Reference

- **Migration**: [`database/migrations/001_init_schema.sql`](file:///D:/Projects/SupportSenseAI/database/migrations/001_init_schema.sql)
- **Seed Data**: [`database/seeds/001_seed_data.sql`](file:///D:/Projects/SupportSenseAI/database/seeds/001_seed_data.sql)

---

## 6. Atomic Transactions & Data Integrity (SCRUM-112)

To prevent orphaned tickets or missing message threads, ticket creation is wrapped in a single ACID PostgreSQL transaction in [`ticketModel.js`](file:///D:/Projects/SupportSenseAI/backend/src/models/ticketModel.js) (`createTicketWithInitialMessage`):

```sql
BEGIN;
SELECT nextval('ticket_number_seq') AS ticket_number;
INSERT INTO tickets (ticket_number, customer_id, title, description, category, priority, status)
VALUES ('T-' || nextval, $1, $2, $3, $4, $5, 'OPEN') RETURNING *;
INSERT INTO ticket_messages (ticket_id, sender_id, message_body, is_internal_note)
VALUES ($ticket_id, $customer_id, $description, FALSE) RETURNING *;
COMMIT;
-- If any query fails, ROLLBACK is executed immediately.
```

---

## 7. Sequence Generation & Connection Pooling (SCRUM-110)

1. **Non-Colliding Sequence (`ticket_number_seq`)**:
   - PostgreSQL dedicated sequence ensuring thread-safe, non-colliding ticket numbers (`T-1001`, `T-1002`, ...) even under 100+ concurrent requests.
2. **PostgreSQL Pool Configuration (`db.js`)**:
   - Max 20 concurrent pool clients.
   - 30-second idle connection timeout, 5-second connection acquisition timeout.
   - Tested in [`ticket-concurrency.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-concurrency.test.js).

---

## 8. UPSERT Patterns (AI Metadata & Timeline Summaries)

Both initial triage ingestion and subsequent timeline updates use `ON CONFLICT (ticket_id) DO UPDATE` to ensure idempotent AI operations without duplicate key errors:

```sql
INSERT INTO ai_metadata (
  ticket_id, customer_mood, mood_confidence, patience_score, 
  predicted_resolution_time, overall_confidence, timeline_summary, related_ticket_ids
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (ticket_id) DO UPDATE SET
  customer_mood = EXCLUDED.customer_mood,
  mood_confidence = EXCLUDED.mood_confidence,
  patience_score = EXCLUDED.patience_score,
  predicted_resolution_time = EXCLUDED.predicted_resolution_time,
  overall_confidence = EXCLUDED.overall_confidence,
  timeline_summary = COALESCE(EXCLUDED.timeline_summary, ai_metadata.timeline_summary),
  analyzed_at = CURRENT_TIMESTAMP
RETURNING *;
```

---

## 9. Auto-Migration & Seed Runner (`dbInit.js`)

On server startup, [`dbInit.js`](file:///D:/Projects/SupportSenseAI/backend/src/config/dbInit.js) inspects the `information_schema.tables` for the `users` table:
- If absent (e.g. initial deployment or fresh local container), it automatically executes `database/migrations/001_init_schema.sql` followed by `database/seeds/001_seed_data.sql`.
- Provides zero-touch automated database bootstrapping in Docker, Render, and Supabase environments.

---

## 10. Supabase Managed PostgreSQL Migration & Cloud Architecture

SupportSense AI migrates from Render's ephemeral PostgreSQL to **Supabase** for enterprise reliability, high persistence, zero-expiration storage, and built-in connection pooling:

### 10.1 Why Supabase Over Render Free Tier
1. **No 30-Day Expiration**: Render free PostgreSQL instances are automatically spun down and deleted after 30 days. Supabase provides persistent, long-term cloud storage.
2. **Native Connection Pooler (Supavisor)**: Supabase provides a dedicated PgBouncer/Supavisor transaction pooler on port `6543`, supporting hundreds of concurrent API clients without exhausting PostgreSQL connection limits.
3. **Enterprise SSL Encryption**: Supabase enforces SSL encryption on all incoming connections, eliminating plaintext risk over the public internet.

### 10.2 Supabase Connection Topologies
```
[ Express Backend on Render ]
          |
          |  Encrypted SSL (Port 6543 / 5432)
          v
[ Supabase Cloud (AWS Infrastructure) ]
          |
          +---> [ Supavisor Transaction Pooler (:6543) ] ---> [ PostgreSQL 15 Engine ]
          |
          +---> [ Direct Session Connection (:5432) ]     ---> [ PostgreSQL 15 Engine ]
```

- **Transaction Pooler (Port 6543 - Recommended for Production API)**:
  `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
- **Direct Connection (Port 5432 - For Schema Migrations)**:
  `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 10.3 Automated Migration Script (`scripts/migrate_to_supabase.js`)
A dedicated Node.js migration CLI is provided at [`scripts/migrate_to_supabase.js`](file:///D:/Projects/SupportSenseAI/scripts/migrate_to_supabase.js):

```bash
# 1. Initialize fresh Supabase database with schema & seed accounts:
node scripts/migrate_to_supabase.js "postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# 2. Or migrate live records directly from Render to Supabase:
node scripts/migrate_to_supabase.js \
  --source "postgresql://supportsense_user:[RENDER_PASS]@[RENDER_HOST]/supportsense_db" \
  --target "postgresql://postgres.[REF]:[SUPABASE_PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

The script verifies SSL connectivity, applies [`001_init_schema.sql`](file:///D:/Projects/SupportSenseAI/database/migrations/001_init_schema.sql), copies data rows across all 6 tables in dependency order, synchronizes the `ticket_number_seq` sequence, and outputs row count verification telemetry.

