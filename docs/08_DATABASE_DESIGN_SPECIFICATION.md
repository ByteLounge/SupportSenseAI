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
