# 🚀 SupportSense AI — Enterprise Customer Support Ticket System

> **An AI-Assisted Customer Support Ecosystem featuring Real-Time Triage, Sentiment Monitoring, Resolution Forecasting, Response Verification, Dataset-Grounded Benchmarks, and Department-Specific Automated Replies.**

[![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%7C_Express-339933?logo=node.js)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/AI_Microservice-Python_%7C_FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_15-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/LLM-Google_Gemini_1.5_Flash-8E44AD?logo=google)](https://ai.google.dev/)
[![HuggingFace](https://img.shields.io/badge/Datasets-Kaggle_%7C_HuggingFace_Streaming-FFD21E?logo=huggingface)](https://huggingface.co/)
[![Docker](https://img.shields.io/badge/Deployment-Docker_Compose_%7C_Render-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Table of Contents

- [Executive Summary & Vision](#-executive-summary--vision)
- [Human-in-the-Loop (HITL) Paradigm](#-human-in-the-loop-hitl-paradigm)
- [Novel Enterprise Features](#-novel-enterprise-features)
- [Dataset-Grounded Benchmarks & Streaming](#-dataset-grounded-benchmarks--streaming)
- [Specialized Role-Based System Prompts](#-specialized-role-based-system-prompts)
- [Department Automated Response System](#-department-automated-response-system)
- [System Architecture & Diagrams](#-system-architecture--diagrams)
  - [3-Tier Architecture](#3-tier-architecture)
  - [Component Diagram](#component-diagram)
  - [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
  - [Ticket Creation & AI Triage Sequence](#ticket-creation--ai-triage-sequence)
- [Technology Stack](#-technology-stack)
- [Repository Folder Structure](#-repository-folder-structure)
- [API Documentation Reference](#-api-documentation-reference)
- [Quickstart & Local Setup](#-quickstart--local-setup)
- [1-Click Cloud Deployment (Render)](#-1-click-cloud-deployment-render)
- [Environment Variables Blueprint](#-environment-variables-blueprint)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Team Composition & Credits](#-team-composition--credits)

---

## 🌟 Executive Summary & Vision

**SupportSense AI** is an enterprise-grade AI-assisted customer support ticketing system engineered specifically for high-throughput enterprise environments. The system empowers human support specialists by offloading repetitive triage, analyzing customer sentiment in real time, predicting resolution timeframes grounded in historical datasets, verifying response quality before dispatch, automating safe department confirmations, and converting closed tickets into institutional knowledge.

### Strategic Business Impact
* ⚡ **Reduce First Response Time (FRT)** by up to **75%** via instant automated department confirmation replies and rapid classification.
* 🎯 **Elevate First Contact Resolution (FCR)** by supplying agents with context-aware timeline summaries, dataset benchmarks, and verified checklists.
* 💖 **Improve Customer Satisfaction (CSAT)** through AI Response Quality Checks (verifying empathy, clarity, and professionalism prior to sending replies).
* 🛡️ **Prevent Agent Burnout** by tracking customer patience degradation early so team leads can proactively reassign critical escalations.
* 📈 **Continuous Organizational Learning** via weekly AI Learning Insights that aggregate recurring friction points and recommend Knowledge Base FAQs.

---

## 🤝 Human-in-the-Loop (HITL) Paradigm

> [!IMPORTANT]
> **Core Principle: AI ASSISTS, HUMANS DECIDE.**
> SupportSense AI operates strictly under an **Human-in-the-Loop (HITL)** framework. Automated replies are bounded by safe, non-destructive confirmation protocols and confidence thresholds. Every complex resolution, manual draft evaluation, patience score, and checklist item serves as intelligent decision-support for human agents.

---

## 🔥 Novel Enterprise Features

1. **AI Concierge Chatbot & Conversational Ticket Crafter**: Interactive assistant widget allowing customers and agents to describe issues in natural, everyday language. Automatically performs empathetic diagnosis, answers questions, and generates a structured enterprise ticket specification ready for 1-click dispatch.
2. **1-Click AI Response Tone Polishing (3-Variation Cycling)**: Multi-style tone transformer for support agents offering 1-click rewrites into **Empathetic**, **Concise**, **Formal**, or **Technical** styles with 3 distinct rephrasing variations (`v1`, `v2`, `v3`) without nesting or repetitive salutations.
3. **Duplicate Resolved Ticket Interception (SSAI-409)**: Proactively intercepts incoming tickets if an identical or similar issue has already been resolved for the customer (`HTTP 409 DUPLICATE_RESOLVED_TICKET`). Displays previous verified resolution notes and allows customer override (`forceCreate: true`) if the issue still persists.
4. **Automatic Ticket Linking for Follow-up Inquiries (SSAI-409)**: Seamlessly links follow-up queries from the same user to their existing active ticket thread (`linked_ticket_id`), maintaining ticket history and preventing queue fragmentation.
5. **Real-Time Knowledge Base FAQ Integration & Ticket Deflection (SSAI-410)**: Scans domain FAQs in real time as the customer drafts their inquiry in the form or concierge chat, providing instant verified answers to deflect unnecessary tickets.
6. **Anti-Gaming Mood & Urgency AI Prompting**: Decouples customer emotion or shouting ("URGENT", "EMERGENCY", exclamation marks) from technical SLA priority. Captures emotional distress in `customer_mood` while evaluating `priority` strictly by objective business impact.
7. **AI Mood Indicator & Sentiment Score**: Real-time customer emotion categorization (`🙂 HAPPY`, `😐 NEUTRAL`, `😠 FRUSTRATED`) paired with confidence metrics (`0.00` to `1.00`).
8. **Customer Patience Score & SLA Guardrail**: Tracks customer frustration levels (`CALM`, `CONCERNED`, `FRUSTRATED`, `CRITICAL`) to guide tone and trigger supervisor escalation warnings.
9. **Dataset-Grounded Resolution Predictor**: Forecasts estimated completion timeframes (e.g., *"1–2 business days"*) calibrated against historical Kaggle & Hugging Face support benchmarks.
10. **Dynamic Agent Assist Checklists**: Auto-generates step-by-step action items tailored to the specific problem (e.g., `[ ] Verify Stripe payment logs`, `[ ] Issue $1,200 refund`, `[ ] Send apology email`).
11. **Department Automated Replies & Multi-Department Routing**: Evaluates category qualification across 4 core departments (`Technical Support`, `Finance & Billing`, `Identity & Access`, `API Platform`) to dispatch immediate confirmations and route tickets to specialized agents.
12. **Response Quality & Empathy Checker**: Pre-send reply evaluation scoring agent drafts for **Professionalism**, **Empathy**, **Clarity**, and **Actionability** with instant correction hints.
13. **Reopened Ticket Timeline Summarizer & Banner**: Condenses lengthy, multi-agent thread histories into a 5-6 bullet executive summary via an asynchronous fire-and-forget worker upon reopening (`RESOLVED` ➔ `OPEN`), rendered as a prominent TL;DR banner.
14. **Transactional Ticket & Message Creation (SCRUM-112)**: Atomic PostgreSQL transaction wrapping ticket record and initial customer message to guarantee database consistency.
15. **Enforced Status Transition Validation (SCRUM-111)**: Strict state machine enforcing valid progression (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED` or `OPEN`), rejecting illegal state skips.
16. **Weekly Organizational Learning Insights**: Analyzes historical ticket resolution patterns to generate top repeated issues, recurring agent mistakes, and suggested Knowledge Base FAQs.

---

## 📊 Dataset-Grounded Benchmarks & Streaming

SupportSense AI connects directly to open-source customer support datasets to ground Gemini's reasoning in historical metrics rather than static guesses:

| Dataset | Source / Type | Role in SupportSense AI |
| :--- | :--- | :--- |
| **Customer Support Ticket Dataset** | Kaggle (`customer_support_tickets.csv`) | Historical SLA resolution durations, priority distributions, and realistic few-shot examples. |
| **Customer Support on Twitter (TWCS)** | Kaggle (`twcs.csv` & `sample.csv`) | Real-world multi-turn conversational tone, brand de-escalation patterns, and phrasing. |
| **Bitext Customer Support Dataset** | Hugging Face (`streaming=True`) | Intent & category classification calibration for enterprise billing and account requests. |
| **Google GoEmotions & SAMSum** | Hugging Face (`streaming=True`) | Customer mood/patience threshold calibration and timeline condensation benchmarks. |

---

## 🎭 Specialized Role-Based System Prompts

Each AI pipeline feature runs with a specialized **~40-line persona system prompt** enforcing domain boundaries and output schemas:

* 🤖 **Senior Enterprise Solutions Architect & Ticket Crafter** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Listens to conversational customer input, clarifies ambiguity, and drafts complete formal ticket specifications.
* ✍️ **Customer Communications Empathy & Tone Stylist** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Polishes draft agent messages into Empathetic, Concise, Formal, or Technical enterprise communication.
* 🧭 **Senior Support Triage Officer & SLA Risk Assessor** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Categorizes tickets, assesses urgency, evaluates patience deterioration, and generates technical checklists.
* 💬 **Customer Communications Strategist & Empathy Lead** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Drafts empathetic, de-escalating suggested replies with concrete next steps and realistic timelines.
* ⚡ **Autonomous Department Dispatch & SLA Auto-Responder** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Evaluates auto-reply eligibility, checks safety criteria, and generates authoritative department confirmations.
* 🔍 **Customer Communications QA Director & Empathy Coach** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Audits draft agent replies across 4 pillars (Professionalism, Empathy, Clarity, Actionability).
* 📜 **Senior Incident Historian & Operations Briefing Lead** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Condenses multi-turn ticket threads into chronological 5-6 bullet executive summaries.
* 🧠 **Enterprise Knowledge Base Architect & Systems Auditor** ([`templates.py`](file:///D:/Projects/SupportSenseAI/ai-service/app/prompts/templates.py)): Synthesizes weekly resolution logs into organizational insights and suggested FAQs.

---

## 🏢 Department Automated Response System

Configurable policies per department ensure that tickets receive immediate confirmation while kicking off automated verification workflows:

| Department | Handled Categories | Min Confidence | Automated Action Triggers |
| :--- | :--- | :--- | :--- |
| **Finance & Billing** | Billing, Refund, Invoice, Subscription | 85% | Payment gateway trace, Ledger snapshot review |
| **Technical Support** | Technical, Bug, Hardware, Performance | 80% | Telemetry log inspection, System health status check |
| **Identity & Access** | Account, Login, SSO, Password, MFA | 90% | Verification token dispatch, MFA status check |
| **API Platform Team** | API Platform, Webhook, Rate Limit, SDK | 85% | Gateway rate-limit check, Webhook delivery trace |

---

## 🏗️ System Architecture & Diagrams

### 3-Tier Architecture

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
|      (Auth, Ticket Routing, Business Logic, Analytics Engine, RBAC)               |
+------------------+----------------------------------+-----------------------------+
                   |                                  |
   SQL Queries     |                                  | HTTP Internal REST
                   v                                  v
+------------------+-------------------+  +-----------+---------------------------------+
|          DATABASE TIER               |  |              AI TIER                        |
|        PostgreSQL 15 DB              |  |    Python FastAPI AI Microservice           |
| (Tickets, Users, Messages, Insights) |  | (Google Gemini SDK, Datasets & Benchmarks)  |
+--------------------------------------+  +--------------------+------------------------+
                                                               | HTTPS
                                                               v
                                                  +------------+------------------------+
                                                  |      Google Gemini 1.5 API          |
                                                  +-------------------------------------+
```

---

### Component Diagram

```mermaid
graph TB
    subgraph "Frontend Container (React 18 + Vite)"
        UI[React SPA]
        AI_WIDGETS[AI Widgets: Concierge, Tone Checker, Timeline Banner, Quality Modal, Mood Badges]
        AUTH_CTX[Auth & Theme Contexts]
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
        AI_GATE[AI Proxy Service]
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

    subgraph "AI Microservice (FastAPI)"
        FAST[FastAPI Server & Async Router]
        POOL_CACHE[Model Instance Pooling & TTL Response Cache]
        PROMPT[Role-Based Prompt Pipeline]
        CONCIERGE_SVC[AI Concierge & Tone Polish Service]
        TRIAGE_SVC[Triage & Timeline Summary Service]
        AUTO_REP[Department Auto-Reply Engine]
        DATASET[Dataset Service & Benchmarks]
        PARSER[Pydantic JSON Validation]

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

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ TICKETS : "creates / handles"
    TICKETS ||--o{ TICKET_MESSAGES : "contains"
    TICKETS ||--o{ AGENT_CHECKLISTS : "has"
    TICKETS ||--o{ AI_METADATA : "possesses"
    TICKETS ||--o{ TICKETS : "links / follow-up"
    USERS ||--o{ WEEKLY_INSIGHTS : "generates/reviews"

    USERS {
        uuid id PK
        string name
        string email
        string password_hash
        string role "CUSTOMER | AGENT | ADMIN"
        string department "Technical Support | Finance & Billing | Identity & Access | API Platform"
        timestamp created_at
    }

    TICKETS {
        uuid id PK
        string ticket_number
        uuid customer_id FK
        uuid assigned_agent_id FK
        uuid linked_ticket_id FK "References parent ticket for follow-ups"
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

### Ticket Creation & AI Triage Sequence

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

---

### Reopened Ticket & Async Timeline Summary Sequence

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
    FE->>BE: GET /api/v1/tickets/:id (Next fetch displays TimelineSummaryBanner)
```

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries / Frameworks |
|---|---|---|
| **Frontend SPA** | React 18, Vite | React Router DOM, Axios, Lucide Icons, Tailwind CSS |
| **Backend REST API** | Node.js v18+, Express.js | `pg` (PostgreSQL Pool), `jsonwebtoken`, `bcryptjs`, `cors`, `helmet` |
| **AI Microservice** | Python 3.10+, FastAPI | `google-generativeai`, `datasets`, `pydantic`, `uvicorn`, `python-dotenv` |
| **Database** | PostgreSQL 15 | Relational storage, UUID extension, Triggers, JSONB |
| **Containerization** | Docker, Docker Compose | Multi-stage builds, Nginx static asset proxy |
| **Cloud Hosting** | Render.com | Render Blueprint (`render.yaml`), Managed PostgreSQL |

---

## 📁 Repository Folder Structure

```
SupportSenseAI/
├── .github/                      # CI/CD Automation Workflows
│   └── workflows/
│       └── ci.yml                # GitHub Actions: PostgreSQL 15, Jest, Vite build & Pytest
├── Customer Support Ticket Dataset/ # Kaggle Customer Support Ticket CSVs
│   └── customer_support_tickets.csv
├── Customer Support on Twitter/  # Kaggle Twitter Support CSVs
│   ├── sample.csv
│   └── twcs/twcs.csv
├── .env.example                  # Environment variables template
├── .gitignore                    # Git exclusion rules
├── render.yaml                   # 1-Click Render Blueprint infrastructure spec
├── ai-service/                   # Python FastAPI AI Microservice
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py               # FastAPI entrypoint & health endpoints
│       ├── api/router.py         # AI route handlers (triage, auto-reply, check, concierge, polish-tone)
│       ├── core/gemini_client.py # Gemini SDK, Model pooling, TTL caching & async generation
│       ├── models/schemas.py     # Pydantic JSON schemas
│       ├── prompts/templates.py  # 40-line specialized role-based prompts
│       └── services/             # triage, concierge, auto-reply, quality, insights, and datasets
├── backend/                      # Node.js Express Core Backend
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                 # Express HTTP server entrypoint
│   └── src/
│       ├── app.js                # Middleware, security & router setup
│       ├── config/               # DB pool, env loader & dbInit.js auto-migrator
│       ├── controllers/          # Auth, Ticket, and AI Proxy logic
│       ├── middleware/           # Auth JWT guards, RBAC & rate limiters
│       ├── models/               # Data access layer (transactions, upserts)
│       ├── routes/               # REST API endpoint routes
│       ├── services/             # aiService.js HTTP client with timeouts & fallbacks
│       └── utils/                # logger.js & responseFormatter.js
├── database/                     # Single Source of Truth Database Scripts
│   ├── migrations/001_init_schema.sql
│   └── seeds/001_seed_data.sql
├── deployment/docker-compose.yml # Multi-container orchestration specification
├── docs/                         # Comprehensive Engineering Documentation Hub (13 Modules + Guides)
├── tests/                        # Unit & Integration Test Suites
│   ├── integration/              # Supertest, concurrency (SCRUM-110) & transaction (SCRUM-112)
│   └── unit/                     # Backend unit tests & AI microservice Pytest suite
└── frontend/                     # React SPA Frontend (Vite + Tailwind CSS)
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── assets/               # Branding logo & visual assets
        ├── components/
        │   ├── ai/               # AI Concierge, Tone Checker, Timeline Banner, Mood Badge, Quality Check
        │   └── common/           # Navbar, Sidebar, PriorityBadge, LoadingSkeleton, Modals
        ├── context/              # AuthContext, ThemeContext & ToastContext
        ├── layouts/              # MainLayout with responsive navigation & breadcrumbs
        ├── pages/                # Dashboard, Tickets, Detail, Create, Depts, KB, Insights, Users
        └── services/api.js       # Axios client layer with JWT interceptors & rich mock fallbacks
```

---

## 📑 API Documentation Reference

### 🔐 Auth APIs (`/api/v1/auth`)
* `POST /api/v1/auth/register` — Register new Customer or Agent account (self-registration strictly enforces `CUSTOMER` role).
* `POST /api/v1/auth/login` — Authenticate credentials and receive signed JWT token.
* `GET /api/v1/auth/me` — Fetch authenticated user profile.
* `GET /api/v1/auth/users` — List all registered users (Admin only).
* `PATCH /api/v1/auth/users/:id/role` — Update a user's role (Admin only).

### 🎫 Ticket APIs (`/api/v1/tickets`)
* `GET /api/v1/tickets` — List tickets with filtering (`status`, `priority`, `category`, `search`).
* `POST /api/v1/tickets` — Submit a new ticket atomically with its initial message (triggers automated AI triage & department auto-reply evaluation).
* `GET /api/v1/tickets/:id` — Fetch single ticket with messages, AI metadata, and agent checklist.
* `PATCH /api/v1/tickets/:id/status` — Enforces status transitions (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED` or `OPEN`). Reopening asynchronously triggers the AI timeline summarizer worker.
* `POST /api/v1/tickets/:id/forward` — Forward ticket to a specialized department with agent comments and auto-logged internal note.
* `PATCH /api/v1/tickets/:id` — Modify any ticket attributes (Admin/Agent escalation override).
* `DELETE /api/v1/tickets/:id` — Delete / Archive a ticket record (Admin only).
* `POST /api/v1/tickets/:id/messages` — Post customer reply, agent public message, or internal note.
* `PATCH /api/v1/tickets/:id/checklist/:itemId` — Toggle agent checklist task completion state.

### 🧠 AI Proxy APIs (`/api/v1/ai`)
* `POST /api/v1/ai/concierge` — Interactive AI Concierge Chatbot & Formal Ticket Crafter (Accessible to all authenticated roles).
* `POST /api/v1/ai/polish-tone` — 1-Click AI Response Tone Polishing (`empathetic`, `concise`, `formal`, `technical` — 3 cycling variations with anti-nesting).
* `POST /api/v1/ai/verify-response` — Evaluates agent draft reply for Professionalism, Empathy, Clarity, Actionability (Agent/Admin).
* `POST /api/v1/ai/department-auto-reply` — Evaluates auto-reply eligibility and generates department-specific confirmation message (Agent/Admin).
* `GET /api/v1/ai/departments` — Returns department definitions, handled categories, and active auto-reply rules (Agent/Admin).
* `GET /api/v1/ai/benchmarks` — Returns historical category SLA duration and priority benchmarks (Agent/Admin).
* `GET /api/v1/ai/insights` — Fetches weekly AI analytics, top repeated issues, and recommended FAQs (Agent/Admin).
* `GET /api/v1/ai/faqs` — Retrieves all knowledge base FAQs across Technical, Billing, Account, and API categories.
* `GET /api/v1/ai/faqs/search` — Performs real-time fuzzy keyword search over FAQs for instant deflection during ticket drafting.

---

## ⚡ Quickstart & Local Setup

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+) & [Docker Compose](https://docs.docker.com/compose/)
* [Node.js](https://nodejs.org/) v18+ (optional, for local development without Docker)
* [Python](https://www.python.org/) 3.10+ (for local AI service development)
* A free [Google Gemini API Key](https://aistudio.google.com/)

### 🚀 1-Command Local Boot (`Docker Compose`)

```bash
# 1. Clone the repository
git clone https://github.com/ByteLounge/SupportSenseAI.git
cd SupportSenseAI

# 2. Create environment file
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY=AIzaSy...

# 3. Boot the entire 4-tier production stack
cd deployment
docker compose up -d --build
```

Access the local services:
* 💻 **Frontend React SPA**: [http://localhost:80](http://localhost:80)
* ⚡ **Express REST Backend**: [http://localhost:5000/health](http://localhost:5000/health) | Swagger UI: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
* 🤖 **Python AI Microservice**: [http://localhost:8000/health](http://localhost:8000/health) | Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
* 🗄️ **PostgreSQL Database**: `localhost:5432`

---

### 🔑 Demo Accounts & Personas (Pre-Seeded)

All demo accounts share the password: **`Password123!`** (also selectable via 1-click quick-login buttons on the login page):

| Persona / Role | Email | Password | Department | Dashboard View |
|:---|:---|:---|:---|:---|
| **Customer** (Sarah Jenkins) | `sarah.jenkins@acme.com` | `Password123!` | Customer | Customer Portal (Submit Tickets & Live Chat) |
| **Customer** (David Chen) | `david.chen@fintech.io` | `Password123!` | Customer | Customer Portal (Active & Resolved Tickets) |
| **Customer** (Priya Patel) | `priya.patel@globalcorp.com` | `Password123!` | Customer | Customer Portal (API & Technical Inquiries) |
| **Agent** (Alex Rivera) | `alex.rivera@supportsense.ai` | `Password123!` | Technical Support | Agent Workbench (Technical Ticket Queue) |
| **Agent** (Elena Rostova) | `elena.rostova@supportsense.ai` | `Password123!` | Finance & Billing | Agent Workbench (Billing & Invoices Queue) |
| **Agent** (Marcus Brody) | `marcus.brody@supportsense.ai` | `Password123!` | Identity & Access | Agent Workbench (SSO & MFA Security Queue) |
| **Agent** (Liam Vance) | `liam.vance@supportsense.ai` | `Password123!` | API Platform | Agent Workbench (Webhooks & SDK Errors) |
| **Admin** (Administrator) | `admin@example.com` | `Password123!` | IT Operations | Executive Insights, User Management & SLA Analytics |

---

## ☁️ 1-Click Cloud Deployment (Render)

This repository includes a native **Render Blueprint** (`render.yaml`) for 100% free multi-service deployment:

1. Push this repository to your GitHub account.
2. Sign in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** ➔ **Blueprint**.
4. Connect your GitHub repository.
5. Render automatically provisions:
   * **PostgreSQL Database** (`supportsense-db`)
   * **FastAPI AI Microservice** (`supportsense-ai-service`)
   * **Express Backend** (`supportsense-backend`)
   * **React Frontend** (`supportsense-frontend`)
6. Add your `GEMINI_API_KEY` under the Environment tab of `supportsense-ai-service`.

---

## 🌐 Environment Variables Blueprint

| Variable Name | Service | Description | Default / Example |
|---|---|---|---|
| `PORT` | Backend | HTTP Port for Express Server | `5000` |
| `NODE_ENV` | Backend | Application environment | `production` / `development` |
| `JWT_SECRET` | Backend | Secret key for signing JWT tokens | Secure random string (Production check enforced) |
| `JWT_EXPIRES_IN` | Backend | Expiration duration for access tokens | `1h` |
| `ALLOWED_ORIGINS` | Backend & AI | Whitelisted CORS origin domains | `http://localhost:5173,http://localhost:80` |
| `DB_HOST` | Backend | PostgreSQL Hostname | `postgres` / `localhost` |
| `DB_PORT` | Backend | PostgreSQL Port | `5432` |
| `DB_NAME` | Backend | PostgreSQL Database Name | `supportsense_db` |
| `DB_USER` | Backend | PostgreSQL User Name | `postgres` |
| `DB_PASSWORD` | Backend | PostgreSQL User Password | `postgrespassword` |
| `DATABASE_URL` | Backend | Supabase / PostgreSQL Connection URI | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres` |
| `DB_SSL` | Backend | Enforce SSL for cloud database | `true` (automatically enabled for Supabase) |
| `AI_SERVICE_URL` | Backend | Internal URI of FastAPI Microservice | `http://ai-service:8000` |
| `GEMINI_API_KEY` | AI Service | Google Gemini 1.5 API Key | `AIzaSy...` |
| `GEMINI_MODEL_NAME` | AI Service | Target LLM model name | `gemini-1.5-flash` |
| `VITE_API_BASE_URL` | Frontend | Target Backend REST API base URL | `/api/v1` |
| `VITE_ENABLE_MOCK` | Frontend | Enable offline UI mock fallback | `false` (set `true` for standalone dev) |

---

## 🧪 Testing & Quality Assurance

SupportSense AI maintains an enterprise test suite spanning unit tests, database concurrency stress tests, atomic transaction rollback validations, and AI microservice assertions:

### Run Backend Unit & Integration Suite (Jest)
```bash
cd backend
npm test
```
* **Auth Unit Suite** ([`auth.test.js`](file:///D:/Projects/SupportSenseAI/tests/unit/backend/auth.test.js)): Validates bcrypt hashing and JWT token claims.
* **Ticket Unit Suite** ([`ticket.test.js`](file:///D:/Projects/SupportSenseAI/tests/unit/backend/ticket.test.js)): Validates urgency score algorithms and status transition guards.
* **API Integration Suite** ([`api.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/api.test.js)): Validates REST route responses, rate-limiting, and error formats.
* **Concurrency Suite** ([`ticket-concurrency.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-concurrency.test.js)): Verifies high-throughput concurrent ticket submissions without sequence number collisions.
* **Transaction Suite** ([`ticket-transaction.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-transaction.test.js)): Verifies atomic PostgreSQL transaction commits and automatic rollbacks on message insertion failures.

### Run AI Microservice Pytest Suite
```bash
python -m pytest tests/unit/ai-service -v
```
* **AI Features Suite** ([`test_ai_features.py`](file:///D:/Projects/SupportSenseAI/tests/unit/ai-service/test_ai_features.py)): Validates Kaggle dataset loading, benchmark metrics, department auto-reply evaluation, role-prompted triage, 4-pillar quality checks, and async service caching.
* **Triage Fallback Suite** ([`test_triage.py`](file:///D:/Projects/SupportSenseAI/tests/unit/ai-service/test_triage.py)): Validates graceful deterministic fallbacks when Gemini is offline.

### ⚙️ Continuous Integration (GitHub Actions)
The workspace includes an automated CI/CD pipeline in [`.github/workflows/ci.yml`](file:///D:/Projects/SupportSenseAI/.github/workflows/ci.yml) validating every push and pull request:
* **Backend Tests Job**: Boots a live `postgres:15-alpine` container service with healthchecks, applies `001_init_schema.sql` and `001_seed_data.sql`, and runs Jest.
* **Frontend Build Job**: Runs Node 18 dependency install and validates the production React SPA Vite build (`npm run build`).
* **AI Service Tests Job**: Sets up Python 3.10, installs requirements, and executes the Pytest suite with `PYTHONPATH=ai-service`.

---

## 👥 Team Composition & Credits

Developed during the **Persistent Systems Internship Program**:

* **Member 1 (Frontend Lead)** — React SPA, Vite, Tailwind CSS, UI Component Architecture, Axios Client Layer.
* **Member 2 (Backend Lead)** — Node.js, Express REST API, PostgreSQL Schema, JWT Authentication, Database Pool management.
* **Member 3 (AI Engineer)** — Python FastAPI Microservice, Google Gemini 1.5 SDK Integration, Role-Based Prompts, Dataset Benchmarks, Department Auto-Replies.
* **Member 4 (DevOps, QA & Documentation Lead)** — Docker & Docker Compose Containerization, Render Blueprint CI/CD, Automated Tests, Technical Specifications.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
