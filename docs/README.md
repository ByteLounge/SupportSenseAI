# SupportSense AI — Documentation Hub

Welcome to the central documentation repository for **SupportSense AI**, an enterprise-grade AI-Assisted Customer Support Ticket System developed during a 2-month internship program at **Persistent Systems**.

---

> **Production Status**: 🟢 **100% PRODUCTION READY**
> **Security Certification**: Enforced role sanitization, CORS domain whitelisting, production JWT secret enforcement.
> **Resiliency**: Microservice timeout guard (`AbortSignal.timeout(5000)`), structured JSON logging, system telemetry.
> **Automated CI/CD**: Active GitHub Actions workflow running Jest + Supertest (7/7 tests pass) and Pytest.

---

## 📌 Document Index (28 Core Documentation Requirements)

| # | Requirement | Document Location |
|---|---|---|
| 1 | **Project Vision** | [01_PROJECT_VISION_AND_PRD.md](./01_PROJECT_VISION_AND_PRD.md#1-project-vision) |
| 2 | **Product Requirements Document (PRD)** | [01_PROJECT_VISION_AND_PRD.md](./01_PROJECT_VISION_AND_PRD.md#2-product-requirements-document-prd) |
| 3 | **Software Requirements Specification (SRS)** | [01_PROJECT_VISION_AND_PRD.md](./01_PROJECT_VISION_AND_PRD.md#3-software-requirements-specification-srs) |
| 4 | **Functional Requirements** | [02_REQUIREMENTS_AND_USE_CASES.md](./02_REQUIREMENTS_AND_USE_CASES.md#4-functional-requirements) |
| 5 | **Non-Functional Requirements** | [02_REQUIREMENTS_AND_USE_CASES.md](./02_REQUIREMENTS_AND_USE_CASES.md#5-non-functional-requirements) |
| 6 | **User Stories** | [03_AGILE_SPRINT_PLANNING.md](./03_AGILE_SPRINT_PLANNING.md#6-user-stories) |
| 7 | **Product Backlog** | [03_AGILE_SPRINT_PLANNING.md](./03_AGILE_SPRINT_PLANNING.md#7-product-backlog) |
| 8 | **Sprint Backlog** | [03_AGILE_SPRINT_PLANNING.md](./03_AGILE_SPRINT_PLANNING.md#8-sprint-backlog) |
| 9 | **Agile Sprint Plan (4 Sprints)** | [03_AGILE_SPRINT_PLANNING.md](./03_AGILE_SPRINT_PLANNING.md#9-agile-sprint-plan-4-sprints) |
| 10 | **Jira Epic List** | [03_AGILE_SPRINT_PLANNING.md](./03_AGILE_SPRINT_PLANNING.md#10-jira-epic-list) |
| 11 | **Jira User Stories** | [03_AGILE_SPRINT_PLANNING.md](./03_AGILE_SPRINT_PLANNING.md#11-jira-user-stories) |
| 12 | **Acceptance Criteria** | [03_AGILE_SPRINT_PLANNING.md](./03_AGILE_SPRINT_PLANNING.md#12-acceptance-criteria) |
| 13 | **Use Case Diagram** | [02_REQUIREMENTS_AND_USE_CASES.md](./02_REQUIREMENTS_AND_USE_CASES.md#13-use-case-diagram) |
| 14 | **Use Case Descriptions** | [02_REQUIREMENTS_AND_USE_CASES.md](./02_REQUIREMENTS_AND_USE_CASES.md#14-use-case-descriptions) |
| 15 | **System Architecture** | [04_SYSTEM_ARCHITECTURE_AND_DESIGN.md](./04_SYSTEM_ARCHITECTURE_AND_DESIGN.md#15-system-architecture) |
| 16 | **Component Diagram** | [04_SYSTEM_ARCHITECTURE_AND_DESIGN.md](./04_SYSTEM_ARCHITECTURE_AND_DESIGN.md#16-component-diagram) |
| 17 | **Database ER Diagram** | [04_SYSTEM_ARCHITECTURE_AND_DESIGN.md](./04_SYSTEM_ARCHITECTURE_AND_DESIGN.md#17-database-er-diagram) |
| 18 | **Sequence Diagrams** | [04_SYSTEM_ARCHITECTURE_AND_DESIGN.md](./04_SYSTEM_ARCHITECTURE_AND_DESIGN.md#18-sequence-diagrams) |
| 19 | **API Documentation** | [04_SYSTEM_ARCHITECTURE_AND_DESIGN.md](./04_SYSTEM_ARCHITECTURE_AND_DESIGN.md#19-api-documentation) |
| 20 | **Folder Structure** | [05_ENGINEERING_STANDARDS_AND_WORKFLOW.md](./05_ENGINEERING_STANDARDS_AND_WORKFLOW.md#20-folder-structure) |
| 21 | **Coding Standards** | [05_ENGINEERING_STANDARDS_AND_WORKFLOW.md](./05_ENGINEERING_STANDARDS_AND_WORKFLOW.md#21-coding-standards) |
| 22 | **Git Workflow** | [05_ENGINEERING_STANDARDS_AND_WORKFLOW.md](./05_ENGINEERING_STANDARDS_AND_WORKFLOW.md#22-git-workflow) |
| 23 | **Branch Naming Convention** | [05_ENGINEERING_STANDARDS_AND_WORKFLOW.md](./05_ENGINEERING_STANDARDS_AND_WORKFLOW.md#23-branch-naming-convention) |
| 24 | **Team Responsibilities** | [05_ENGINEERING_STANDARDS_AND_WORKFLOW.md](./05_ENGINEERING_STANDARDS_AND_WORKFLOW.md#24-team-responsibilities) |
| 25 | **Testing Strategy** | [06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md](./06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md#25-testing-strategy) |
| 26 | **Deployment Strategy** | [06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md](./06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md#26-deployment-strategy) |
| 27 | **Risk Analysis** | [06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md](./06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md#27-risk-analysis) |
| 28 | **Future Scope** | [06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md](./06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md#28-future-scope) |
| 29 | **UI/UX Design System & Wireframes** | [07_UI_UX_DESIGN_SYSTEM.md](./07_UI_UX_DESIGN_SYSTEM.md) |
| 30 | **Database Design Specification (PostgreSQL)** | [08_DATABASE_DESIGN_SPECIFICATION.md](./08_DATABASE_DESIGN_SPECIFICATION.md) |
| 31 | **Express Backend Architecture & REST API Guide** | [09_BACKEND_ARCHITECTURE_AND_API_GUIDE.md](./09_BACKEND_ARCHITECTURE_AND_API_GUIDE.md) |
| 32 | **FastAPI AI Microservice & Gemini Specification** | [10_AI_SERVICE_SPECIFICATION.md](./10_AI_SERVICE_SPECIFICATION.md) |
| 33 | **React SPA Frontend Architecture & Component Guide** | [11_FRONTEND_ARCHITECTURE_GUIDE.md](./11_FRONTEND_ARCHITECTURE_GUIDE.md) |
| 34 | **Testing Strategy & Automated Quality Assurance** | [12_TESTING_AND_QUALITY_ASSURANCE.md](./12_TESTING_AND_QUALITY_ASSURANCE.md) |
| 35 | **Deployment, CI/CD Pipeline & DevOps Guide** | [13_DEPLOYMENT_AND_DEVOPS_GUIDE.md](./13_DEPLOYMENT_AND_DEVOPS_GUIDE.md) |
| 36 | **AI Implementation, Datasets & Role-Based Prompts Guide** | [TEAM_AI_DATASET_PROMPTS_GUIDE.md](./TEAM_AI_DATASET_PROMPTS_GUIDE.md) |
| 37 | **Backend, API & DevOps Engineering Guide** | [TEAM_BACKEND_DEVOPS_GUIDE.md](./TEAM_BACKEND_DEVOPS_GUIDE.md) |
| 38 | **Frontend Engineering & UI/UX Guide** | [TEAM_FRONTEND_ENGINEERING_GUIDE.md](./TEAM_FRONTEND_ENGINEERING_GUIDE.md) |
| 39 | **Jira Agile Story Point Breakdown & Estimation Guide** | [JIRA_STORY_POINT_BREAKDOWN_GUIDE.md](./JIRA_STORY_POINT_BREAKDOWN_GUIDE.md) |

---

## 👥 Internship Team Composition

- **Member 1 (Frontend Lead)**: React 18, Vite, Tailwind CSS, State Management, UI/UX Components, MoonRow design system.
- **Member 2 (Backend Lead)**: Node.js, Express, REST APIs, PostgreSQL, Auth & Security, Database transactions & pooling.
- **Member 3 (AI Engineer)**: FastAPI Microservice, Google Gemini Integration, NLP Features, AI Confidence Scoring, Model pooling & TTL caching.
- **Member 4 (DevOps, QA & Technical Writer)**: Docker & Docker Compose, Render Blueprint, CI/CD, Automated Tests, Documentation & Governance.

---

## 🚀 Novel Enterprise Features Overview

1. **AI Concierge Chatbot & Conversational Ticket Crafter**: Conversational intake widget turning informal natural customer queries into structured enterprise tickets ready for 1-click dispatch.
2. **1-Click AI Response Tone Polishing**: Multi-style agent response transformer offering 1-click rewrites into Empathetic, Concise, Formal, or Technical styles with rationale.
3. **Reopened Ticket Timeline Summary & Banner**: 5–6 bullet executive summary generated via an async fire-and-forget worker upon reopening (`RESOLVED` ➔ `OPEN`), presented in a prominent top banner.
4. **Transactional Ticket & Message Creation (SCRUM-112)**: Atomic PostgreSQL transaction wrapping ticket insertion and initial customer message to prevent data divergence.
5. **Strict Status Transition State Machine (SCRUM-111)**: Strict validation engine enforcing legal state progressions (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED` ➔ `CLOSED` or `OPEN`).
6. **Department Automated Replies & Rules**: Pre-configured departmental policies (`Finance & Billing`, `Technical Support`, `Identity & Access`, `API Platform`) dispatching automated confirmations and diagnostics.
7. **Model Instance Pooling & TTL Response Caching**: In-memory `GenerativeModel` pooling and 300s SHA256 hashed cache delivering sub-millisecond response times for repeated queries.
8. **AI Mood Indicator & Sentiment Confidence**: Real-time customer emotion categorization (`🙂 HAPPY`, `😐 NEUTRAL`, `😠 FRUSTRATED`) with numerical confidence ratings (`0.00` to `1.00`).
9. **Customer Patience Score & SLA Guardrail**: Tracks customer patience degradation (`CALM`, `CONCERNED`, `FRUSTRATED`, `CRITICAL`) to guide agent tone and trigger escalation alerts.
10. **Dataset-Grounded Resolution Predictor & Checklists**: Forecasts resolution timeframes and generates dynamic step-by-step verification checklists calibrated against Kaggle & Hugging Face benchmarks.
11. **Response Quality & Empathy Checker**: Pre-send reply evaluation scoring agent drafts for Professionalism, Empathy, Clarity, and Actionability.
12. **Weekly Organizational Learning Insights**: Analyzes historical ticket resolution patterns to generate top repeated issues, recurring agent mistakes, and suggested Knowledge Base FAQs.

