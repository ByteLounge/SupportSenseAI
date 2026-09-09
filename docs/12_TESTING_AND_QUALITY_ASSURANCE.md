# Module 12: Testing Strategy & Automated Quality Assurance

---

## 1. Quality Assurance Strategy & Test Pyramid

SupportSense AI enforces a rigorous multi-tier testing pyramid to guarantee database transactional integrity, concurrent load resilience, AI deterministic outputs, and error-free frontend compilation:

```
                  / \
                 /   \       Build & Bundle Validation
                /-----\      (Vite production build, asset bundling, tree-shaking)
               /       \     Integration & Transaction Specs
              /---------\    (Supertest REST, Concurrency SCRUM-110, Rollbacks SCRUM-112)
             /           \   Unit Test Suites
            /-------------\  (Jest for Auth/Tickets, Pytest for AI Triage/Concierge)
```

---

## 2. Complete Test Suite Inventory

The automated test suite is organized under [`tests/`](file:///D:/Projects/SupportSenseAI/tests/):

### 2.1 Backend Unit Tests (Jest)
- **[`tests/unit/backend/auth.test.js`](file:///D:/Projects/SupportSenseAI/tests/unit/backend/auth.test.js)**:
  - Validates `bcryptjs` password hashing and salt round security.
  - Tests JWT signing, expiration claims, and payload decoding.
  - Verifies role sanitization preventing privilege escalation (e.g. non-admins cannot self-promote to `ADMIN`).
- **[`tests/unit/backend/ticket.test.js`](file:///D:/Projects/SupportSenseAI/tests/unit/backend/ticket.test.js)**:
  - Tests ticket field validation (title length, description completeness, category enums).
  - Validates priority classification constraints (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
  - Verifies status state machine validation (`ALLOWED_STATUS_TRANSITIONS`), preventing invalid jumps (e.g. `CLOSED -> IN_PROGRESS`).

### 2.2 Backend Integration Tests (Jest & Supertest)
- **[`tests/integration/api.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/api.test.js)**:
  - Validates `/health` endpoint telemetry responses.
  - Asserts HTTP 401 Unauthorized blocking on protected ticket endpoints when no JWT is provided.
  - Tests HTTP 400 Bad Request error payload formatting.
- **[`tests/integration/ticket-concurrency.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-concurrency.test.js) (SCRUM-110)**:
  - Dispatches simultaneous parallel ticket creation calls via `Promise.allSettled`.
  - Verifies connection pool stability under concurrent pressure without exhausting pool connections.
  - Validates that PostgreSQL sequence `ticket_number_seq` generates 100% unique ticket numbers with zero duplicates or race-condition locks.
  - Cleans up created test records in an `afterAll` hook.
- **[`tests/integration/ticket-transaction.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-transaction.test.js) (SCRUM-112)**:
  - Tests atomic multi-statement ticket creation via `createTicketWithInitialMessage`.
  - Simulates message insertion failure with an invalid foreign key sender ID.
  - Asserts that the PostgreSQL transaction executes `ROLLBACK`, guaranteeing that no orphaned ticket row is retained in `tickets`.

### 2.3 Python AI Microservice Tests (Pytest)
- **[`tests/unit/ai-service/test_triage.py`](file:///D:/Projects/SupportSenseAI/tests/unit/ai-service/test_triage.py)**:
  - Validates `process_ticket_triage` and `process_ticket_triage_async`.
  - Tests customer mood classification (`HAPPY`, `NEUTRAL`, `FRUSTRATED`) and confidence rating bounds (0.0 to 1.0).
  - Verifies customer patience score calibration and checklist generation.
- **[`tests/unit/ai-service/test_ai_features.py`](file:///D:/Projects/SupportSenseAI/tests/unit/ai-service/test_ai_features.py)**:
  - **AI Concierge**: Tests `process_concierge_chat_async` verifying natural language dialogue and structured ticket draft creation.
  - **Tone Polisher**: Tests `process_tone_polish_async` across Empathetic, Concise, Formal, and Technical modes.
  - **Department Auto-Reply**: Tests `evaluate_department_auto_reply_async` against Finance, Tech, Identity, and API Platform policies.
  - **Dataset Benchmarks**: Asserts retrieval of resolution metrics and Hugging Face sample streaming.

---

## 3. Test Execution Guidelines

### 3.1 Running Backend Tests
> [!IMPORTANT]
> Integration tests (`ticket-concurrency.test.js` and `ticket-transaction.test.js`) connect to a live PostgreSQL database. Ensure PostgreSQL is active on `localhost:5432` with database `supportsense_db` migrated.

```bash
# Run all backend unit & integration tests
cd backend
npm test

# Run a specific test suite
npx jest tests/integration/ticket-concurrency.test.js
npx jest tests/integration/ticket-transaction.test.js
```

### 3.2 Running AI Microservice Tests
```bash
# Activate virtual environment if configured, then run Pytest
python -m pytest tests/unit/ai-service -v
```

### 3.3 Running Frontend Production Build Check
```bash
cd frontend
npm run build
```

---

## 4. Continuous Integration (CI) Automation

The GitHub Actions workflow in [`.github/workflows/ci.yml`](file:///D:/Projects/SupportSenseAI/.github/workflows/ci.yml) validates every pull request and commit to `main` and `develop`:
1. **Live PostgreSQL 15 Container**:
   - Spins up `postgres:15-alpine` container service.
   - Performs automated health checks with `pg_isready`.
   - Runs `node database/dbInit.js` to establish schemas and seed test accounts.
2. **Parallel Test Matrix**:
   - Executes Jest unit and integration tests against the live database container.
   - Executes Python Pytest suites for the FastAPI microservice.
   - Compiles the React Vite frontend bundle, asserting zero build errors or broken dependencies.

