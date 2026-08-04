# Module 01: Project Vision, PRD & SRS

---

## 1. Project Vision

### 1.1 Executive Summary
**SupportSense AI** is an enterprise-grade AI-assisted customer support ticketing system engineered specifically for enterprise organizations like Persistent Systems. The system empowers human support agents with real-time AI recommendations, triage intelligence, sentiment monitoring, response verification, and knowledge distillation.

### 1.2 Core Principle: AI ASSISTS, HUMANS DECIDE
> [!IMPORTANT]
> SupportSense AI operates strictly under an **Human-in-the-Loop (HITL)** paradigm. The AI microservice never executes autonomous actions or sends unverified messages directly to customers. Every AI recommendation, draft reply, patience rating, and checklist item serves as intelligent decision-support for human agents.

### 1.3 Strategic Business Value
1. **Reduce First Response Time (FRT)** by up to 60% via instant automated ticket classification, priority tagging, and initial action checklist generation.
2. **Increase First Contact Resolution (FCR)** by supplying agents with context-aware timeline summaries, duplicate ticket alerts, and relevant historical solution references.
3. **Elevate Customer Satisfaction (CSAT)** through AI Response Quality Checks (verifying empathy, clarity, and professionalism prior to dispatch).
4. **Prevent Agent Burnout** by highlighting customer patience degradation early so team leads can reassign critical cases proactive.
5. **Continuous Organizational Learning** via weekly AI Learning Insights that detect emerging issues and recommend new KB articles.

---

## 2. Product Requirements Document (PRD)

### 2.1 Product Goals & Objectives
- **Target Audience**: Support Agents, Support Team Leads, Customer Support Managers, System Administrators.
- **Primary Objective**: Build a robust, scalable multi-tier web application consisting of a React SPA frontend, a Node.js/Express core backend API, PostgreSQL relational database, and a Python FastAPI AI Microservice powered by Google Gemini API.
- **Success Metrics**:
  - Triage accuracy ≥ 90% for classification and priority predictions.
  - API P95 latency < 250ms for core backend routes, < 1.8s for Gemini-assisted AI processing.
  - Zero unhandled server crashes during stress loads (100 concurrent agent requests).

### 2.2 Product Scope & Core Modules
```
+-----------------------------------------------------------------------------------+
|                                 SUPPORTSENSE AI                                   |
+------------------------------------+----------------------------------------------+
| Core Ticketing Engine              | AI Intelligence Engine (Gemini Microservice) |
+------------------------------------+----------------------------------------------+
| • Ticket Creation & Ingestion      | • Ticket Auto-Classification & Priority      |
| • Threaded Conversations           | • AI Mood & Customer Patience Score          |
| • Status Lifecycle Management      | • Resolution Time Predictor                  |
| • Role-Based Access Control (RBAC) | • Actionable Agent Assist Checklist          |
| • Real-time Notification System    | • Pre-send Response Quality Checker          |
| • Analytics & SLA Tracking         | • Reopened Ticket Timeline Summarizer        |
|                                    | • Duplicate & Related Ticket Recommendation  |
|                                    | • Weekly Organizational Learning Insights    |
+------------------------------------+----------------------------------------------+
```

### 2.3 Key Stakeholders & Personas

| Persona | Role | Primary Goals | Key Needs |
|---|---|---|---|
| **Sarah (Support Agent)** | Customer Support Specialist | Resolve tickets quickly, maintain high CSAT | Clear ticket history, suggested replies, actionable checklists |
| **David (Team Lead)** | Support Operations Manager | Monitor SLA compliance, balance agent workload | Real-time queue metrics, customer patience alerts, resolution estimates |
| **Elena (Knowledge Lead)** | Documentation Specialist | Maintain knowledge base articles | Weekly insights on top repeated customer pain points and gaps |
| **Mark (System Admin)** | Enterprise Administrator | Manage users, roles, audit logs, system health | User management, RBAC enforcement, API rate limiting & security |

---

## 3. Software Requirements Specification (SRS)

### 3.1 System Scope
SupportSense AI interfaces with external identity providers (JWT), relational storage (PostgreSQL), and Google Gemini LLM API over standard REST interfaces.

### 3.2 Operating Environment
- **Client Side**: Modern Browsers (Chrome ≥ 110, Firefox ≥ 110, Edge ≥ 110, Safari ≥ 16) with responsive desktop & tablet viewports.
- **Backend Application Server**: Node.js v18 LTS / Express v4 LTS on Alpine Linux / Windows Server.
- **AI Microservice**: Python 3.10+ / FastAPI / `google-genai` SDK.
- **Database**: PostgreSQL 15+ relational engine.
- **Deployment Platform**: Docker Compose / Kubernetes ready.

### 3.3 System Constraints
- **Security Constraint**: Passwords must be hashed using bcrypt (min 10 salt rounds). JWT access tokens expire in 1 hour; refresh tokens expire in 7 days.
- **AI Reliability Constraint**: Every AI API response MUST return a structured JSON payload containing a numerical `confidence_score` between `0.00` and `1.00`. If confidence drops below `0.60`, UI must render a disclaimer warning the agent to double-check AI advice.
- **Performance Constraint**: Database operations must utilize strict indexing on foreign keys and commonly filtered columns (`status`, `priority`, `created_at`).
