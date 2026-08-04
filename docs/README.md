# SupportSense AI — Documentation Hub

Welcome to the central documentation repository for **SupportSense AI**, an enterprise-grade AI-Assisted Customer Support Ticket System developed during a 2-month internship program at **Persistent Systems**.

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

---

## 👥 Internship Team Composition

- **Member 1 (Frontend Lead)**: React, Vite, Tailwind CSS, State Management, UI/UX Components
- **Member 2 (Backend Lead)**: Node.js, Express, REST APIs, PostgreSQL, Auth & Security
- **Member 3 (AI Engineer)**: FastAPI Microservice, Google Gemini Integration, NLP Features, AI Confidence Scoring
- **Member 4 (DevOps, QA & Technical Writer)**: Docker & Docker Compose, CI/CD, Automated Tests, Documentation & Governance

---

## 🚀 Novel Enterprise Features Overview

1. **AI Mood Indicator**: Categorizes customer emotion (🙂 Happy, 😐 Neutral, 😠 Frustrated) with confidence percentages.
2. **Resolution Predictor**: Forecasts ticket completion time (e.g. "Estimated resolution: 2–3 days") based on historical resolution patterns.
3. **Agent Assist Checklist**: Dynamic step-by-step action items generated for agents (e.g., `[ ] Verify account`, `[ ] Check payment logs`, `[ ] Reset password`).
4. **Learning Insights**: Weekly AI analytics reporting top 5 repeated issues, recurring agent mistakes, and suggested knowledge base FAQ additions.
5. **Customer Patience Score**: Dynamic status tracking (Calm, Concerned, Frustrated, Critical) guiding agent tone and SLA escalation.
6. **Response Quality Checker**: Pre-send reply evaluation for Professionalism, Empathy, Clarity, and Actionability.
7. **Ticket Timeline Summary**: 5–6 bullet AI summary of thread history when tickets are reopened or reassigned.
