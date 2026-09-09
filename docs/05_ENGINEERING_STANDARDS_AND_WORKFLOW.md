# Module 05: Engineering Standards, Git Workflow & Team Responsibilities

---

## 20. Folder Structure

```
SupportSenseAI/
├── frontend/                     # React 18 + Vite + Tailwind SPA (Member 1 Lead)
│   ├── public/
│   ├── src/
│   │   ├── assets/               # SVGs, icons, static visual assets (logo.png)
│   │   ├── components/           # Modular UI components (Buttons, Cards, Modals)
│   │   │   ├── ai/               # AI Concierge, Tone Checker, Timeline Banner, Mood Badge, Quality Check
│   │   │   └── common/           # Navbar, Sidebar, PriorityBadge, LoadingSkeleton, Toast, Modals
│   │   ├── context/              # AuthContext, ThemeContext, ToastContext
│   │   ├── layouts/              # MainLayout with responsive navbar, sidebar & breadcrumbs
│   │   ├── pages/                # Dashboard, Tickets, Detail, Create, Depts, KB, Insights, Users
│   │   ├── services/             # Axios API client (api.js) with JWT interceptor & smart mock layer
│   │   ├── App.jsx
│   │   ├── index.css             # Tailwind & design token utility variables
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express REST Server (Member 2 Lead)
│   ├── src/
│   │   ├── config/               # Database connection (PostgreSQL pool), env.js, dbInit.js
│   │   ├── controllers/          # authController, ticketController, aiProxyController
│   │   ├── middleware/           # authMiddleware, errorHandler, rateLimiter
│   │   ├── models/               # userModel, ticketModel, aiMetadataModel (transactions, upserts)
│   │   ├── routes/               # authRoutes, ticketRoutes, aiProxyRoutes
│   │   ├── services/             # aiService.js (HTTP client with timeouts & graceful fallbacks)
│   │   ├── utils/                # logger.js & responseFormatter.js
│   │   └── app.js
│   ├── server.js                 # HTTP Server entrypoint
│   └── package.json
│
├── ai-service/                   # FastAPI Python AI Microservice (Member 3 Lead)
│   ├── app/
│   │   ├── api/                  # API routers (router.py: triage, concierge, tone, auto-reply, datasets)
│   │   ├── core/                 # config.py, gemini_client.py (model pooling & TTL cache)
│   │   ├── models/               # Pydantic schemas (schemas.py)
│   │   ├── prompts/              # 40-line specialized role-based prompts (templates.py)
│   │   ├── services/             # triage, concierge, auto_reply, quality, insights, dataset services
│   │   └── main.py               # FastAPI application entrypoint
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/                     # PostgreSQL Migrations & Seeds (Member 2 & 4 Lead)
│   ├── migrations/               # DDL SQL files (001_init_schema.sql)
│   └── seeds/                    # Seed SQL files (001_seed_data.sql)
│
├── tests/                        # Comprehensive Suite (Member 4 Lead)
│   ├── unit/                     # Backend (auth, ticket) & AI service (features, triage) unit specs
│   └── integration/              # Supertest (api.test.js), concurrency & transaction specs
│
├── deployment/                   # Containerization & Ops (Member 4 Lead)
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── .github/                      # CI/CD Automation Workflows
│   └── workflows/
│       └── ci.yml                # GitHub Actions: PostgreSQL 15, Jest, Vite build & Pytest
│
├── render.yaml                   # 1-Click Render Blueprint deployment specification
└── docs/                         # Project Documentation Hub (13 Modules + 3 Team Guides)
    ├── 01_PROJECT_VISION_AND_PRD.md
    ├── 02_REQUIREMENTS_AND_USE_CASES.md
    ├── 03_AGILE_SPRINT_PLANNING.md
    ├── 04_SYSTEM_ARCHITECTURE_AND_DESIGN.md
    ├── 05_ENGINEERING_STANDARDS_AND_WORKFLOW.md
    ├── 06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md
    ├── 07_UI_UX_DESIGN_SYSTEM.md
    ├── 08_DATABASE_DESIGN_SPECIFICATION.md
    ├── 09_BACKEND_ARCHITECTURE_AND_API_GUIDE.md
    ├── 10_AI_SERVICE_SPECIFICATION.md
    ├── 11_FRONTEND_ARCHITECTURE_GUIDE.md
    ├── 12_TESTING_AND_QUALITY_ASSURANCE.md
    ├── 13_DEPLOYMENT_AND_DEVOPS_GUIDE.md
    ├── README.md
    ├── TEAM_AI_DATASET_PROMPTS_GUIDE.md
    ├── TEAM_BACKEND_DEVOPS_GUIDE.md
    └── TEAM_FRONTEND_ENGINEERING_GUIDE.md
```

---

## 21. Coding Standards

### 21.1 Beginner-Friendly Principles
- **No Over-Engineering**: Avoid complex generic abstractions. Keep functions direct, straightforward, and under 50 lines where possible.
- **Explicit Comments**: Every function MUST begin with a 2-3 line comment block detailing:
  - What the function does.
  - Parameter types and return values.
  - Any error conditions or side effects.
- **Self-Documenting Names**: Variables must use full descriptive names (e.g. `customerPatienceScore` instead of `pts`, `ticketStatusCategory` instead of `tsc`).

### 21.2 Code Comment Example (JavaScript / Node.js)
```javascript
/**
 * Calculates the overall urgency weight based on customer mood and SLA deadlines.
 * 
 * @param {string} customerMood - The AI-detected mood ('HAPPY', 'NEUTRAL', 'FRUSTRATED').
 * @param {number} hoursUntilSlaBreach - Hours remaining before ticket breaches SLA.
 * @returns {number} Urgency score between 1 (Low) and 100 (Critical).
 */
function calculateTicketUrgencyScore(customerMood, hoursUntilSlaBreach) {
  let baseScore = 50;

  // Elevate urgency if customer is frustrated
  if (customerMood === 'FRUSTRATED') {
    baseScore += 30;
  }

  // Deduct points if ample SLA time remains
  if (hoursUntilSlaBreach > 24) {
    baseScore -= 15;
  }

  return Math.min(100, Math.max(1, baseScore));
}
```

---

## 22. Git Workflow

We enforce a **Feature Branch Workflow** with mandatory Pull Requests (PR) and code reviews prior to merging into `main`.

```
main --------------------------------------------------------> (Production Ready)
  \                                                         /
   \-- feat/SCRUM-110-connection-pooling-test (PR + CI)----/
    \-- feat/SCRUM-111-status-transition-validation (PR)--/
     \-- feat/SCRUM-112-ticket-transaction (PR + CI)-----/
      \-- feature/SCRUM-113-reopened-timeline-summarizer-/
```

---

## 23. Branch Naming Convention

All git branches must follow the strict format:
`<type>/<ticket-id>-<short-description>`

Types:
- `feat` or `feature`: New functionality or user story.
- `fix`: Bug fix or patch.
- `docs`: Documentation updates.
- `test`: Adding or refactoring unit/integration tests.
- `chore` / `refactor`: Infrastructure, styling, or maintenance.

Examples:
- `feat/SCRUM-110-connection-pooling-test`
- `feat/SCRUM-111-status-transition-validation`
- `feat/SCRUM-112-ticket-transaction`
- `feature/SCRUM-113-reopened-timeline-summarizer`
- `feat/SCRUM-114-ai-concierge-chatbot`

---

## 24. Team Responsibilities

### Member 1: Frontend Developer (Lead: UI/UX & React SPA)
- Responsible for all React components in `frontend/src/`.
- Implements responsive UI, Dark Mode, AI Mood Badges, Checklist View, Quality Checker Modal.
- Integrates React Query and Axios for seamless API interaction.

### Member 2: Backend Developer (Lead: Express API & PostgreSQL)
- Responsible for Express controllers, models, and routes in `backend/src/`.
- Designs database schemas, writes SQL migrations in `database/migrations/`.
- Implements JWT authentication, RBAC middleware, and rate limiting.

### Member 3: AI Engineer (Lead: FastAPI & Gemini Integration)
- Responsible for Python microservice in `ai-service/app/`.
- Crafts Gemini prompts, Pydantic schemas, and structured JSON parsers.
- Implements AI Mood Indicator, Patience Score, Checklist, Quality Checker, and Learning Insights endpoints.

### Member 4: DevOps, QA & Technical Writer (Lead: Docs, Testing & Containerization)
- Responsible for Docker Compose, Dockerfiles, and Nginx reverse proxy configuration in `deployment/`.
- Writes test suites in `tests/` (unit, API integration, E2E).
- Maintains all technical documentation in `docs/` and manages Agile Jira sprint boards.
