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
    subgraph "Frontend Container (React)"
        UI[React SPA]
        RQ[React Query Cache]
        AX[Axios Client Layer]
        UI --> RQ
        RQ --> AX
    end

    subgraph "Backend Core Service (Node.js/Express)"
        API[Express Router]
        AUTH[Auth Controller & JWT Guard]
        TICK[Ticket Controller]
        AI_GATE[AI Proxy Service]
        DB_MOD[PostgreSQL Pool / Knex/Prisma]

        AX -->|Bearer Token| API
        API --> AUTH
        API --> TICK
        TICK --> AI_GATE
        TICK --> DB_MOD
    end

    subgraph "AI Microservice (FastAPI)"
        FAST[FastAPI Server]
        PROMPT[Prompt Pipeline]
        PARSER[Pydantic JSON Parser]

        AI_GATE -->|REST POST JSON| FAST
        FAST --> PROMPT
        PROMPT --> PARSER
    end

    subgraph "External Cloud Services"
        PG[(PostgreSQL Database)]
        GEMINI[Google Gemini API]

        DB_MOD --> PG
        PARSER --> GEMINI
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

### Sequence: Ticket Creation & AI Auto-Triage Flow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant FE as React Frontend
    participant BE as Express Backend
    participant DB as PostgreSQL DB
    participant AI as FastAPI Microservice
    participant GEM as Google Gemini API

    Customer->>FE: Fills Ticket Form & Submits
    FE->>BE: POST /api/v1/tickets
    BE->>DB: INSERT into tickets (status='OPEN')
    DB-->>BE: Ticket Created (ID: T-1001)

    BE->>AI: POST /api/v1/ai/triage { title, description }
    AI->>GEM: Prompt Gemini for Triage & Checklist JSON
    GEM-->>AI: Returns Structured JSON Payload
    AI-->>BE: Returns Triage Metadata + Confidence Score

    BE->>DB: INSERT into ai_metadata & agent_checklists
    BE-->>FE: HTTP 201 Created (Ticket + AI Assist Payload)
    FE-->>Customer: Render Success + Ticket View
```

---

## 19. API Documentation

### 19.1 Core Backend APIs (`Express REST`)

#### Auth APIs
- `POST /api/v1/auth/register`: Register new Customer/Agent.
- `POST /api/v1/auth/login`: Authenticate and receive JWT access token.
- `GET /api/v1/auth/me`: Get current user profile.

#### Ticket APIs
- `GET /api/v1/tickets`: List tickets with filters (`status`, `priority`, `mood`, `search`).
- `POST /api/v1/tickets`: Create a new ticket (triggers automatic AI triage).
- `GET /api/v1/tickets/:id`: Fetch single ticket with messages, checklist, and AI metadata.
- `PATCH /api/v1/tickets/:id/status`: Update status (e.g. resolve/reopen). Reopening triggers AI summary.
- `POST /api/v1/tickets/:id/messages`: Post message or internal note.
- `PATCH /api/v1/tickets/:id/checklist/:itemId`: Toggle checklist item state.

### 19.2 AI Microservice APIs (`FastAPI REST`)

- `POST /api/v1/ai/triage`: Auto-classifies category, priority, mood, patience score, resolution estimate, and generates checklist.
- `POST /api/v1/ai/verify-response`: Evaluates agent draft reply for professionalism, empathy, clarity, actionability.
- `POST /api/v1/ai/summarize-timeline`: Generates 5-6 bullet history summary for reopened/reassigned tickets.
- `POST /api/v1/ai/generate-weekly-insights`: Aggregates weekly ticket logs to produce top issues and FAQ recommendations.

---

## 20. Security Architecture & Resiliency Specifications

1. **Role Sanitization (Anti-Privilege Escalation)**: Public registration at `/api/v1/auth/register` explicitly sanitizes input role parameters, forcing self-registered users to `CUSTOMER`.
2. **CORS Origin Filtering**: Express and FastAPI enforce explicit origin whitelisting (`ALLOWED_ORIGINS`) to protect Bearer JWT headers and eliminate wildcard `*` credential risks.
3. **Microservice Timeout Resiliency**: All inter-service REST calls from Express backend to FastAPI microservice enforce 5-second HTTP request timeouts using `AbortSignal.timeout(5000)` with graceful HITL fallbacks.
4. **Production Observability**: Configured for structured JSON log formatting when `NODE_ENV=production` alongside detailed system uptime and memory health telemetry `/health`.
