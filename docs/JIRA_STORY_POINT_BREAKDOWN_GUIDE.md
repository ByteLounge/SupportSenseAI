# SupportSense AI — Jira Agile Story Point Breakdown & Estimation Guide

---

> **Document Version**: 2.0.0  
> **Audience**: Engineering Team, Project Mentors, Evaluators, and Agile Beginners  
> **Target Jira Project**: `SCRUM` / `SSAI` (SupportSense AI)  
> **Total Sprints**: 4 Sprints (8 Weeks)  
> **Total User Stories & Tasks**: 29 Tasks  
> **Total Story Points**: 156 Story Points  
> **Sprint Cadence**: 2-week iterations  

---

## 1. What Are Story Points? (Beginner's Guide)

If you are new to Agile, Scrum, or Jira, you might wonder: **"Why don't we just measure tasks in hours?"**

### The Problem with Hours
Measuring software tasks in exact hours usually fails because:
1. An expert might finish a task in 2 hours that takes a beginner 8 hours.
2. Unforeseen bugs, third-party API rate limits, and integration headaches cannot be predicted by a clock.
3. Estimating hours causes stress and false deadlines.

### The Story Point Solution
**Story Points** are an abstract unit of measurement used in Agile Scrum to quantify the **relative size and complexity** of a task.

Instead of asking *"How many hours will this take?"*, the team asks:
- *"How hard is this compared to something we've already built?"*
- *"How much code and testing does this require?"*
- *"How many unknowns or tricky parts are involved?"*

---

## 2. The 3 Pillars of Complexity Estimation

Every task in SupportSense AI is scored using 3 specific dimensions:

```
                  ┌─────────────────────────────────────┐
                  │          STORY POINT SCORE          │
                  └──────────────────┬──────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
   │ 1. EFFORT     │         │ 2. COMPLEXITY │         │ 3. RISK /     │
   │               │         │               │         │    UNKNOWN    │
   │ How much work │         │ How tricky is │         │ How many      │
   │ is there to   │         │ the logic,    │         │ third-party   │
   │ type & test?  │         │ math, or data │         │ APIs & edge   │
   │               │         │ flow?         │         │ cases exist?  │
   └───────────────┘         └───────────────┘         └───────────────┘
```

1. **Effort**: The raw volume of work. (e.g., writing 5 UI components vs. tweaking 1 CSS class).
2. **Technical Complexity**: The cognitive difficulty. (e.g., coordinating database transactions and state machines vs. displaying static mock text).
3. **Risk and Uncertainty**: The unknown variables. (e.g., integrating Gemini LLM prompt latency, external Supabase connection timeouts, or async WebSockets).

---

## 3. The Modified Fibonacci Scale Rubric

Agile teams use the **Fibonacci Sequence** (`1, 2, 3, 5, 8, 13...`) because as tasks get larger, uncertainty grows non-linearly. In SupportSense AI, we use values `1, 2, 3, 5, 8`:

| Points | Complexity Level | Real-World Analogy | When to Assign This Score | Example in SupportSense AI |
|:---:|:---:|:---|:---|:---|
| **1** | **Trivial** | Changing a light bulb | A tiny change with zero uncertainty, takes less than 1 hour. A single configuration flag or typo fix. | Updating an environment variable or tweaking a button hover color. |
| **2** | **Small** | Assembling a simple chair | Straightforward task, very low risk, 1 to 2 components. Clear path with zero unknowns. | Adding a simple UI badge or adding a basic validation regex. |
| **3** | **Moderate** | Painting a bedroom | Moderate effort, known path, low risk. Requires research, clear writing, or lightweight code modifications. | **SSAI-101**: Researching competitor support apps; **SSAI-404**: Security audit of private notes and XSS checks. |
| **5** | **Medium-High (Standard Feature)** | Renovating a bathroom | Substantial effort, moderate complexity. Involves database schema changes, multiple API endpoints, state management, or cloud database migration. | **SSAI-103**: Designing 3-tier database architecture; **SSAI-408**: Migrating PostgreSQL from Render to Supabase with pooling. |
| **8** | **High (Epic Sub-system)** | Building a full house extension | High effort, high technical complexity, multiple interacting services, and AI prompts. Must handle async failures, model fallbacks, or full state machines. | **SSAI-205**: FastAPI AI microservice with Gemini; **SSAI-406**: AI Concierge Chatbot & Formal Ticket Crafter. |
| **13+** | **Too Large (Needs Splitting)** | Building an entire skyscraper | Anything estimated at 13 points or above is an Epic, not a Story. It must be broken into smaller 3, 5, or 8-point pieces. | Splitting the entire AI engine into SSAI-205 (Scaffold), SSAI-302 (Triage), SSAI-303 (Checklists), and SSAI-406 (Concierge). |

---

## 4. Complete Sprint-by-Sprint Story Point Breakdown (All 29 Tasks)

Here is the complete, beginner-friendly inventory of every Jira ticket in SupportSense AI across all 4 Sprints.

### Sprint 1: Research, Learning & Planning (Completed)
*Goal: Understand customer support pain points, select AI models, design database architecture, and write requirements.*  
*Sprint Total: 4 Tasks | 18 Story Points*

| Task ID | Task Title (Beginner-Friendly) | Assignee | Role | Points | Complexity | Why This Point Value Was Chosen (Rationale) |
|:---|:---|:---|:---|:---:|:---:|:---|
| **SSAI-101** | Research How Customer Support Tools Work & Compare Features | Rohan Salkar | Frontend Lead | **3** | Moderate | Moderate effort. Involves studying Zendesk, Freshdesk, and Linear, identifying slow response bottlenecks, and drafting 4 user personas. Low technical risk. |
| **SSAI-102** | Choose Right AI Model & Collect Real Customer Chat Datasets | Yash Sanikop | Frontend & AI Lead | **5** | Medium-High | Medium-high complexity. Required testing Gemini 1.5 Flash API latency, measuring token costs, writing system prompt templates, and organizing Kaggle/Hugging Face support datasets. |
| **SSAI-103** | Design Simple 3-Tier System Architecture & Database Tables | Shrujan Mitbavkar | Backend Lead | **5** | Medium-High | Medium-high complexity. Involves designing 6 normalized PostgreSQL tables (`users`, `tickets`, `messages`, `ai_metadata`, `checklists`, `insights`), foreign keys, and planning query performance indexes. |
| **SSAI-104** | Write Plain-English Project Requirements & 4-Sprint Schedule | Aarti Singh | DevOps & QA Lead | **5** | Medium-High | Substantial analytical effort. Required defining 8 core project features, drafting Human-in-the-Loop AI safety rules, and structuring the 8-week team schedule. |

---

### Sprint 2: Prototype Development & Architecture Setup (Completed)
*Goal: Build initial UI components, Express REST API backend, PostgreSQL database, and FastAPI AI scaffold.*  
*Sprint Total: 10 Tasks | 59 Story Points*

| Task ID | Task Title (Beginner-Friendly) | Assignee | Role | Points | Complexity | Why This Point Value Was Chosen (Rationale) |
|:---|:---|:---|:---|:---:|:---:|:---|
| **SSAI-201** | Build Website Frame with Dark & Light Mode Switcher | Rohan Salkar | Frontend Lead | **5** | Medium-High | Building responsive sidebar navigation, top header, mobile drawer, and persistent theme switcher using Tailwind CSS classes. |
| **SSAI-202** | Build Reusable UI Buttons, Cards & Offline Mock Data | Rohan Salkar | Frontend Lead | **5** | Medium-High | Creating reusable component library (buttons, badges, status pills, mood indicators) and comprehensive mock JSON data so teammates can test offline. |
| **SSAI-203** | Create User Login Page with 1-Click Persona Testing Buttons | Yash Sanikop | Frontend & AI Lead | **5** | Medium-High | Building interactive authentication screens with tab switching (Customer vs Agent vs Admin) and 1-click sample login buttons for instant demo evaluation. |
| **SSAI-204** | Build Ticket Workspace with Chat Thread & Live AI Helper Drawer | Yash Sanikop | Frontend & AI Lead | **8** | High | High complexity. Dual-pane layout featuring customer chat conversation bubbles, agent internal note toggles, and expandable AI decision drawer with sentiment indicators. |
| **SSAI-205** | Set Up Python AI Microservice with Google Gemini & Caching | Yash Sanikop | Frontend & AI Lead | **8** | High | High technical complexity. Setting up FastAPI server, Google Gemini 1.5 Flash SDK, prompt formatting, SHA-256 in-memory caching (300s TTL), and fallback error handling. |
| **SSAI-206** | Set Up Express Backend Server, Security Headers & Rate Limiter | Shrujan Mitbavkar | Backend Lead | **5** | Medium-High | Express.js application architecture with Helmet security headers, CORS origin whitelisting, Winston JSON structured logging, and Express rate limiting (100 req/15m). |
| **SSAI-207** | Create PostgreSQL Database Tables & Starter Test Data | Shrujan Mitbavkar | Backend Lead | **5** | Medium-High | Writing raw SQL migration scripts creating all 6 tables, constraints, UUID primary keys, and realistic seed data for 4 personas and sample tickets. |
| **SSAI-208** | Build Secure User Registration, Password Encryption & Login Tokens | Aarti Singh | DevOps & QA Lead | **5** | Medium-High | Developing bcrypt password hashing (10 salt rounds), JSON Web Token (JWT) issuance, verification middleware, and role-based access control (RBAC). |
| **SSAI-209** | Build Ticket Management APIs & Connect to AI Microservice | Aarti Singh | DevOps & QA Lead | **8** | High | High complexity. Full CRUD ticket endpoints (`GET /api/tickets`, `POST /api/tickets`, `POST /api/tickets/:id/messages`), query filters, and calling the Python AI microservice asynchronously. |
| **SSAI-210** | Set Up Docker Containers & Complete Technical Documentation | Aarti Singh | DevOps & QA Lead | **5** | Medium-High | Multi-stage Dockerfiles for Frontend, Express Backend, and Python AI service, coordinating `docker-compose.yml`, and writing setup guides. |

---

### Sprint 3: Full Integration & Decision Assist AI (Completed)
*Goal: Connect frontend to real backend, enable real Gemini AI triage, checklist execution, response quality checks, and status machine rules.*  
*Sprint Total: 7 Tasks | 38 Story Points*

| Task ID | Task Title (Beginner-Friendly) | Assignee | Role | Points | Complexity | Why This Point Value Was Chosen (Rationale) |
|:---|:---|:---|:---|:---:|:---:|:---|
| **SSAI-301** | Connect All Website Screens to the Real Live Backend Server | Rohan Salkar | Frontend Lead | **5** | Medium-High | Replacing all mock data hooks with real Axios API calls, handling authentication tokens in request headers, loading spinners, and network error alerts. |
| **SSAI-302** | Connect Real Google Gemini AI for Smart Ticket Triage & Mood Detection | Yash Sanikop | Frontend & AI Lead | **8** | High | High complexity. Connecting live Gemini AI to inspect customer messages, extract category, priority, customer mood (`🙂/😐/😠`), and numeric patience score (`0.00-1.00`). |
| **SSAI-303** | Generate AI Action Checklists & Allow Agents to Check Off Items | Yash Sanikop | Frontend & AI Lead | **5** | Medium-High | Prompting AI to generate 3–5 step troubleshooting checklists tailored to specific ticket issues, with database persistence when agents toggle checklist checkboxes. |
| **SSAI-304** | Build Pre-Send AI Tone & Quality Checker for Support Replies | Rohan Salkar | Frontend Lead | **5** | Medium-High | Building pre-send modal that reviews agent reply drafts, scoring them on Professionalism, Empathy, Clarity, and Actionability before sending to customers. |
| **SSAI-305** | Enforce Strict Ticket Status Rules & Concurrency Testing | Shrujan Mitbavkar | Backend Lead | **5** | Medium-High | State machine validation (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED`), atomic PostgreSQL transactions preventing orphaned messages, and connection pool stress testing. |
| **SSAI-306** | Build AI Summary Banner for Reopened Support Tickets | Aarti Singh | DevOps & QA Lead | **5** | Medium-High | Async background job that triggers when a ticket status switches from `RESOLVED` back to `OPEN`, calling Gemini to produce a 5-bullet summary banner. |
| **SSAI-307** | Build Automated Department Routing & Instant Auto-Replies | Aarti Singh | DevOps & QA Lead | **5** | Medium-High | Smart routing engine matching keywords to departments (`Billing`, `Technical`, `Accounts`), dispatching immediate automated confirmation messages. |

---

### Sprint 4: Advanced AI, Cloud Migration & Production Hardening (Active)
*Goal: AI Concierge chatbot, 1-click tone polisher, Supabase cloud database migration, comprehensive test suites, and Render deployment.*  
*Sprint Total: 8 Tasks | 41 Story Points*

| Task ID | Task Title (Beginner-Friendly) | Assignee | Role | Points | Complexity | Why This Point Value Was Chosen (Rationale) |
|:---|:---|:---|:---|:---:|:---:|:---|
| **SSAI-401** | Test Website Accessibility, Colors & Responsive Layouts | Rohan Salkar | Frontend Lead | **5** | Medium-High | Cross-device UI testing on mobile, tablet, and desktop screens; verifying color contrast ratios, screen reader labels, and keyboard navigation. |
| **SSAI-402** | Test AI Accuracy with 100 Support Records & Benchmark Speed | Yash Sanikop | Frontend & AI Lead | **5** | Medium-High | Running automated benchmark test over 100 customer scenarios; validating classification accuracy (>85%) and ensuring responses return under 1.8 seconds. |
| **SSAI-403** | Add Database Speed Indexes & Run Backend Test Suite | Shrujan Mitbavkar | Backend Lead | **5** | Medium-High | Adding compound B-tree indexes for fast queries (`customer_id`, `status`, `created_at`), running Jest unit tests and Supertest integration tests (7/7 passing). |
| **SSAI-404** | Security Check: Protect Private Notes & Block Malicious Input | Aarti Singh | DevOps & QA Lead | **3** | Moderate | Verifying internal notes are strictly hidden from customer view, input sanitization prevents XSS attacks, and non-admin users cannot access admin routes. |
| **SSAI-405** | Deploy Full Project to Render Cloud Platform with HTTPS | Aarti Singh | DevOps & QA Lead | **5** | Medium-High | Configuring `render.yaml` infrastructure-as-code blueprint, setting up production environment variables, and verifying live web services. |
| **SSAI-406** | Build AI Concierge Chatbot to Turn Simple Words into Formal Tickets | Yash Sanikop | Frontend & AI Lead | **8** | High | High complexity. Conversational intake widget asking clarifying questions and synthesizing natural customer chats into formal structured tickets. |
| **SSAI-407** | Build 1-Click AI Response Tone Polisher for Support Agents | Rohan Salkar | Frontend Lead | **5** | Medium-High | Multi-style agent assistant modal allowing 1-click rewriting of responses into Empathetic, Concise, Formal, or Technical styles with before/after preview. |
| **SSAI-408** | Migrate Database from Render to Supabase Cloud with Connection Pooling | Shrujan Mitbavkar | Backend Lead | **5** | Medium-High | Migrating database to enterprise Supabase PostgreSQL (`ap-southeast-1`), enabling SSL, pgBouncer connection pooling, and live schema verification. |

---

## 5. Sprint Velocity & Capacity Breakdown

### What is Velocity?
In Scrum, **Velocity** is the amount of work (measured in story points) a team successfully completes during a sprint.

```
       Sprint 1          Sprint 2          Sprint 3          Sprint 4
       (18 pts)          (59 pts)          (38 pts)          (41 pts)
     ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
     │ Research  │    │ Prototype │    │    AI &   │    │  Advanced │
     │ & Plan    │    │   Build   │    │Integrate  │    │AI & Cloud │
     └───────────┘    └───────────┘    └───────────┘    └───────────┘
     ◄──────────── TOTAL PROJECT EFFORT: 156 STORY POINTS ──────────►
```

### Sprint Distribution Summary:
- **Sprint 1 (Research & Planning)**: **18 Points** (4 tasks)  
  *Context*: Typical initial sprint with lower velocity. Team spent time understanding requirements, researching competitors, and architecting before writing heavy code.
- **Sprint 2 (Prototype Build)**: **59 Points** (10 tasks)  
  *Context*: Core implementation sprint. High velocity because foundational scaffolding (UI theme, Express backend, PostgreSQL schema, Docker, JWT auth) was built simultaneously by all 4 engineers.
- **Sprint 3 (AI & Integration)**: **38 Points** (7 tasks)  
  *Context*: Integration sprint. Moderate-high velocity connecting all frontend components to live backend routes, deploying live Gemini triage, and status machines.
- **Sprint 4 (Advanced AI & Cloud Ops)**: **41 Points** (8 tasks)  
  *Context*: Production polish sprint. Adding novel AI Concierge chatbot, tone polisher modal, migrating to Supabase cloud, and executing end-to-end test suites.
- **Total Project Velocity**: **156 Story Points** across 8 weeks (Average: **39 Story Points per Sprint**).

---

## 6. Team Member Allocation & Workload Balance

The team consists of 4 specialized engineering leads. Workload is balanced based on domain specialization and pair collaboration:

| Team Member | Engineering Role | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Total Points | Workload Share |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Rohan Salkar** | Frontend Lead (Member 1) | 3 pts | 10 pts | 10 pts | 10 pts | **33 pts** | 21.2% |
| **Yash Sanikop** | Frontend & AI Lead (Member 2) | 5 pts | 21 pts | 13 pts | 13 pts | **52 pts** | 33.3% |
| **Shrujan Mitbavkar** | Backend & Database Lead (Member 3) | 5 pts | 10 pts | 5 pts | 10 pts | **30 pts** | 19.2% |
| **Aarti Singh** | DevOps, Testing & QA Lead (Member 4) | 5 pts | 18 pts | 10 pts | 8 pts | **41 pts** | 26.3% |
| **TOTALS** | **Entire Team** | **18 pts** | **59 pts** | **38 pts** | **41 pts** | **156 pts** | **100.0%** |

### Workload Balance Explanation:
- **Yash Sanikop (52 pts)** handled heavy cross-cutting AI microservice features, Gemini integration, caching, conversational concierge, and frontend ticket drawers.
- **Aarti Singh (41 pts)** handled end-to-end security, JWT authentication, ticket management APIs, Docker containerization, automated auto-replies, and cloud deployment.
- **Rohan Salkar (33 pts)** focused on high-polish user interfaces, Tailwind design system, tone polisher modal, responsive layouts, and accessibility.
- **Shrujan Mitbavkar (30 pts)** anchored backend data integrity: raw PostgreSQL schemas, database transactions, state machines, and Supabase cloud migration with connection pooling.

---

## 7. Plain-English Jira & Agile Glossary

For team members, evaluators, or students new to Agile methodology, here is a quick reference guide to common terms:

- **Epic**: A large body of work that can be broken down into smaller tasks (e.g., *Epic 4: AI Decision Support*).
- **User Story**: A feature described from the end-user's perspective, using the format: *"As a [role], I want to [action], so that [benefit]"*.
- **Task**: A technical unit of work required to complete a story (e.g., *Write SQL migration script*).
- **Subtask**: A small, step-by-step checklist item inside a task (e.g., *Run pg_dump, test connection string*).
- **Story Points**: A relative number representing effort, complexity, and uncertainty, not literal hours.
- **Product Backlog**: The master to-do list containing all planned features, bugs, and tasks for the entire project.
- **Sprint Backlog**: The selected subset of backlog tasks committed to be finished during a 2-week sprint.
- **Velocity**: The total number of story points successfully finished by the team in one sprint.
- **Acceptance Criteria (AC)**: The specific conditions that must be met for a task to be marked "Done" (often written using Given-When-Then).
- **Definition of Done (DoD)**: The team's quality checklist (e.g., code reviewed, linted, tests passing, documented).

---

## 8. Automated Jira Sync Script

All 29 tickets, user stories, subtasks, story points, and completion comments are synchronized to the live Jira board using the automated script:

```bash
# Preview all 29 tickets and story point calculations without making changes:
python scripts/jira_sync.py --dry-run

# Execute live synchronization with Jira Cloud API:
python scripts/jira_sync.py
```

See [scripts/jira_sync.py](../scripts/jira_sync.py) for the complete automation code and API integration details.
