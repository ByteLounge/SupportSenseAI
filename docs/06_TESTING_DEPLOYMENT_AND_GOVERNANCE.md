# Module 06: Testing Strategy, Deployment & Risk Governance

---

## 25. Testing Strategy

```
+-------------------------------------------------------------------+
|                        TESTING PYRAMID                            |
+-------------------------------------------------------------------+
|     / \        End-to-End Tests (Playwright / UI Automation)      |
|    /   \       Focus: Complete user journey (Submit ticket -> AI) |
|   /-----\                                                         |
|  /       \     Integration Tests (Supertest / HTTP APIs)          |
| /---------\    Focus: Auth middleware, REST endpoints, DB SQL     |
|/           \   Unit Tests (Jest / Pytest)                         |
|-------------|  Focus: Business functions, Pydantic schemas, Utils   |
+-------------------------------------------------------------------+
```

### 25.1 Unit Testing
- **Backend (Jest)**:
  - [`auth.test.js`](file:///D:/Projects/SupportSenseAI/tests/unit/backend/auth.test.js): Validates password hashing (`bcrypt`), JWT token signing & verification, and user payload decoding.
  - [`ticket.test.js`](file:///D:/Projects/SupportSenseAI/tests/unit/backend/ticket.test.js): Validates urgency score calculation algorithms based on customer mood and SLA duration.
- **AI Microservice (Pytest)**:
  - [`test_ai_features.py`](file:///D:/Projects/SupportSenseAI/tests/unit/ai-service/test_ai_features.py): Validates Kaggle dataset loading, resolution benchmarks, department auto-reply evaluation, role-prompted triage, 4-pillar quality checks, and async service caching.
  - [`test_triage.py`](file:///D:/Projects/SupportSenseAI/tests/unit/ai-service/test_triage.py): Validates deterministic fallback payloads when the Gemini API is unconfigured or rate-limited.

### 25.2 Integration & Concurrency Testing
- **REST Integration Specs** ([`api.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/api.test.js)): Supertest suite verifying `/health`, system telemetry, unauthenticated HTTP 401 request rejection, and input validation 400 errors.
- **Concurrent Ticket Creation Stress Test** ([`ticket-concurrency.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-concurrency.test.js)): Evaluates 10 concurrent requests to verify database connection pool performance and non-colliding `ticket_number_seq` identifiers (SCRUM-110).
- **Atomic Transaction & Rollback Spec** ([`ticket-transaction.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-transaction.test.js)): Tests atomic ticket and initial message creation, asserting that failure during message insertion rolls back the entire ticket creation cleanly without leaving orphaned records (SCRUM-112).

---

## 26. Deployment Strategy

### 26.1 Containerization Architecture (`Docker Compose`)
SupportSense AI uses a multi-container Docker deployment:

```
+---------------------------------------------------------------------+
|                      HOST OPERATING SYSTEM                          |
|                        (Docker Engine)                              |
|                                                                     |
|  +------------------+  +-----------------+  +--------------------+  |
|  | Frontend Container|  | Backend Express |  | FastAPI AI Service |  |
|  | (Nginx Port 80)  |  |  (Port 5000)    |  |    (Port 8000)     |  |
|  +--------+---------+  +--------+--------+  +---------+----------+  |
|           |                     |                     |             |
|           +----------+----------+---------------------+             |
|                      |                                              |
|                      v                                              |
|            +-------------------+                                    |
|            | PostgreSQL Container|                                   |
|            |    (Port 5432)    |                                    |
|            +-------------------+                                    |
+---------------------------------------------------------------------+
```

### 26.2 1-Click Cloud Deployment (Render Blueprint)
Defined in [`render.yaml`](file:///D:/Projects/SupportSenseAI/render.yaml), provisioning:
1. `supportsense-db`: Managed PostgreSQL 15 database.
2. `supportsense-ai-service`: Python FastAPI Docker container running the Gemini client.
3. `supportsense-backend`: Node.js Express Docker container with auto-initialization via `dbInit.js`.
4. `supportsense-frontend`: Static React SPA site built with Vite and routed with SPA rewrites.

### 26.3 Automated CI/CD Pipeline (`.github/workflows/ci.yml`)
- Boots an ephemeral `postgres:15-alpine` container service.
- Applies database schema (`001_init_schema.sql`) and seed data (`001_seed_data.sql`).
- Executes backend Jest unit and integration tests.
- Executes frontend Vite production build check.
- Executes Python 3.10 Pytest suite.

---

## 27. Risk Analysis & Mitigation Matrix

| Risk ID | Identified Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|---|
| **R-01** | Gemini API Rate Limits or Microservice Timeout | High | Medium | Enforce `AbortSignal.timeout(5000)` on HTTP calls with deterministic fallback JSON payloads so support workflow is never blocked. |
| **R-02** | Privilege Escalation via Public Registration | High | Low | Enforce strict server-side role sanitization forcing self-signups to `CUSTOMER`. |
| **R-03** | Sensitive Customer PII Leakage | High | Low | Strip payment card patterns and credentials before forwarding messages to external AI endpoints. |
| **R-04** | Database Query Bottlenecks under Load | Medium | Medium | Apply strict indexes on `status`, `priority`, `customer_id`, and manage connections with a pool limit of 20 clients. |
| **R-05** | Orphaned Tickets on Creation Errors | High | Medium | Wrap ticket and initial message creation in atomic SQL transactions (`createTicketWithInitialMessage`, SCRUM-112). |
| **R-06** | Invalid Ticket Lifecycle Transitions | Medium | Medium | Enforce strict state machine transitions in `ticketController.js` (`ALLOWED_STATUS_TRANSITIONS`, SCRUM-111). |
| **R-07** | LLM Generation Latency Overhead | Medium | High | Implement model instance pooling (`_MODEL_CACHE`) and in-memory TTL caching (`_RESPONSE_CACHE`, 300s TTL) in `gemini_client.py`. |

---

## 28. Future Scope

1. **Omnichannel Ingestion**: Expand ingestion capabilities to automatically pull tickets from Email (IMAP/SMTP webhook), Slack channels, and WhatsApp Enterprise API.
2. **Multilingual Auto-Translation**: Automatic bidirectional translation of customer inquiries in Spanish, French, German, or Japanese so agents can communicate in their preferred native language.
3. **Voice AI Agent Integration**: Integration with Gemini Multimodal Live API to transcribe customer call recordings and automatically populate ticket timelines and checklists.
4. **Predictive SLA Breach Alerting**: Machine learning models predicting SLA breaches 2 hours in advance and auto-reassigning tickets to available senior agents.
