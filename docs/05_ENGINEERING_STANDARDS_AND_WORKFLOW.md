# Module 05: Engineering Standards, Git Workflow & Team Responsibilities

---

## 20. Folder Structure

```
SupportSenseAI/
├── frontend/                     # React + Vite + Tailwind SPA (Member 1 Lead)
│   ├── public/
│   ├── src/
│   │   ├── assets/               # SVGs, icons, static visual assets
│   │   ├── components/           # Modular UI components (Buttons, Cards, Modals)
│   │   │   ├── ai/               # AI Mood Badge, Quality Checker Modal, Timeline Summary
│   │   │   ├── common/           # Navbar, Sidebar, LoadingSkeleton, Toast
│   │   │   └── tickets/          # TicketCard, TicketList, ChecklistView, MessageThread
│   │   ├── context/              # AuthContext, ThemeContext (Dark/Light Mode)
│   │   ├── hooks/                # Custom React hooks (useTickets, useAI, useAuth)
│   │   ├── pages/                # Dashboard, TicketDetail, Login, AdminInsights
│   │   ├── services/             # Axios API client modules
│   │   ├── utils/                # Date formatters, helper functions
│   │   ├── App.jsx
│   │   ├── index.css             # Tailwind & design token utility variables
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Node.js + Express REST Server (Member 2 Lead)
│   ├── src/
│   │   ├── config/               # Database connection (PostgreSQL pool), ENV config
│   │   ├── controllers/          # Request handlers (authController, ticketController)
│   │   ├── middleware/           # authMiddleware, errorHandler, rateLimiter
│   │   ├── models/               # Database query models / DAO functions
│   │   ├── routes/               # Express route declarations (/api/v1/auth, /api/v1/tickets)
│   │   ├── services/             # Integration client to call FastAPI AI service
│   │   ├── utils/                # Logger (Winston/Pino), response formatters
│   │   └── app.js
│   ├── server.js                 # HTTP Server entrypoint
│   └── package.json
│
├── ai-service/                   # FastAPI Python AI Microservice (Member 3 Lead)
│   ├── app/
│   │   ├── api/                  # API routers (/triage, /verify-response, /insights)
│   │   ├── core/                 # Config, Gemini SDK initialization, settings
│   │   ├── models/               # Pydantic schemas for request/response validation
│   │   ├── prompts/              # System prompts for Gemini LLM
│   │   ├── services/             # Gemini API caller & JSON parsing logic
│   │   └── main.py               # FastAPI application entrypoint
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/                     # PostgreSQL Migrations & Seeds (Member 2 & 4 Lead)
│   ├── migrations/               # DDL SQL files (001_init_schema.sql)
│   └── seeds/                    # Seed SQL files (001_sample_tickets.sql)
│
├── tests/                        # Comprehensive Suite (Member 4 Lead)
│   ├── unit/                     # Backend & AI unit test specs
│   ├── integration/              # API Integration test specs
│   └── e2e/                      # Playwright / Cypress UI specs
│
├── deployment/                   # Containerization & Ops (Member 4 Lead)
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── .github/                      # CI/CD Automation Workflows
│   └── workflows/
│       └── ci.yml                # GitHub Actions backend test, frontend build & pytest pipeline
│
├── render.yaml                   # 1-Click Render Blueprint deployment specification
└── docs/                         # Project Documentation Hub (Member 4 & Team)
    ├── 01_PROJECT_VISION_AND_PRD.md
    ├── 02_REQUIREMENTS_AND_USE_CASES.md
    ├── 03_AGILE_SPRINT_PLANNING.md
    ├── 04_SYSTEM_ARCHITECTURE_AND_DESIGN.md
    ├── 05_ENGINEERING_STANDARDS_AND_WORKFLOW.md
    └── 06_TESTING_DEPLOYMENT_AND_GOVERNANCE.md
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
   \-- feature/SSAI-101-auth-jwt ----(PR + Review)---------/
    \-- feature/SSAI-302-ai-triage --(PR + Review)--------/
```

---

## 23. Branch Naming Convention

All git branches must follow the strict format:
`<type>/<ticket-id>-<short-description>`

Types:
- `feature`: New functionality or user story.
- `fix`: Bug fix or patch.
- `docs`: Documentation updates.
- `test`: Adding or refactoring unit/integration tests.
- `chore`: Infrastructure, dependency update, or maintenance.

Examples:
- `feature/SSAI-101-user-login-api`
- `feature/SSAI-302-fastapi-triage-endpoint`
- `fix/SSAI-204-checklist-persistence-bug`

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
