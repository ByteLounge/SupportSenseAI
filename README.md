# 🚀 SupportSense AI — Enterprise Customer Support Ticket System

> **An AI-Assisted Customer Support Ecosystem featuring Real-Time Triage, Sentiment Monitoring, Resolution Forecasting, Response Verification, and Organizational Learning.**

[![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%7C_Express-339933?logo=node.js)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/AI_Microservice-Python_%7C_FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_15-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/LLM-Google_Gemini_1.5_Flash-8E44AD?logo=google)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Deployment-Docker_Compose_%7C_Render-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Table of Contents

- [Executive Summary & Vision](#-executive-summary--vision)
- [Human-in-the-Loop (HITL) Paradigm](#-human-in-the-loop-hitl-paradigm)
- [Novel Enterprise Features](#-novel-enterprise-features)
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

**SupportSense AI** is an enterprise-grade AI-assisted customer support ticketing system engineered specifically for high-throughput enterprise environments. The system empowers human support specialists by offloading repetitive triage, analyzing customer sentiment in real time, predicting resolution timeframes, verifying response quality before dispatch, and converting closed tickets into institutional knowledge.

### Strategic Business Impact
* ⚡ **Reduce First Response Time (FRT)** by up to **60%** via instant automated ticket classification, priority tagging, and action item generation.
* 🎯 **Elevate First Contact Resolution (FCR)** by supplying agents with context-aware timeline summaries and related historical ticket references.
* 💖 **Improve Customer Satisfaction (CSAT)** through AI Response Quality Checks (verifying empathy, clarity, and professionalism prior to sending replies).
* 🛡️ **Prevent Agent Burnout** by tracking customer patience degradation early so team leads can proactively reassign critical escalations.
* 📈 **Continuous Organizational Learning** via weekly AI Learning Insights that aggregate recurring friction points and recommend Knowledge Base FAQs.

---

## 🤝 Human-in-the-Loop (HITL) Paradigm

> [!IMPORTANT]
> **Core Principle: AI ASSISTS, HUMANS DECIDE.**
> SupportSense AI operates strictly under an **Human-in-the-Loop (HITL)** framework. The AI microservice never executes autonomous actions or sends unverified messages directly to customers. Every AI recommendation, draft reply evaluation, patience score, and checklist item serves as intelligent decision-support for human agents.

---

## 🔥 Novel Enterprise Features

1. **AI Mood Indicator & Sentiment Score**: Real-time customer emotion categorization (`🙂 HAPPY`, `😐 NEUTRAL`, `😠 FRUSTRATED`) paired with confidence metrics (`0.00` to `1.00`).
2. **Customer Patience Score & SLA Guardrail**: Tracks customer frustration levels (`CALM`, `CONCERNED`, `FRUSTRATED`, `CRITICAL`) to guide tone and trigger supervisor escalation warnings.
3. **AI Resolution Predictor**: Forecasts estimated completion timeframes (e.g., *"1–2 business days"*) based on category complexity and agent workload.
4. **Dynamic Agent Assist Checklists**: Auto-generates step-by-step action items tailored to the specific problem (e.g., `[ ] Verify Stripe payment logs`, `[ ] Issue $1,200 refund`, `[ ] Send apology email`).
5. **Response Quality & Empathy Checker**: Pre-send reply evaluation scoring agent drafts for **Professionalism**, **Empathy**, **Clarity**, and **Actionability** with instant correction hints.
6. **Reopened Ticket Timeline Summarizer**: Condenses lengthy, multi-agent thread histories into a 5-6 bullet executive summary when tickets are reopened or reassigned.
7. **Weekly Organizational Learning Insights**: Analyzes historical ticket resolution patterns to generate top 5 repeated issues, recurring agent mistakes, and suggested Knowledge Base FAQs.

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
| (Tickets, Users, Messages, Insights) |  | (Google Gemini SDK, Prompt Orchestration)   |
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
    subgraph "Frontend Container (React)"
        UI[React SPA]
        RQ[State Management]
        AX[Axios Client Layer]
        UI --> RQ
        RQ --> AX
    end

    subgraph "Backend Core Service (Node.js/Express)"
        API[Express Router]
        AUTH[Auth Controller & JWT Guard]
        TICK[Ticket Controller]
        AI_GATE[AI Proxy Service]
        DB_MOD[PostgreSQL Pool / pg]

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

    subgraph "Database & Cloud Providers"
        PG[(PostgreSQL Database)]
        GEMINI[Google Gemini 1.5 LLM]

        DB_MOD --> PG
        PARSER --> GEMINI
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

    Customer->>FE: Fills Ticket Form & Submits
    FE->>BE: POST /api/v1/tickets
    BE->>DB: INSERT into tickets (status='OPEN')
    DB-->>BE: Ticket Created (ID: T-1042)

    BE->>AI: POST /api/v1/ai/triage { title, description }
    AI->>GEM: Prompt Gemini 1.5 Flash for Triage & Checklist JSON
    GEM-->>AI: Returns Structured JSON Payload
    AI-->>BE: Returns Triage Metadata + Confidence Score

    BE->>DB: INSERT into ai_metadata & agent_checklists
    BE-->>FE: HTTP 201 Created (Ticket + AI Assist Payload)
    FE-->>Customer: Render Success + Redirect to Ticket Detail
```

---

## 🛠️ Technology Stack

| Layer | Technology | Key Libraries / Frameworks |
|---|---|---|
| **Frontend SPA** | React 18, Vite | React Router DOM, Axios, Lucide Icons, Tailwind CSS |
| **Backend REST API** | Node.js v18+, Express.js | `pg` (PostgreSQL Pool), `jsonwebtoken`, `bcryptjs`, `cors`, `helmet` |
| **AI Microservice** | Python 3.10+, FastAPI | `google-generativeai`, `pydantic`, `uvicorn`, `python-dotenv` |
| **Database** | PostgreSQL 15 | Relational storage, UUID extension, Triggers, JSONB |
| **Containerization** | Docker, Docker Compose | Multi-stage builds, Nginx static asset proxy |
| **Cloud Hosting** | Render.com | Render Blueprint (`render.yaml`), Managed PostgreSQL |

---

## 📁 Repository Folder Structure

```
SupportSenseAI/
├── .env.example                # Environment variables template
├── .gitignore                   # Git exclusion rules
├── render.yaml                 # 1-Click Render Blueprint infrastructure spec
├── ai-service/                 # Python FastAPI AI Microservice
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py             # FastAPI entrypoint & health endpoints
│       ├── api/                # AI route handlers (triage, response check, insights)
│       ├── core/               # Gemini SDK configuration & prompt execution
│       ├── models/             # Pydantic JSON schemas
│       └── prompts/            # Prompt templates
├── backend/                    # Node.js Express Core Backend
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js               # Express HTTP server entrypoint
│   └── src/
│       ├── app.js              # Middleware, security & router setup
│       ├── config/             # DB pool, env loader & dbInit.js script
│       │   └── sql/            # Self-contained schema & seed SQL scripts
│       ├── controllers/        # Auth, Ticket, and AI Proxy logic
│       ├── middleware/         # Auth JWT guards & rate limiters
│       ├── models/             # Data access layer
│       └── routes/             # REST API endpoint routes
├── database/                   # Root Database Scripts
│   ├── migrations/             # 001_init_schema.sql
│   └── seeds/                  # 001_seed_data.sql
├── deployment/                 # Docker Compose Orchestration
│   ├── docker-compose.yml      # Multi-container orchestration specification
│   └── nginx.conf              # Production Nginx reverse proxy configuration
├── docs/                       # Comprehensive Engineering Documentation
└── frontend/                   # React SPA Frontend
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/         # Navigation, AI badges, Checklists, Modals
        ├── pages/              # Login, Register, Customer Portal, Agent Queue, Admin Insights
        ├── services/           # Axios API client layer with JWT interceptors
        └── context/            # AuthContext & global state
```

---

## 📑 API Documentation Reference

### 🔐 Auth APIs (`/api/v1/auth`)
* `POST /api/v1/auth/register` — Register new Customer or Agent account.
* `POST /api/v1/auth/login` — Authenticate credentials and receive signed JWT token.
* `GET /api/v1/auth/me` — Fetch authenticated user profile.

### 🎫 Ticket APIs (`/api/v1/tickets`)
* `GET /api/v1/tickets` — List tickets with filtering (`status`, `priority`, `category`, `search`).
* `POST /api/v1/tickets` — Submit a new ticket (triggers automatic AI triage).
* `GET /api/v1/tickets/:id` — Fetch single ticket with messages, AI metadata, and agent checklist.
* `PATCH /api/v1/tickets/:id/status` — Update status (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED`). Reopening triggers AI summary.
* `POST /api/v1/tickets/:id/messages` — Post customer reply, agent public message, or internal note.
* `PATCH /api/v1/tickets/:id/checklist/:itemId` — Toggle agent checklist task state.

### 🧠 AI Proxy APIs (`/api/v1/ai`)
* `POST /api/v1/ai/verify-response` — Evaluates agent draft reply for Professionalism, Empathy, Clarity, Actionability.
* `GET /api/v1/ai/insights` — Fetches weekly AI analytics, top repeated issues, and recommended FAQs.

---

## ⚡ Quickstart & Local Setup

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+) & [Docker Compose](https://docs.docker.com/compose/)
* [Node.js](https://nodejs.org/) v18+ (optional, for local development without Docker)
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

### 🔑 Demo Accounts (Pre-Seeded)

All demo accounts share the password: **`Password123!`**

| Role | Email | Password | Dashboard View |
|---|---|---|---|
| **Admin** | `admin@supportsense.ai` | `Password123!` | Executive Insights & Analytics |
| **Support Agent** | `agent.sarah@supportsense.ai` | `Password123!` | Agent Assist Queue & Ticket Workbench |
| **Customer** | `alex.rivera@customer.com` | `Password123!` | Customer Ticket Submission & Portal |

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
| `NODE_ENV` | Backend | Application environment | `production` |
| `JWT_SECRET` | Backend | Secret key for signing JWT tokens | `supportsense_enterprise_prod_secret_2026` |
| `JWT_EXPIRES_IN` | Backend | Expiration duration for access tokens | `1h` |
| `DB_HOST` | Backend | PostgreSQL Hostname | `postgres` / `localhost` |
| `DB_PORT` | Backend | PostgreSQL Port | `5432` |
| `DB_NAME` | Backend | PostgreSQL Database Name | `supportsense_db` |
| `DB_USER` | Backend | PostgreSQL User Name | `postgres` |
| `DB_PASSWORD` | Backend | PostgreSQL User Password | `postgrespassword` |
| `DATABASE_URL` | Backend | Full PostgreSQL Connection URI | `postgres://user:pass@host:5432/db` |
| `AI_SERVICE_URL` | Backend | Internal URI of FastAPI Microservice | `http://ai-service:8000` |
| `GEMINI_API_KEY` | AI Service | Google Gemini 1.5 API Key | `AIzaSy...` |
| `GEMINI_MODEL_NAME` | AI Service | Target LLM model name | `gemini-1.5-flash` |
| `VITE_API_BASE_URL` | Frontend | Target Backend REST API base URL | `/api/v1` |

---

## 🧪 Testing & Quality Assurance

### Run Backend Integration Tests
```bash
cd backend
npm test
```

### Run AI Microservice Unit Tests
```bash
cd ai-service
pytest
```

---

## 👥 Team Composition & Credits

Developed during the **Persistent Systems Internship Program**:

* **Member 1 (Frontend Lead)** — React SPA, Vite, Tailwind CSS, UI Component Architecture, Axios Client Layer.
* **Member 2 (Backend Lead)** — Node.js, Express REST API, PostgreSQL Schema, JWT Authentication, Database Pool management.
* **Member 3 (AI Engineer)** — Python FastAPI Microservice, Google Gemini 1.5 SDK Integration, Prompt Pipeline Orchestration, Confidence Scoring.
* **Member 4 (DevOps, QA & Documentation Lead)** — Docker & Docker Compose Containerization, Render Blueprint CI/CD, Automated Tests, Technical Specifications.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
