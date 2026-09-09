# Module 04: System Architecture & API Specifications

---

## 15. System Architecture

SupportSense AI follows a modern, decoupled **3-Tier Micro-Architecture**:

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|                  React 18 + Vite SPA + Tailwind CSS + Axios                       |
+------------------------------------+----------------------------------------------+
                                     |  HTTP REST (JWT Auth)
                                     v
+-----------------------------------------------------------------------------------+
|                               APPLICATION TIER                                    |
|                       Node.js + Express REST API Server                           |
|      (Auth, Ticket Routing, Business Logic, Analytics Engine, RBAC)                |
+------------------+----------------------------------+-----------------------------+
                   |                                  |
   SQL Queries     |                                  | HTTP Internal REST
                   v                                  v
+------------------+-------------------+  +-----------+-----------------------------+
|          DATABASE TIER               |  |              AI TIER                    |
|        PostgreSQL 15 DB              |  |    Python FastAPI AI Microservice           |
| (Tickets, Users, Messages, Insights) |  | (Google Gemini SDK, Prompt Orchestration)   |
+--------------------------------------+  +--------------------+------------------------+
                                                               | HTTPS
                                                               v
                                                  +------------+------------------------+
                                                  |      Google Gemini 1.5 API         |
                                                  +-------------------------------------+
```

---

## 16. Component Diagram

```mermaid
graph TB
    subgraph "Frontend Container (React 18 + Vite SPA)"
        UI[React SPA Views]
        AI_WIDGETS[AI Widgets: Concierge, Tone Checker, Timeline Banner, Quality Modal, Mood Badges]
        AUTH_CTX[Auth & Theme Context Providers]
        AX[Axios Client Layer + Smart Mock Fallbacks]
        UI --> AI_WIDGETS
        UI --> AUTH_CTX
        AI_WIDGETS --> AX
        UI --> AX
    end

    subgraph "Backend Core Service (Node.js/Express)"
        API[Express Router]
        AUTH[Auth Controller & JWT Guard]
        TICK[Ticket Controller & State Machine]
        AI_GATE[AI Proxy Controller]
        ASYNC_WORKER[Async Fire-and-Forget Timeline Worker]
        DB_MOD[PostgreSQL Pool / pg Client]

        AX -->|Bearer Token| API
        API --> AUTH
        API --> TICK
        API --> AI_GATE
        TICK --> AI_GATE
        TICK --> DB_MOD
        TICK --> ASYNC_WORKER
        ASYNC_WORKER --> AI_GATE
        ASYNC_WORKER --> DB_MOD
    end

    subgraph "AI Microservice (Python FastAPI)"
        FAST[FastAPI Server & Async Router]
        POOL_CACHE[Model Instance Pooling & TTL Response Cache]
        PROMPT[Role-Based Prompt Pipeline]
        CONCIERGE_SVC[AI Concierge & Tone Polish Service]
        TRIAGE_SVC[Triage & Timeline Summary Service]
        AUTO_REP[Department Auto-Reply Engine]
        DATASET[Dataset Service & Benchmarks]
        PARSER[Pydantic JSON Validation Schemas]

        AI_GATE -->|REST POST JSON| FAST
        FAST --> POOL_CACHE
        POOL_CACHE --> PROMPT
        PROMPT --> CONCIERGE_SVC
        PROMPT --> TRIAGE_SVC
        PROMPT --> AUTO_REP
        DATASET --> PROMPT
        CONCIERGE_SVC --> PARSER
        TRIAGE_SVC --> PARSER
        AUTO_REP --> PARSER
    end

    subgraph "Database & Cloud Providers"
        PG[(PostgreSQL 15 Database)]
        GEMINI[Google Gemini 1.5 Flash LLM]
        KAGGLE[(Kaggle Historical CSVs)]
        HF[(HuggingFace Streaming API)]

        DB_MOD --> PG
        PARSER --> GEMINI
        DATASET --> KAGGLE
        DATASET --> HF
    end
```

---

## 17. Database ER Diagram

```mermaid
erDiagram
    USERS ||--o{ TICKETS : "creates / handles"
    TICKETS ||--o{ TICKET_MESSAGES : "contains"
    TICKETS ||--o{ AGENT_CHECKLISTS : "has"
    TICKETS ||--o{ AI_METADATA : "possesses"
    USERS ||--o{ WEEKLY_INSIGHTS : "generates/reviews"

    USERS {
        uuid id PK
        string name
        string email
        string password_hash
        string role "CUSTOMER | AGENT | ADMIN"
        timestamp created_at
    }

    TICKETS {
        uuid id PK
        string ticket_number
        uuid customer_id FK
        uuid assigned_agent_id FK
        string title
        text description
        string status "OPEN | IN_PROGRESS | PENDING | RESOLVED | CLOSED"
        string category
        string priority "LOW | MEDIUM | HIGH | URGENT"
        timestamp created_at
        timestamp updated_at
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
        uuid ticket_id FK
        string customer_mood "HAPPY | NEUTRAL | FRUSTRATED"
        float mood_confidence
        string patience_score "CALM | CONCERNED | FRUSTRATED | CRITICAL"
        string predicted_resolution_time
        float overall_confidence
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
        string week_identifier
        jsonb top_issues
        jsonb common_mistakes
        jsonb knowledge_gaps
        jsonb recommended_faqs
        timestamp generated_at
    }
```

---

## 18. Sequence Diagrams

### Sequence 1: Transactional Ticket Creation & Department Auto-Reply Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as PostgreSQL DB
    participant AI as FastAPI Microservice
    participant GEM as Google Gemini API

    Customer->>FE: Fills Ticket Form & Submits (or dispatches via AI Concierge)
    FE->>BE: POST /api/v1/tickets
    BE->>DB: BEGIN TRANSACTION (createTicketWithInitialMessage)
    BE->>DB: INSERT into tickets (status='OPEN') & ticket_messages (initial)
    DB-->>BE: COMMIT TRANSACTION (Ticket T-1042 + Initial Message Created)

    BE->>AI: POST /api/v1/ai/triage { title, description }
    AI->>GEM: Prompt Gemini 1.5 Flash with Role Persona & Benchmarks
    GEM-->>AI: Returns Structured Triage JSON Payload
    AI-->>BE: Returns Triage Metadata + Checklists

    BE->>AI: POST /api/v1/ai/department-auto-reply { title, description, category }
    AI->>GEM: Evaluate Auto-Reply Qualification
    GEM-->>AI: Returns Auto-Reply Body & Actions Triggered
    AI-->>BE: Returns Auto-Reply Decision

    alt Auto-Reply Qualified (Confidence >= 75%)
        BE->>DB: INSERT automated response into ticket_messages
    end

    BE->>DB: INSERT / UPSERT into ai_metadata & agent_checklists
    BE-->>FE: HTTP 201 Created (Ticket + AI Assist Payload)
    FE-->>Customer: Render Success + Redirect to Ticket Detail
```

### Sequence 2: Reopened Ticket & Async Timeline Summary Flow

```mermaid
sequenceDiagram
    autonumber
    actor Agent
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as PostgreSQL DB
    participant AI as FastAPI Microservice
    participant GEM as Google Gemini API

    Agent->>FE: Updates Status from RESOLVED to OPEN
    FE->>BE: PATCH /api/v1/tickets/:id/status { status: 'OPEN' }
    BE->>BE: Validate Transition (ALLOWED_STATUS_TRANSITIONS: RESOLVED -> OPEN)
    BE->>DB: UPDATE tickets SET status = 'OPEN', updated_at = NOW()
    DB-->>BE: Updated Ticket Record
    BE-->>FE: HTTP 200 OK (Immediate non-blocking response to agent)

    Note over BE,AI: Async Fire-and-Forget Timeline Summarizer Worker
    BE-)AI: POST /api/v1/ai/summarize-timeline { messages }
    AI-)GEM: Prompt Gemini with TIMELINE_SUMMARIZER_ROLE_PROMPT
    GEM-)AI: Return 5-6 Bullet Executive Summary JSON
    AI-)BE: Return Timeline Summary Payload
    BE-)DB: UPSERT ai_metadata (ticket_id, timeline_summary)
    FE->>BE: GET /api/v1/tickets/:id (Displays TimelineSummaryBanner)
```

---

## 19. API Documentation

### 19.1 Core Backend APIs (`Express REST`)

#### Auth APIs (`/api/v1/auth`)
- `POST /register`: Register new account (self-registration strictly enforces `CUSTOMER` role).
- `POST /login`: Authenticate credentials and receive signed JWT token.
- `GET /me`: Get current authenticated user profile.
- `GET /users`: List all registered users (Admin only).
- `PATCH /users/:id/role`: Update user role (Admin only).

#### Ticket APIs (`/api/v1/tickets`)
- `GET /`: List tickets with filters (`status`, `priority`, `category`, `search`).
- `POST /`: Submit new ticket atomically with its initial message (triggers AI triage & department auto-reply).
- `GET /:id`: Fetch single ticket with messages, checklist, and AI metadata.
- `PATCH /:id/status`: Enforce status transitions (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED` or `OPEN`). Reopening triggers async timeline summarizer.
- `POST /:id/forward`: Forward ticket to department with agent comments and internal note.
- `PATCH /:id`: Modify ticket attributes (Admin/Agent escalation override).
- `DELETE /:id`: Delete / Archive ticket record (Admin only).
- `POST /:id/messages`: Post customer reply, agent public message, or internal note.
- `PATCH /:id/checklist/:itemId`: Toggle checklist item completion state.

#### AI Proxy APIs (`/api/v1/ai`)
- `POST /concierge`: AI Concierge Chatbot & Formal Ticket Crafter (accessible to all authenticated roles).
- `POST /polish-tone`: 1-Click AI Response Tone Polishing (`empathetic`, `concise`, `formal`, `technical` — Agent/Admin).
- `POST /verify-response`: Evaluates agent draft reply for Professionalism, Empathy, Clarity, Actionability (Agent/Admin).
- `POST /department-auto-reply`: Evaluates auto-reply eligibility and generates department confirmation (Agent/Admin).
- `GET /departments`: Returns department definitions, handled categories, and active auto-reply rules (Agent/Admin).
- `GET /benchmarks`: Returns historical category SLA duration and priority benchmarks (Agent/Admin).
- `GET /insights`: Fetches weekly AI analytics, top repeated issues, and recommended FAQs (Agent/Admin).

### 19.2 AI Microservice APIs (`FastAPI REST`)

- `POST /api/v1/ai/triage`: Auto-classifies category, priority, mood, patience score, resolution duration, and generates checklist.
- `POST /api/v1/ai/department-auto-reply`: Evaluates category qualification per department and generates automated confirmation message.
- `POST /api/v1/ai/verify-response`: Evaluates pre-send agent response quality and empathy against ticket context.
- `POST /api/v1/ai/summarize-timeline`: Condenses multi-turn message history into a 5-6 bullet executive summary.
- `GET /api/v1/ai/insights`: Returns weekly organizational learning insights and FAQ suggestions.
- `GET /api/v1/ai/datasets/benchmark-metrics`: Returns benchmark resolution metrics derived from Kaggle & Hugging Face datasets.
- `GET /api/v1/ai/datasets/stream-sample`: Streams live sample records from Hugging Face customer support dataset.
- `GET /api/v1/ai/departments/definitions`: Returns configured support departments, categories, and auto-reply policies.
- `POST /api/v1/ai/concierge/chat`: Conversational AI Concierge that accepts natural language queries and crafts enterprise ticket drafts.
- `POST /api/v1/ai/polish-tone`: 1-Click tone polisher rewriting draft responses into Empathetic, Concise, Formal, or Technical styles.

---

## 20. Security Architecture & Resiliency Specifications

1. **Role Sanitization (Anti-Privilege Escalation)**: Public registration at `/api/v1/auth/register` explicitly sanitizes input role parameters, forcing self-registered users to `CUSTOMER`.
2. **CORS Origin Filtering**: Express and FastAPI enforce explicit origin whitelisting (`ALLOWED_ORIGINS`) to protect Bearer JWT headers and eliminate wildcard `*` credential risks.
3. **Microservice Timeout Resiliency**: All inter-service REST calls from Express backend to FastAPI microservice enforce 5-second HTTP request timeouts using `AbortSignal.timeout(5000)` with graceful HITL fallbacks.
4. **Model Instance Pooling & In-Memory TTL Cache**: The AI microservice pools `GenerativeModel` instances and caches responses for 300 seconds using SHA256 hashes, delivering sub-millisecond responses for identical queries.
5. **Database Transactional Integrity & Concurrency**: Atomic ticket creation (`createTicketWithInitialMessage`) and connection pooling (20 max clients) guarantee consistency and collision-free sequence numbers under load.
6. **Production Observability**: Configured for structured JSON log formatting when `NODE_ENV=production` alongside detailed system uptime and memory health telemetry `/health`.
