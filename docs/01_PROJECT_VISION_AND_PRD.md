# Module 01: Project Vision, PRD & SRS

---

## 1. Project Vision

### 1.1 Executive Summary
**SupportSense AI** is an enterprise-grade AI-assisted customer support ticketing system engineered specifically for enterprise organizations like Persistent Systems. The system empowers human support agents with real-time AI recommendations, triage intelligence, sentiment monitoring, response verification, and knowledge distillation.

### 1.2 Core Principle: AI ASSISTS, HUMANS DECIDE
> [!IMPORTANT]
> SupportSense AI operates strictly under an **Human-in-the-Loop (HITL)** paradigm. The AI microservice never executes autonomous actions or sends unverified messages directly to customers. Every AI recommendation, draft reply, patience rating, and checklist item serves as intelligent decision-support for human agents.

### 1.3 Strategic Business Value
1. **Reduce First Response Time (FRT)** by up to 75% via instant automated department confirmation replies, AI Concierge conversational intake, and automated classification.
2. **Increase First Contact Resolution (FCR)** by supplying agents with context-aware timeline summaries, dataset benchmarks, and verified checklists.
3. **Elevate Customer Satisfaction (CSAT)** through AI Response Quality Checks and 1-Click Tone Polishing (verifying empathy, clarity, and professionalism prior to dispatch).
4. **Prevent Agent Burnout** by highlighting customer patience degradation early so team leads can proactively reassign critical cases.
5. **Continuous Organizational Learning** via weekly AI Learning Insights that detect emerging issues and recommend new KB articles.

---

## 2. Product Requirements Document (PRD)

### 2.1 Product Goals & Objectives
- **Target Audience**: Customers, Support Agents, Support Team Leads, Customer Support Managers, System Administrators.
- **Primary Objective**: Build a robust, scalable multi-tier web application consisting of a React SPA frontend, a Node.js/Express core backend API, PostgreSQL relational database, and a Python FastAPI AI Microservice powered by Google Gemini API.
- **Success Metrics**:
  - Triage accuracy ≥ 90% for classification and priority predictions.
  - API P95 latency < 200ms for core backend routes, < 1.5s for Gemini-assisted AI processing with in-memory TTL caching.
  - Zero unhandled server crashes during stress loads (100 concurrent agent requests, tested via Jest connection pooling suite).

### 2.2 Product Scope & Core Modules
```
+-----------------------------------------------------------------------------------+
|                                 SUPPORTSENSE AI                                   |
+------------------------------------+----------------------------------------------+
| Core Ticketing Engine              | AI Intelligence Engine (Gemini Microservice) |
+------------------------------------+----------------------------------------------+
| • Transactional Ticket Creation    | • AI Concierge Conversational Ticket Crafter |
| • Threaded Conversations & Notes   | • 1-Click AI Response Tone Polishing         |
| • Status Transitions State Machine | • Ticket Auto-Classification & Priority      |
| • Inter-Department Forwarding      | • AI Mood & Customer Patience Score          |
| • Role-Based Access Control (RBAC) | • Resolution Time Predictor (Dataset Ground) |
| • Connection Pooling & Concurrency | • Actionable Agent Assist Checklist          |
| • Analytics & SLA Tracking         | • Pre-send Response Quality Checker          |
| • Render Blueprint & Docker Ops    | • Reopened Timeline Summarizer (Async Worker)|
|                                    | • Department Automated Response Engine       |
|                                    | • Weekly Organizational Learning Insights    |
+------------------------------------+----------------------------------------------+
```

### 2.3 Key Stakeholders & Personas

| Persona | Role | Primary Goals | Key Needs |
|---|---|---|---|
| **Alex (Customer)** | Enterprise End-User | Submit tickets easily, receive immediate status updates | AI Concierge conversational intake, clear portal queue, automated confirmations |
| **Sarah (Support Agent)** | Customer Support Specialist | Resolve tickets quickly, maintain high CSAT | Clear ticket history, suggested replies, tone polishing, actionable checklists |
| **David (Team Lead)** | Support Operations Manager | Monitor SLA compliance, balance agent workload | Real-time queue metrics, customer patience alerts, resolution estimates |
| **Elena (Knowledge Lead)** | Documentation Specialist | Maintain knowledge base articles | Weekly insights on top repeated customer pain points and gaps |
| **Mark (System Admin)** | Enterprise Administrator | Manage users, roles, audit logs, system health | User management, RBAC enforcement, API rate limiting & security |

---

## 3. Software Requirements Specification (SRS)

### 3.1 System Scope
SupportSense AI interfaces with external identity providers (JWT), relational storage (PostgreSQL 15), and Google Gemini LLM API over standard REST interfaces with connection pooling and fast-fail fallbacks.

### 3.2 Operating Environment
- **Client Side**: Modern Browsers (Chrome ≥ 110, Firefox ≥ 110, Edge ≥ 110, Safari ≥ 16) with responsive desktop & tablet viewports (MoonRow design system).
- **Backend Application Server**: Node.js v18 LTS / Express v4 LTS on Alpine Linux / Windows Server.
- **AI Microservice**: Python 3.10+ / FastAPI / `google-generativeai` SDK with model instance pooling and TTL caching.
- **Database**: PostgreSQL 15+ relational engine with connection pool (max 20 clients).
- **Deployment Platform**: Docker Compose / Render.com Blueprint (`render.yaml`).

### 3.3 System Constraints
- **Security Constraint**: Passwords must be hashed using bcrypt (min 10 salt rounds). JWT access tokens expire in 1 hour; public registration strictly enforces `CUSTOMER` role.
- **Data Integrity Constraint**: Ticket and initial message creation MUST execute in a single atomic SQL transaction (`BEGIN` / `COMMIT` / `ROLLBACK`). Status transitions must follow `ALLOWED_STATUS_TRANSITIONS`.
- **AI Reliability Constraint**: Every AI API response MUST return a structured JSON payload containing a numerical `confidence_score` between `0.00` and `1.00`. If confidence drops below `0.60`, UI must render a disclaimer warning the agent to double-check AI advice. Fallback payloads must ensure zero downtime if Gemini is unconfigured or rate-limited.
- **Performance Constraint**: Database operations must utilize strict indexing on foreign keys and commonly filtered columns (`status`, `priority`, `customer_id`, `created_at`). Inter-service AI HTTP calls enforce 5-second timeouts with `AbortSignal.timeout(5000)`.
