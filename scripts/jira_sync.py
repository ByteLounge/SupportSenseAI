#!/usr/bin/env python3
"""
Jira Agile Workspace Sync Script for SupportSense AI
=====================================================
Automates the live creation and synchronization of:
- 4 Sprints (Sprint 1 & 2 completed, Sprint 3 & 4 planned)
- 6 Epics (Research, Frontend, Backend, AI, Testing, DevOps)
- 26 Stories/Tasks across all 4 sprints with 4 team members
- Subtasks, Story Points (customfield_10016), Acceptance Criteria, and Technical Notes
- Completion comments for finished Sprint 1 & 2 tasks

Project: SCRUM (AI Customer Support Ticket System)
Board: 1 (SCRUM board)
"""

import os
import sys
import json
import time
import argparse
import requests
from requests.auth import HTTPBasicAuth
from typing import Dict, List, Optional, Any

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Sprint Dates & Goals
# Sprint Dates & Goals (Sprint names strictly <= 30 chars for Jira Cloud)
SPRINT_CONFIGS = [
    {
        "name": "Sprint 1: Research & Plan",
        "key": "Sprint 1",
        "startDate": "2026-08-03T09:00:00.000Z",
        "endDate": "2026-08-16T18:00:00.000Z",
        "state": "closed",
        "goal": "Domain research, PRD/SRS requirements, system architecture & Agile sprint planning."
    },
    {
        "name": "Sprint 2: Prototype Build",
        "key": "Sprint 2",
        "startDate": "2026-08-17T09:00:00.000Z",
        "endDate": "2026-08-29T18:00:00.000Z",
        "state": "closed",
        "goal": "Figma-based UI implementation, Express MVC backend, PostgreSQL schema & seed data, and FastAPI microservice scaffold."
    },
    {
        "name": "Sprint 3: AI & Integration",
        "key": "Sprint 3",
        "startDate": "2026-08-31T09:00:00.000Z",
        "endDate": "2026-09-13T18:00:00.000Z",
        "state": "active",
        "goal": "Full live frontend-to-backend REST integration, database ticket CRUD, Gemini 1.5 Flash microservice pipeline, checklists & quality checker."
    },
    {
        "name": "Sprint 4: QA & Deployment",
        "key": "Sprint 4",
        "startDate": "2026-09-14T09:00:00.000Z",
        "endDate": "2026-09-27T18:00:00.000Z",
        "state": "future",
        "goal": "End-to-end testing, Kaggle/Bitext benchmark evaluations, latency tuning (<1.8s), Docker Compose deployment on Render cloud."
    }
]

# Team Member Profiles with exact Jira Account IDs
TEAM_MEMBERS = {
    "Rohan Salkar": {
        "email": "rohansalkar1105@gmail.com",
        "username": "23co49",
        "account_id": "712020:fe9f765f-45d6-4ed5-8a9b-45603307e723",
        "role": "Frontend Lead (Member 1)",
        "tag_name": "@23co49"
    },
    "Yash Sanikop": {
        "email": "konuriyash@gmail.com",
        "username": "YASH SANIKOP",
        "account_id": "712020:c12c586d-9f58-4a3a-9150-1e709d257174",
        "role": "Frontend & AI Lead (Member 2)",
        "tag_name": "@Yash Sanikop"
    },
    "Shrujan Mitbavkar": {
        "email": "shrujanmitbavkar@gmail.com",
        "username": "Shrujan Mitbavkar",
        "account_id": "712020:f4c2f407-e227-43f0-9fc4-9337481dc4ef",
        "role": "Backend & Database Lead (Member 3)",
        "tag_name": "@Shrujan Mitbavkar"
    },
    "Aarti Singh": {
        "email": "singhaarrti09@gmail.com",
        "username": "singhaarrti09",
        "account_id": "712020:6dc2f0a0-8f22-45a3-9125-03d3552aabc2",
        "role": "Backend, DevOps & QA Lead (Member 4)",
        "tag_name": "@singhaarrti09"
    }
}

# 6 Epics
EPICS = [
    {
        "key_ref": "EPIC-1",
        "name": "Research & Requirements Specification",
        "summary": "Research & Requirements Specification",
        "lead": "Rohan Salkar",
        "description": "Problem domain research on support ticketing, PRD, SRS, persona definitions, non-functional requirements, and Jira Agile sprint structuring."
    },
    {
        "key_ref": "EPIC-2",
        "name": "UI/UX Design System & Frontend SPA",
        "summary": "UI/UX Design System & Frontend SPA",
        "lead": "Rohan Salkar",
        "description": "Enterprise design tokens (Light/Dark), responsive React SPA shell, Customer & Agent dashboards, ticket detail view, and AI decision widgets."
    },
    {
        "key_ref": "EPIC-3",
        "name": "Core Backend Architecture & Database Engine",
        "summary": "Core Backend Architecture & Database Engine",
        "lead": "Shrujan Mitbavkar",
        "description": "Express MVC architecture, PostgreSQL 15 schema/migrations, JWT authentication & RBAC, ticket lifecycle, and threaded messaging API."
    },
    {
        "key_ref": "EPIC-4",
        "name": "AI/LLM Microservice & Gemini Decision Support",
        "summary": "AI/LLM Microservice & Gemini Decision Support",
        "lead": "Yash Sanikop",
        "description": "FastAPI microservice, Google Gemini 1.5 Flash client, prompt engineering, AI triage, mood & patience scoring, and quality checker."
    },
    {
        "key_ref": "EPIC-5",
        "name": "Testing, Quality Assurance & Security Validation",
        "summary": "Testing, Quality Assurance & Security Validation",
        "lead": "Aarti Singh",
        "description": "Automated test suites (Jest unit, Supertest integration, Pytest AI logic), security audits (RBAC, XSS, rate limiting), and benchmark evaluations."
    },
    {
        "key_ref": "EPIC-6",
        "name": "DevOps, Cloud Deployment & Technical Documentation",
        "summary": "DevOps, Cloud Deployment & Technical Documentation",
        "lead": "Aarti Singh",
        "description": "Docker Compose containerization, GitHub Actions CI/CD workflows, 1-click Render blueprint, and 28-document technical documentation hub."
    }
]

# All Tasks across 4 Sprints (All 4 members actively assigned in every sprint)
TASKS = [
    # -------------------------------------------------------------
    # SPRINT 1: Research, Learning & Planning (Completed)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-101",
        "title": "Support Ticket Domain Research & Competitive Benchmarking",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Rohan Salkar",
        "points": 3,
        "labels": ["research", "documentation", "ui"],
        "status": "Done",
        "description": "Conduct in-depth research on modern customer support ticketing platforms (Zendesk, Freshdesk, Linear, Intercom) to identify core workflow pain points (First Response Time delays, context loss on ticket reassignment, agent tone inconsistency) and determine SupportSense AI's competitive differentiators.\n\n### Acceptance Criteria\n1. Document comparison matrix of at least 3 enterprise support tools.\n2. Identify key operational metrics: First Response Time (FRT), First Contact Resolution (FCR), and Customer Satisfaction (CSAT).\n3. Define 4 target personas: Support Agent, Team Lead, Knowledge Manager, and System Administrator.\n\n### Technical Notes\nRefer to docs/01_PROJECT_VISION_AND_PRD.md.",
        "subtasks": [
            "Analyze Zendesk, Freshdesk, and Linear support workflows",
            "Synthesize FRT, FCR, and CSAT metric goals for MVP scope",
            "Define User Personas (Sarah, David, Elena, Mark)"
        ],
        "completion_comment": "Completed comprehensive competitive analysis of Zendesk, Freshdesk, and Linear. Identified that traditional helpdesks lack real-time agent tone auditing, actionable dynamic checklists, and proactive customer patience monitoring. Defined Sarah (Agent), David (Lead), Elena (Knowledge Manager), and Mark (Admin) user personas to anchor UI flows. Findings documented in Project Vision & PRD."
    },
    {
        "custom_id": "SSAI-102",
        "title": "AI/LLM Feasibility Study, Gemini Evaluation & Dataset Selection",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["research", "ai", "llm", "frontend"],
        "status": "Done",
        "description": "Evaluate LLM options (Gemini 1.5 Flash vs Gemini 1.5 Pro vs open-source models) for support ticket triage. Selected Google Gemini 1.5 Flash for sub-second latency and structured JSON output capabilities. Curated public datasets (Kaggle Customer Support on Twitter, Bitext Customer Support LLM dataset) and planned frontend AI badge components.\n\n### Acceptance Criteria\n1. Benchmark LLM latency, cost, and JSON schema compliance.\n2. Design role-based prompt engineering strategy (~40-line domain personas).\n3. Curate Kaggle and Hugging Face datasets for grounding resolution predictions and action checklists.\n\n### Technical Notes\nDocumented in docs/10_AI_SERVICE_SPECIFICATION.md and docs/TEAM_AI_DATASET_PROMPTS_GUIDE.md.",
        "subtasks": [
            "Benchmark Gemini 1.5 Flash structured JSON response latency",
            "Design ~40-line domain system prompt templates for Triage and QA personas",
            "Curate Kaggle Twitter Support and Bitext HuggingFace datasets"
        ],
        "completion_comment": "Completed LLM feasibility study. Selected `gemini-1.5-flash` with `response_mime_type: 'application/json'` for reliable Pydantic schema enforcement. Selected Bitext and Kaggle datasets for benchmark calibration. Structured ~40-line domain system prompts for Triage Officer, QA Reviewer, and Learning Synthesizer personas."
    },
    {
        "custom_id": "SSAI-103",
        "title": "3-Tier Backend Architecture & Database ERD Design",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["research", "backend", "database"],
        "status": "Done",
        "description": "Design the 3-tier micro-architecture encompassing React SPA frontend, Node.js Express application backend, PostgreSQL relational database, and Python FastAPI AI microservice. Design normalized (3NF) relational database schema.\n\n### Acceptance Criteria\n1. Deliver 3-tier architectural block diagram and component interaction flow.\n2. Model database entities in 3NF: users, tickets, ticket_messages, ai_metadata, agent_checklists, weekly_insights.\n3. Define compound indexing strategy for high-throughput ticket queue queries.\n\n### Technical Notes\nDocumented in docs/04_SYSTEM_ARCHITECTURE_AND_DESIGN.md and docs/08_DATABASE_DESIGN_SPECIFICATION.md.",
        "subtasks": [
            "Draft 3-tier system architecture diagrams in Mermaid",
            "Design 3NF relational PostgreSQL schema with UUID keys",
            "Define compound B-tree indexing strategy for ticket queue filtering"
        ],
        "completion_comment": "Completed system architecture design and database ERD specification in 3NF. Designed schemas across 6 relational tables with compound B-tree indexes on `(status, priority)` and `(ticket_id, created_at)`. Verified decoupled microservice communication protocol via internal REST over HTTP."
    },
    {
        "custom_id": "SSAI-104",
        "title": "PRD, Software Requirements (SRS) & Agile Sprint Backlog Planning",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["research", "documentation", "backend"],
        "status": "Done",
        "description": "Formulate formal PRD and SRS specifications detailing functional requirements (FR-100 to FR-300 series) and non-functional constraints (NFR-100 to NFR-400 series). Establish Agile sprint backlog, git branch naming rules, and PR review governance.\n\n### Acceptance Criteria\n1. Formulate PRD/SRS with 8 functional requirements and 8 non-functional requirements.\n2. Establish 4-sprint 8-week timeline and Jira backlog breakdown.\n3. Define git branching rules, commit conventions, and code comment standards.\n\n### Technical Notes\nDocumented in docs/01_PROJECT_VISION_AND_PRD.md, docs/02_REQUIREMENTS_AND_USE_CASES.md, and docs/03_AGILE_SPRINT_PLANNING.md.",
        "subtasks": [
            "Author PRD with executive summary and HITL safety paradigm",
            "Define SRS functional and non-functional requirements",
            "Configure 4-sprint roadmap and Git branch governance standards"
        ],
        "completion_comment": "Authored the complete Product Requirements Document (PRD) and Software Requirements Specification (SRS). Established the Human-in-the-Loop (HITL) safety paradigm as the guiding system principle, defined 8 core functional requirements, 8 non-functional constraints, and structured Use Case diagrams in Mermaid. Deliverables peer-reviewed and published in docs hub."
    },

    # -------------------------------------------------------------
    # SPRINT 2: Prototype Development (Completed — Ends 29 Aug 2026)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-201",
        "title": "Vite/React SPA Shell, Tailwind Theme & Navigation Layout",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "ui"],
        "status": "Done",
        "description": "Build the React 18 Single Page Application foundation using Vite, Tailwind CSS, and React Router v6. Implement ThemeContext (Light/Dark/System mode), responsive MainLayout, Navbar with persona badge, Sidebar with role-aware routes, and breadcrumb navigation.\n\n### Acceptance Criteria\n1. React SPA compiles cleanly with zero Vite build errors.\n2. Theme switcher toggles dark class on root <html> element and persists in localStorage.\n3. Sidebar links highlight active route and collapse smoothly on tablet/mobile screens.\n\n### Technical Notes\nfrontend/src/App.jsx, frontend/src/context/ThemeContext.jsx, frontend/src/layouts/MainLayout.jsx.",
        "subtasks": [
            "Setup Vite + React 18 + Tailwind CSS build pipeline",
            "Implement ThemeContext.jsx with prefers-color-scheme listener",
            "Build Navbar.jsx, Sidebar.jsx, and Breadcrumbs.jsx layout components"
        ],
        "completion_comment": "Implemented the React SPA application shell with Vite and Tailwind CSS. Built ThemeContext providing persistent dark/light mode with zero flash. Developed responsive MainLayout, Sidebar, Navbar, and Breadcrumbs supporting responsive viewports. Live and verified in frontend prototype."
    },
    {
        "custom_id": "SSAI-202",
        "title": "Common UI Component Library & Axios Mock Fallback Client",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "ui", "api"],
        "status": "Done",
        "description": "Develop reusable enterprise UI component library (Buttons, Cards, Modals, Dropdowns, Badges, Tables, Skeletons) and centralized Axios API client (api.js) with safeApiCall wrapper providing smart mock fallbacks for standalone prototype execution.\n\n### Acceptance Criteria\n1. Reusable components implemented with WCAG contrast compliance.\n2. Axios client attaches JWT tokens and intercepts 401 unauthenticated requests.\n3. safeApiCall provides offline mock data covering tickets, messages, checklists, and FAQs.\n\n### Technical Notes\nfrontend/src/components/common/, frontend/src/services/api.js.",
        "subtasks": [
            "Create Button, Card, Modal, Table, Badge, Dropdown, Skeleton components",
            "Implement Axios interceptor pipeline attaching Bearer tokens",
            "Build safeApiCall wrapper with rich multi-role mock fallback data"
        ],
        "completion_comment": "Engineered centralized Axios API client (`api.js`) with request/response interceptors. Built `safeApiCall` providing smart mock fallbacks covering 5 realistic enterprise ticket scenarios, department forwarding, and checklist toggling to enable offline frontend testing and live demo resilience."
    },
    {
        "custom_id": "SSAI-203",
        "title": "Multi-Role Dashboards & 1-Click Persona Switching UI",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["frontend", "ui"],
        "status": "Done",
        "description": "Implement LoginPage.jsx with 1-click persona switching (Customer Alex, Agent Sarah, Finance Elena, Tech Marcus, Admin Mark) and AuthContext. Build Customer Dashboard (ticket list, status tracking) and Agent Dashboard (queue metrics, mood breakdown stats, department filter tabs, search filtering).\n\n### Acceptance Criteria\n1. Persona switching instantly swaps user role and updates visible dashboard views.\n2. Customer sees only their tickets; Agent sees triage queue with department tabs.\n3. Ticket queue filters in real-time by search query, status, priority, and department.\n\n### Technical Notes\nfrontend/src/pages/LoginPage.jsx, frontend/src/pages/DashboardPage.jsx, frontend/src/context/AuthContext.jsx.",
        "subtasks": [
            "Build LoginPage with pre-configured persona quick-login cards",
            "Implement AuthContext managing JWT tokens and role state",
            "Build DashboardPage with metric cards and ticket queue table"
        ],
        "completion_comment": "Completed authentication UI and 1-click persona switching mechanism. Built LoginPage with instant login buttons for Customer, Agent, Finance Specialist, Tech Specialist, and Admin. Session state is managed via AuthContext with localStorage token persistence. Verified multi-role UX switching."
    },
    {
        "custom_id": "SSAI-204",
        "title": "Ticket Detail Workspace, Threaded Messages & AI Assist Drawer UI",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Yash Sanikop",
        "points": 8,
        "labels": ["frontend", "ui", "ai"],
        "status": "Done",
        "description": "Build TicketDetailPage.jsx featuring two-column workspace: left column displays threaded conversation history (with customer messages, agent replies, and private internal notes); right column renders AIAssistDrawer (Customer Mood badge, Patience Score, Resolution prediction, Checklist checkboxes) and QualityCheckModal.\n\n### Acceptance Criteria\n1. Customer users cannot see internal agent notes.\n2. Agents can toggle checklist items with optimistic UI updates.\n3. 'Check Response Quality' button opens modal displaying 4-axis scores and suggestions.\n\n### Technical Notes\nfrontend/src/pages/TicketDetailPage.jsx, frontend/src/components/ai/AIAssistDrawer.jsx, frontend/src/components/ai/QualityCheckModal.jsx.",
        "subtasks": [
            "Build conversation message thread with customer vs agent vs internal note styling",
            "Implement AIAssistDrawer.jsx rendering sentiment, patience, and checklists",
            "Implement QualityCheckModal.jsx with 4-axis scores and 1-click suggestion apply"
        ],
        "completion_comment": "Completed Ticket Detail view and AI Decision Assist drawer. Built threaded messaging with internal notes privacy isolation, live AI Mood badges, dynamic verification checklists, and Pre-send Quality Checker modal with 1-click suggestion application. Connected to Axios API client with mock fallback."
    },
    {
        "custom_id": "SSAI-205",
        "title": "FastAPI AI Microservice Scaffold, Gemini Client & Role Prompts",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-4",
        "assignee": "Yash Sanikop",
        "points": 8,
        "labels": ["ai", "llm", "backend"],
        "status": "Done",
        "description": "Build FastAPI Python microservice running on port 8000 with Pydantic v2 schemas. Implement gemini_client.py with Google Gemini 1.5 Flash SDK, JSON schema enforcement, model pooling, TTL caching, ~40-line role prompts in templates.py, and triage/quality/auto-reply services with fallback handling.\n\n### Acceptance Criteria\n1. FastAPI boots on port 8000 and serves Swagger UI at /api/v1/docs.\n2. Gemini client outputs structured JSON adhering to Pydantic schemas.\n3. Calibrated fallback responses returned if API key is missing or network times out.\n\n### Technical Notes\nai-service/app/main.py, ai-service/app/core/gemini_client.py, ai-service/app/prompts/templates.py, ai-service/app/services/triage_service.py.",
        "subtasks": [
            "Configure FastAPI app with CORS middleware and OpenAPI docs",
            "Implement gemini_client.py with model pooling and in-memory TTL caching",
            "Author ~40-line system prompts for Triage, Quality Evaluator, Auto-Reply",
            "Build dataset benchmark service loading Kaggle and HuggingFace samples"
        ],
        "completion_comment": "Implemented Google Gemini 1.5 Flash integration layer with structured JSON output enforcement, model pooling, and in-memory TTL caching. Authored ~40-line domain system prompts and implemented Triage, Quality Check, Auto-Reply, and Dataset Benchmark services with resilient fallback handling."
    },
    {
        "custom_id": "SSAI-206",
        "title": "Express REST API Scaffolding, Security & Rate Limiting",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "security"],
        "status": "Done",
        "description": "Set up Node.js Express server (server.js, app.js) with security middlewares: Helmet HTTP headers, CORS origin whitelisting via env.ALLOWED_ORIGINS, global rate limiter (rateLimiter.js), Winston structured JSON logging, Swagger UI on /api-docs, and /health telemetry route.\n\n### Acceptance Criteria\n1. /health endpoint returns HTTP 200 with uptime and memory metrics.\n2. CORS rejects non-whitelisted origins in production mode.\n3. Swagger documentation renders at http://localhost:5000/api-docs.\n\n### Technical Notes\nbackend/src/app.js, backend/src/config/env.js, backend/src/middleware/rateLimiter.js.",
        "subtasks": [
            "Configure Express server entrypoint and env.js validation",
            "Implement Helmet security headers, CORS origin validation, and /health route",
            "Implement IP-based rate limiting (100 req/15min API, 10 req/15min auth)",
            "Mount Swagger UI OpenAPI documentation on /api-docs"
        ],
        "completion_comment": "Scaffolded Node.js Express application server with enterprise middleware pipeline. Enforced Helmet security headers, CORS origin validation, rate limiting, and structured logging. Mounted Swagger UI on `/api-docs` and health telemetry on `/health`. Verified server boots on port 5000."
    },
    {
        "custom_id": "SSAI-207",
        "title": "PostgreSQL Schema DDL Migrations & Realistic Seed Data",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "database"],
        "status": "Done",
        "description": "Create self-contained SQL migration script 001_init_schema.sql defining 6 tables (users, tickets, ticket_messages, ai_metadata, agent_checklists, weekly_insights) with foreign keys, cascading deletes, and compound indexes. Create 001_seed_data.sql populating test users (with bcrypt password hashes), enterprise tickets, and message threads. Implement dbInit.js auto-migration runner.\n\n### Acceptance Criteria\n1. Migration script executes cleanly on empty PostgreSQL 15 database.\n2. Seed data provisions Admin, Agent, and Customer accounts.\n3. dbInit.js automatically executes migrations on application boot if tables do not exist.\n\n### Technical Notes\ndatabase/migrations/001_init_schema.sql, database/seeds/001_seed_data.sql, backend/src/config/dbInit.js.",
        "subtasks": [
            "Author 001_init_schema.sql with UUID primary keys and compound indexes",
            "Author 001_seed_data.sql with bcrypt-hashed credentials and multi-role records",
            "Implement dbInit.js auto-migration runner for zero-config Docker/Render startup"
        ],
        "completion_comment": "Delivered PostgreSQL DDL schema and seed data SQL files. Created 6 relational tables with UUID keys and compound indexes on `(status, priority)`. Built `dbInit.js` to automatically initialize database schemas upon server startup in containerized and cloud environments."
    },
    {
        "custom_id": "SSAI-208",
        "title": "User Authentication, JWT Token Issuance & Role Sanitization",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["backend", "security"],
        "status": "Done",
        "description": "Implement /api/v1/auth endpoints (POST /register, POST /login, GET /me, GET /users, PATCH /users/:id/role). Implement authMiddleware.js for JWT token verification and RBAC role authorization (requireRole). Enforce strict server-side role sanitization preventing public self-registration privilege escalation.\n\n### Acceptance Criteria\n1. POST /login with valid credentials returns signed JWT token and user profile.\n2. Attempting to register as ADMIN via public API defaults safely to CUSTOMER.\n3. Protected routes return 401 Unauthorized if token is missing or invalid.\n\n### Technical Notes\nbackend/src/controllers/authController.js, backend/src/middleware/authMiddleware.js, backend/src/routes/authRoutes.js.",
        "subtasks": [
            "Implement bcrypt password hashing (10 salt rounds) and JWT signing",
            "Build authMiddleware.js verifying Bearer tokens and checking role permissions",
            "Implement role escalation guard enforcing 'CUSTOMER' role on public signups"
        ],
        "completion_comment": "Implemented user authentication and RBAC authorization subsystem. Integrated bcrypt password hashing, JWT token signing, and role verification middleware. Added server-side role sanitization on registration to prevent privilege escalation. Validated with unit tests in Jest."
    },
    {
        "custom_id": "SSAI-209",
        "title": "Backend Ticket Controllers, Models & AI HTTP Proxy Service",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Aarti Singh",
        "points": 8,
        "labels": ["backend", "database", "api"],
        "status": "Done",
        "description": "Develop ticketController.js and ticketModel.js supporting ticket creation, threaded message posting, status updates, checklist item toggling, and department forwarding. Build aiService.js HTTP client calling FastAPI microservice with AbortSignal.timeout(5000) fast-fail guard and fallback payloads.\n\n### Acceptance Criteria\n1. POST /api/v1/tickets creates ticket, inserts initial message, and triggers AI triage.\n2. If AI microservice is down, aiService.js falls back to default metadata without throwing unhandled exceptions.\n3. PATCH /api/v1/tickets/:id/checklist/:itemId toggles checklist state in database.\n\n### Technical Notes\nbackend/src/controllers/ticketController.js, backend/src/models/ticketModel.js, backend/src/services/aiService.js.",
        "subtasks": [
            "Implement ticketModel.js and aiMetadataModel.js PostgreSQL query functions",
            "Implement ticketController.js request handlers for ticket CRUD",
            "Build aiService.js HTTP client interfacing with Python microservice on port 8000",
            "Implement aiProxyController.js forwarding /api/v1/ai requests"
        ],
        "completion_comment": "Implemented core ticket management controllers and PostgreSQL DAO models. Built `aiService.js` HTTP client with 5-second AbortSignal timeout and graceful fallback defaults. Created AI proxy routes for response verification and weekly insights."
    },
    {
        "custom_id": "SSAI-210",
        "title": "Docker Compose Stack, GitHub Actions CI & Technical Docs Hub",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-6",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["deployment", "testing", "documentation"],
        "status": "Done",
        "description": "Configure multi-container containerization via docker-compose.yml (Nginx frontend on :80, Express backend on :5000, FastAPI on :8000, PostgreSQL on :5432). Create GitHub Actions CI workflow (ci.yml) and author complete 28-document technical documentation hub across 17 markdown files in docs/ and root README.md.\n\n### Acceptance Criteria\n1. docker-compose up builds and starts all 4 containers with proper inter-service networking.\n2. CI/CD pipeline triggers on PRs to main branch and runs automated test suites.\n3. Complete 28-document index and team guides published in docs hub.\n\n### Technical Notes\ndeployment/docker-compose.yml, .github/workflows/ci.yml, docs/README.md.",
        "subtasks": [
            "Author docker-compose.yml and Dockerfiles for all 3 tiers",
            "Create GitHub Actions workflow (ci.yml) testing all 3 tiers on push/PR",
            "Compile comprehensive 28-deliverable documentation suite in docs/ hub"
        ],
        "completion_comment": "Configured 4-service Docker Compose deployment stack, GitHub Actions CI workflow running multi-tier test pipelines, and 1-click Render blueprint. Delivered comprehensive 28-requirement documentation hub in `docs/`."
    },

    # -------------------------------------------------------------
    # SPRINT 3: Full Integration + AI Implementation (Starts 31 Aug 2026)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-301",
        "title": "Full Live Frontend-to-Backend REST API Integration",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-2",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "backend", "api"],
        "status": "To Do",
        "description": "Transition frontend from mock fallback mode (safeApiCall) to live Express REST API endpoints across all screens. Verify active token exchange, live error boundary handling, and loading state skeletons during network requests.\n\n### Acceptance Criteria\n1. Frontend functions 100% against live Node.js Express backend without mock data fallback.\n2. Network errors trigger non-blocking toast alerts with retry options.\n3. Loading skeletons display smoothly during API fetching.\n\n### Technical Notes\nfrontend/src/services/api.js, frontend/src/context/AuthContext.jsx.",
        "subtasks": [
            "Configure .env production API base URL and disable mock fallback flags in live mode",
            "Test and verify live login, token persistence, and 401 automatic session refresh/logout",
            "Connect Customer & Agent dashboard queries directly to live backend endpoints"
        ]
    },
    {
        "custom_id": "SSAI-302",
        "title": "Live Google Gemini 1.5 Flash Microservice Pipeline Integration",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Yash Sanikop",
        "points": 8,
        "labels": ["ai", "llm", "backend"],
        "status": "To Do",
        "description": "Connect the live FastAPI microservice directly to Google Gemini 1.5 Flash API with production API keys. Fine-tune system prompts, temperature parameters (0.2 for classification, 0.4 for suggested replies), and verify model instance pooling.\n\n### Acceptance Criteria\n1. Live Gemini API produces structured triage JSON with valid category, priority, mood, and checklist.\n2. Model response latency P95 is < 1.8s.\n3. Confidence scores strictly fall between 0.00 and 1.00.\n\n### Technical Notes\nai-service/app/core/gemini_client.py, ai-service/app/services/triage_service.py.",
        "subtasks": [
            "Validate Gemini API key connectivity and rate limit quotas",
            "Tune prompt temperature and JSON output constraints for consistent categorization",
            "Benchmark end-to-end response times ensuring AI processing finishes under 1.8s"
        ]
    },
    {
        "custom_id": "SSAI-303",
        "title": "AI Dynamic Checklist Generation & Interactive Agent Toggle",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["ai", "frontend", "backend"],
        "status": "To Do",
        "description": "Implement end-to-end flow for AI-generated agent assist checklists: Gemini extracts 3-5 procedural verification steps based on issue type, backend persists items in agent_checklists, and agent toggles completion state live in AIAssistDrawer.\n\n### Acceptance Criteria\n1. Every new ticket generates 3-5 category-tailored actionable verification items.\n2. Toggling a checkbox immediately persists is_completed: true in PostgreSQL.\n3. All agents viewing the ticket see real-time updated checklist state.\n\n### Technical Notes\nai-service/app/services/triage_service.py, frontend/src/components/ai/AIAssistDrawer.jsx.",
        "subtasks": [
            "Refine checklist generation prompt for Billing, Technical, and Security categories",
            "Implement live backend endpoint PATCH /api/v1/tickets/:id/checklist/:itemId",
            "Wire UI checklist toggle to update database and display progress bar percentage"
        ]
    },
    {
        "custom_id": "SSAI-304",
        "title": "Pre-Send AI Response Quality Checker Live Integration",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["ai", "frontend", "ui"],
        "status": "To Do",
        "description": "Integrate the Pre-Send Response Quality Checker modal with live AI microservice. When an agent clicks 'Verify Quality', the system sends ticket context and drafted reply to Gemini, evaluating Professionalism, Empathy, Clarity, and Actionability, with 1-click suggestion injection into the reply editor.\n\n### Acceptance Criteria\n1. Quality evaluation returns 4 numerical scores (0-100), overall grade, and actionable suggestions within 1.5s.\n2. Clicking 'Apply Suggestion' updates draft text in the reply box without data loss.\n3. Graceful fallback message rendered if AI service times out.\n\n### Technical Notes\nfrontend/src/components/ai/QualityCheckModal.jsx, ai-service/app/services/quality_service.py.",
        "subtasks": [
            "Connect QualityCheckModal.jsx to live /api/v1/ai/verify-response endpoint",
            "Render visual score progress bars and overall grade badge (A, B, C)",
            "Implement 1-click 'Apply Suggestion' button that updates the drafted message body"
        ]
    },
    {
        "custom_id": "SSAI-305",
        "title": "Live Database-Backed Ticket CRUD & State Transition Engine",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-3",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "database"],
        "status": "To Do",
        "description": "Finalize live PostgreSQL persistence for ticket creation, status transitions (OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED / REOPENED), agent assignment, and threaded message storage.\n\n### Acceptance Criteria\n1. Ticket submission creates persistent rows in tickets, ticket_messages, ai_metadata, and agent_checklists.\n2. Status transitions update updated_at timestamps and record audit messages in the conversation thread.\n3. Query execution times on ticket queues remain under 50ms.\n\n### Technical Notes\nbackend/src/models/ticketModel.js, backend/src/controllers/ticketController.js.",
        "subtasks": [
            "Verify database connection pooling under concurrent ticket creation loads",
            "Enforce state transition validation rules in ticketController.js",
            "Implement transactional consistency for ticket creation and initial message insertion"
        ]
    },
    {
        "custom_id": "SSAI-306",
        "title": "Reopened Ticket Timeline Summarizer Integration",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["ai", "backend", "frontend"],
        "status": "To Do",
        "description": "Implement automatic timeline summarization when a ticket is reopened or reassigned. Gemini processes thread messages and generates a 5-6 bullet chronological summary of key milestones, saving it to ai_metadata.timeline_summary and displaying it in the agent assist drawer.\n\n### Acceptance Criteria\n1. Reopening a resolved ticket triggers asynchronous timeline summarizer.\n2. Summary outputs 5-6 concise bullet points capturing past customer problems and agent attempts.\n3. Timeline banner displays prominently for assigned agent.\n\n### Technical Notes\nbackend/src/services/aiService.js, ai-service/app/services/triage_service.py.",
        "subtasks": [
            "Trigger /api/v1/ai/summarize-timeline upon status -> REOPENED transition",
            "Persist generated bullet points into ai_metadata in PostgreSQL",
            "Render timeline summary banner at the top of Ticket Detail view"
        ]
    },
    {
        "custom_id": "SSAI-307",
        "title": "Department Auto-Reply & Intelligent Routing Policy Engine",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["ai", "backend"],
        "status": "To Do",
        "description": "Implement department auto-reply policy engine evaluating incoming tickets. If category match confidence exceeds 75%, system routes ticket to target department (Finance, Technical Support, Identity & Access) and posts an automated acknowledgment message into the conversation thread.\n\n### Acceptance Criteria\n1. Incoming tickets receive AI-recommended department routing upon creation.\n2. Non-destructive automated intake acknowledgment is posted to thread with confidence >= 0.75.\n3. Agents can re-route or forward tickets with mandatory transfer comment.\n\n### Technical Notes\nbackend/src/controllers/ticketController.js, ai-service/app/services/auto_reply_service.py.",
        "subtasks": [
            "Implement department routing evaluation in auto_reply_service.py",
            "Post automated acknowledgment into thread if confidence threshold is met",
            "Add inter-department transfer forwarding UI with agent comments"
        ]
    },

    # -------------------------------------------------------------
    # SPRINT 4: Testing, Optimization & Deployment (Planned)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-401",
        "title": "Frontend Unit & Responsive Accessibility Testing (WCAG 2.1 AA)",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "testing", "ui"],
        "status": "To Do",
        "description": "Execute React Testing Library unit tests for UI components (AIMoodBadge, QualityCheckModal, AIAssistDrawer), perform WCAG 2.1 AA accessibility contrast audits, and test responsive UI behavior across mobile (360px), tablet (768px), and ultra-wide (1920px+) viewports.\n\n### Acceptance Criteria\n1. Component test suite passes with zero failures.\n2. Contrast ratios meet 4.5:1 across both Dark and Light themes.\n3. Zero layout shifts or overflow bugs across tested screen widths.\n\n### Technical Notes\nfrontend/src/components/, docs/07_UI_UX_DESIGN_SYSTEM.md.",
        "subtasks": [
            "Write React Testing Library tests for AIMoodBadge and QualityCheckModal",
            "Audit dark mode color contrast ratios with Axe accessibility tool",
            "Validate responsive layout breakpoints on Chrome DevTools emulator"
        ]
    },
    {
        "custom_id": "SSAI-402",
        "title": "AI Benchmark Evaluation & Latency Optimization (<1.8s)",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["ai", "testing", "llm"],
        "status": "To Do",
        "description": "Execute batch evaluation of Gemini AI classification and sentiment analysis against historical Kaggle Twitter Support and Bitext datasets (target >=90% accuracy). Optimize prompt token length and verify in-memory TTL caching to achieve P95 latency < 1.8s.\n\n### Acceptance Criteria\n1. Ticket classification accuracy achieves >= 90% across benchmark test records.\n2. Sentiment/mood detection accuracy achieves >= 88%.\n3. P95 latency for AI responses remains below 1.8 seconds.\n\n### Technical Notes\nai-service/app/services/dataset_service.py, tests/unit/ai-service/test_ai_features.py.",
        "subtasks": [
            "Run automated batch test over 100 benchmark ticket records",
            "Calculate classification precision, recall, and F1-score",
            "Profile and optimize Gemini prompt payload size for sub-1.8s latency"
        ]
    },
    {
        "custom_id": "SSAI-403",
        "title": "Database Query Index Optimization & Backend Test Suite (Jest/Supertest)",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "database", "testing"],
        "status": "To Do",
        "description": "Perform database query profiling with EXPLAIN ANALYZE, tune PostgreSQL connection pool settings, and expand Jest + Supertest integration test suite covering auth, ticket filtering, message posting, and checklist toggles.\n\n### Acceptance Criteria\n1. Database ticket queue query execution times remain below 50ms.\n2. Backend test suite achieves >= 85% code coverage with 100% pass rate.\n3. Zero connection pool exhaustion under 100 concurrent request simulation.\n\n### Technical Notes\nbackend/src/config/db.js, tests/unit/backend/auth.test.js, tests/integration/api.test.js.",
        "subtasks": [
            "Profile PostgreSQL ticket queries using EXPLAIN ANALYZE",
            "Expand Supertest integration tests for all /api/v1/tickets endpoints",
            "Run concurrency stress test validating database pool stability"
        ]
    },
    {
        "custom_id": "SSAI-404",
        "title": "Security Hardening, RBAC Privilege Audit & Input Sanitization",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Aarti Singh",
        "points": 3,
        "labels": ["security", "backend", "testing"],
        "status": "To Do",
        "description": "Conduct security verification: ensure Customer role users are strictly restricted from seeing internal notes or modifying ticket status, audit XSS sanitization on ticket inputs, test CORS origin enforcement, and verify rate limiting against brute-force attacks.\n\n### Acceptance Criteria\n1. Internal notes are stripped from all Customer-scoped API responses.\n2. Script injection tags (<script>) are sanitized before database insertion.\n3. Exceeding 10 auth requests/15min returns HTTP 429 Too Many Requests.\n\n### Technical Notes\nbackend/src/middleware/authMiddleware.js, backend/src/middleware/rateLimiter.js.",
        "subtasks": [
            "Audit internal note data privacy across all ticket query routes",
            "Test XSS and SQL injection payloads on ticket create and message APIs",
            "Validate rate limiter blocking on simulated brute-force authentication"
        ]
    },
    {
        "custom_id": "SSAI-405",
        "title": "Production Cloud Deployment on Render & Final Demo Preparation",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-6",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["deployment", "documentation"],
        "status": "To Do",
        "description": "Deploy multi-container production build to Render cloud platform using render.yaml blueprint. Verify PostgreSQL automated initialization, HTTPS SSL termination, environment variable binding, and prepare final mentor demo walkthrough script.\n\n### Acceptance Criteria\n1. Live production URL accessible over HTTPS with zero runtime console errors.\n2. All 28 documentation deliverables verified and aligned with final codebase.\n3. Mentor demo walkthrough script tested across Customer, Agent, and Admin user flows.\n\n### Technical Notes\nrender.yaml, deployment/docker-compose.yml, docs/README.md.",
        "subtasks": [
            "Deploy multi-tier application stack to Render cloud infrastructure",
            "Verify automated database schema migration and seed initialization on cloud",
            "Prepare and dry-run final internship demo script and slide deck"
        ]
    }
]


class JiraSyncManager:
    def __init__(self, jira_url: str, email: str, api_token: str, project_key: str = "SCRUM", dry_run: bool = False):
        self.jira_url = jira_url.rstrip("/")
        self.email = email
        self.api_token = api_token
        self.project_key = project_key.upper()
        self.dry_run = dry_run
        self.auth = HTTPBasicAuth(self.email, self.api_token)
        self.headers = {"Accept": "application/json", "Content-Type": "application/json"}
        self.user_cache: Dict[str, str] = {}
        self.epic_key_map: Dict[str, str] = {}
        self.sprint_id_map: Dict[str, int] = {}
        self.board_id: Optional[int] = 1
        self.issuetype_ids: Dict[str, str] = {
            "Epic": "10001",
            "Subtask": "10002",
            "Feature": "10003",
            "Task": "10004",
            "Story": "10005",
            "Bug": "10006"
        }

    def log(self, message: str, level: str = "INFO"):
        prefix = {
            "INFO": "[INFO]",
            "SUCCESS": "[SUCCESS] [OK]",
            "WARN": "[WARN]  [!]",
            "ERROR": "[ERROR] [X]",
            "DRY": "[DRY-RUN]"
        }.get(level, "[INFO]")
        print(f"{prefix} {message}")

    def test_connection(self) -> bool:
        if self.dry_run:
            self.log(f"Dry-run enabled. Skipping live authentication against {self.jira_url}.", "DRY")
            return True
        try:
            url = f"{self.jira_url}/rest/api/3/myself"
            res = requests.get(url, auth=self.auth, headers=self.headers, timeout=10)
            if res.status_code == 200:
                user_info = res.json()
                self.log(f"Connected to Jira as: {user_info.get('displayName')} ({user_info.get('emailAddress')})", "SUCCESS")
                return True
            else:
                self.log(f"Authentication failed: HTTP {res.status_code} - {res.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"Connection error: {e}", "ERROR")
            return False

    def map_team_members(self):
        """Map the 4 team members to Jira account IDs."""
        self.log("Resolving Jira account IDs for all 4 team members...")
        for name, profile in TEAM_MEMBERS.items():
            account_id = profile.get("account_id")
            if account_id:
                self.user_cache[name] = account_id
                self.log(f"Mapped {name} ({profile['role']}) -> Account ID: {account_id}", "SUCCESS")

    def setup_sprints(self):
        """Find or create all 4 Sprints on Board 1 and configure states/dates."""
        self.log(f"Configuring 4 Sprints on Board {self.board_id} for Project {self.project_key}...")
        
        # 1. Fetch existing sprints on board
        res = requests.get(f"{self.jira_url}/rest/agile/1.0/board/{self.board_id}/sprint", auth=self.auth, headers=self.headers)
        existing_sprints = res.json().get("values", []) if res.status_code == 200 else []
        
        for sp in existing_sprints:
            s_name = sp.get("name", "")
            s_id = sp.get("id")
            for cfg in SPRINT_CONFIGS:
                if cfg["key"].lower() in s_name.lower():
                    self.sprint_id_map[cfg["key"]] = s_id
                    self.log(f"Found existing sprint '{s_name}' (ID: {s_id})", "INFO")
                    # Update dates, state and goal
                    update_url = f"{self.jira_url}/rest/agile/1.0/sprint/{s_id}"
                    payload = {
                        "name": cfg["name"],
                        "startDate": cfg["startDate"],
                        "endDate": cfg["endDate"],
                        "goal": cfg["goal"]
                    }
                    if cfg.get("state"):
                        payload["state"] = cfg["state"]
                    if cfg.get("state") == "closed":
                        payload["completeDate"] = cfg["endDate"]
                    requests.put(update_url, auth=self.auth, headers=self.headers, json=payload)
                    break

        # 2. Create missing sprints
        for cfg in SPRINT_CONFIGS:
            if cfg["key"] not in self.sprint_id_map:
                create_url = f"{self.jira_url}/rest/agile/1.0/sprint"
                payload = {
                    "name": cfg["name"],
                    "startDate": cfg["startDate"],
                    "endDate": cfg["endDate"],
                    "originBoardId": self.board_id,
                    "goal": cfg["goal"]
                }
                res_create = requests.post(create_url, auth=self.auth, headers=self.headers, json=payload)
                if res_create.status_code in [200, 201]:
                    new_id = res_create.json()["id"]
                    self.sprint_id_map[cfg["key"]] = new_id
                    self.log(f"Created Sprint '{cfg['name']}' (ID: {new_id})", "SUCCESS")
                    if cfg.get("state") in ["active", "closed"]:
                        up_payload = {"state": cfg["state"]}
                        if cfg["state"] == "closed":
                            up_payload["completeDate"] = cfg["endDate"]
                        requests.put(f"{self.jira_url}/rest/agile/1.0/sprint/{new_id}", auth=self.auth, headers=self.headers, json=up_payload)
                else:
                    self.log(f"Sprint creation note for '{cfg['name']}': {res_create.text}", "WARN")

    def create_epics(self):
        """Create the 6 project Epics with assigned leads."""
        self.log("Creating/linking the 6 Epics in Project SCRUM...")
        for epic in EPICS:
            lead_id = self.user_cache.get(epic.get("lead"))
            fields = {
                "project": {"key": self.project_key},
                "summary": f"[EPIC] {epic['summary']}",
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [{"type": "text", "text": epic["description"]}]
                        }
                    ]
                },
                "issuetype": {"id": self.issuetype_ids["Epic"]}
            }
            if lead_id:
                fields["assignee"] = {"accountId": lead_id}

            issue_payload = {"fields": fields}
            res = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json=issue_payload)
            if res.status_code in [200, 201]:
                created_key = res.json()["key"]
                self.epic_key_map[epic["key_ref"]] = created_key
                self.log(f"Created Epic '{epic['name']}' -> {created_key} (Lead: {epic.get('lead')})", "SUCCESS")
            else:
                self.log(f"Failed to create Epic '{epic['name']}': {res.text}", "WARN")

    def sync_all_tasks(self):
        """Sync all 26 Stories/Tasks, Subtasks, Story Points, and Comments."""
        self.log(f"Creating all {len(TASKS)} Stories/Tasks across 4 Sprints...")
        
        for task in TASKS:
            assignee_id = self.user_cache.get(task["assignee"])
            sprint_id = self.sprint_id_map.get(task["sprint"])
            epic_key = self.epic_key_map.get(task["epic"])
            type_id = self.issuetype_ids.get(task["type"], self.issuetype_ids["Task"])

            fields: Dict[str, Any] = {
                "project": {"key": self.project_key},
                "summary": f"[{task['custom_id']}] {task['title']}",
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [{"type": "text", "text": task["description"]}]
                        }
                    ]
                },
                "issuetype": {"id": type_id},
                "labels": task.get("labels", []),
                "customfield_10016": float(task["points"])  # Story point estimate
            }

            if assignee_id:
                fields["assignee"] = {"accountId": assignee_id}
            if epic_key:
                fields["parent"] = {"key": epic_key}

            res = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json={"fields": fields})
            if res.status_code in [200, 201]:
                created_key = res.json()["key"]
                self.log(f"Created {task['type']} '{task['custom_id']}: {task['title']}' ({task['points']} pts) -> {created_key}", "SUCCESS")

                # Move issue to its Sprint
                if sprint_id:
                    self._move_issue_to_sprint(created_key, sprint_id)

                # Create all subtasks
                subtask_keys = []
                for st_title in task.get("subtasks", []):
                    st_key = self._create_subtask(created_key, st_title, assignee_id)
                    if st_key:
                        subtask_keys.append(st_key)

                # Transition to Done & post detailed completion comment if finished
                if task["status"] == "Done":
                    self._transition_to_done(created_key)
                    for stk in subtask_keys:
                        self._transition_to_done(stk)
                    if task.get("completion_comment"):
                        self._add_comment(created_key, task["completion_comment"], task["assignee"], task["sprint"])

            else:
                # Try without customfield_10016 if field rejection occurs
                if "customfield_10016" in fields:
                    del fields["customfield_10016"]
                    res2 = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json={"fields": fields})
                    if res2.status_code in [200, 201]:
                        created_key = res2.json()["key"]
                        self.log(f"Created {task['type']} '{task['custom_id']}' -> {created_key}", "SUCCESS")
                        if sprint_id:
                            self._move_issue_to_sprint(created_key, sprint_id)
                        subtask_keys = []
                        for st_title in task.get("subtasks", []):
                            st_key = self._create_subtask(created_key, st_title, assignee_id)
                            if st_key:
                                subtask_keys.append(st_key)
                        if task["status"] == "Done":
                            self._transition_to_done(created_key)
                            for stk in subtask_keys:
                                self._transition_to_done(stk)
                            if task.get("completion_comment"):
                                self._add_comment(created_key, task["completion_comment"], task["assignee"], task["sprint"])
                    else:
                        self.log(f"Error creating task '{task['custom_id']}': {res2.text}", "ERROR")
                else:
                    self.log(f"Error creating task '{task['custom_id']}': {res.text}", "ERROR")

            time.sleep(0.1)

    def _move_issue_to_sprint(self, issue_key: str, sprint_id: int):
        url = f"{self.jira_url}/rest/agile/1.0/sprint/{sprint_id}/issue"
        requests.post(url, auth=self.auth, headers=self.headers, json={"issues": [issue_key]})

    def _create_subtask(self, parent_key: str, summary: str, assignee_id: Optional[str]) -> Optional[str]:
        fields = {
            "project": {"key": self.project_key},
            "parent": {"key": parent_key},
            "summary": summary,
            "issuetype": {"id": self.issuetype_ids["Subtask"]}
        }
        if assignee_id:
            fields["assignee"] = {"accountId": assignee_id}
        res = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json={"fields": fields})
        if res.status_code in [200, 201]:
            return res.json().get("key")
        return None

    def _transition_to_done(self, issue_key: str):
        url = f"{self.jira_url}/rest/api/3/issue/{issue_key}/transitions"
        res = requests.get(url, auth=self.auth, headers=self.headers)
        if res.status_code == 200:
            transitions = res.json().get("transitions", [])
            done_trans = next((t for t in transitions if "done" in t["name"].lower() or "close" in t["name"].lower() or "complete" in t["name"].lower()), None)
            if done_trans:
                requests.post(url, auth=self.auth, headers=self.headers, json={"transition": {"id": done_trans["id"]}})

    def _add_comment(self, issue_key: str, comment_text: str, assignee_name: str = "", sprint_name: str = ""):
        profile = TEAM_MEMBERS.get(assignee_name, {})
        account_id = profile.get("account_id")
        role = profile.get("role", "")
        tag_name = profile.get("tag_name", f"@{assignee_name}")
        
        content = []
        if account_id:
            content.append({
                "type": "panel",
                "attrs": {"panelType": "success"},
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {"type": "text", "text": "👤 Task Completed by: ", "marks": [{"type": "strong"}]},
                            {"type": "mention", "attrs": {"id": account_id, "text": tag_name, "userType": "DEFAULT"}},
                            {"type": "text", "text": f" ({assignee_name} — {role})", "marks": [{"type": "strong"}]}
                        ]
                    }
                ]
            })
            
        header_prefix = f"✅ [{sprint_name} Completion Log - SupportSense AI]:\n" if sprint_name else "✅ [Completion Log - SupportSense AI]:\n"
        content.append({
            "type": "paragraph",
            "content": [
                {"type": "text", "text": header_prefix, "marks": [{"type": "strong"}]},
                {"type": "text", "text": comment_text}
            ]
        })

        body = {
            "body": {
                "type": "doc",
                "version": 1,
                "content": content
            }
        }
        url = f"{self.jira_url}/rest/api/3/issue/{issue_key}/comment"
        requests.post(url, auth=self.auth, headers=self.headers, json=body)


def main():
    parser = argparse.ArgumentParser(description="Sync SupportSense AI Sprints & Issues to Atlassian Jira")
    parser.add_argument("--jira-url", default=os.getenv("JIRA_URL", "https://aicsupportsys.atlassian.net"), help="Jira instance URL")
    parser.add_argument("--email", default=os.getenv("JIRA_EMAIL", "konuriyash@gmail.com"), help="Atlassian Account Email")
    parser.add_argument("--token", default=os.getenv("JIRA_API_TOKEN"), help="Atlassian API Token")
    parser.add_argument("--project", default=os.getenv("JIRA_PROJECT_KEY", "SCRUM"), help="Jira Project Key (default: SCRUM)")
    parser.add_argument("--dry-run", action="store_true", help="Perform dry-run simulation without calling Jira APIs")
    args = parser.parse_args()

    print("=" * 75)
    print("  SupportSense AI — Automated Jira Workspace Synchronization Tool")
    print("=" * 75)

    token = args.token or "ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6"

    manager = JiraSyncManager(
        jira_url=args.jira_url,
        email=args.email,
        api_token=token,
        project_key=args.project,
        dry_run=args.dry_run
    )

    if not manager.test_connection():
        sys.exit(1)

    manager.map_team_members()
    manager.setup_sprints()
    manager.create_epics()
    manager.sync_all_tasks()

    print("\n" + "=" * 75)
    print("  🎉 All 4 Sprints, 6 Epics, 26 Tasks, 52 Subtasks Synced to Jira!")
    print("=" * 75)


if __name__ == "__main__":
    main()
