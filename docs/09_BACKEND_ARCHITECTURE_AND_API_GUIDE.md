# Module 09: Express Backend Architecture & API Specification

---

## 1. Backend Architecture Overview (MVC Pattern)

The SupportSense AI backend is built using Node.js and Express 4.x following strict **Model-View-Controller (MVC)** principles with a decoupled service layer:

```
[ HTTP Request ]
       |
       v
[ Middleware Layer ] ----> (Helmet Security, CORS, Rate Limiting, JWT Guard)
       |
       v
[ Router Layer ] --------> (authRoutes, ticketRoutes, aiProxyRoutes)
       |
       v
[ Controller Layer ] ----> (authController, ticketController, aiProxyController)
       |
       +------------------------------------+
       |                                    |
       v                                    v
[ Service Layer ]                  [ Model Layer ]
(aiService -> FastAPI Service)    (userModel, ticketModel -> PostgreSQL Pool)
```

---

## 2. Security & Middleware Configuration

1. **JWT Authentication & RBAC (`authMiddleware.js`)**: Enforces secure Bearer token verification and restricts agent/admin endpoints.
2. **Public Self-Registration Role Guard (`authController.js`)**: Sanitizes registration input to strictly enforce `'CUSTOMER'` role on public signups, preventing privilege escalation.
3. **CORS Origin Whitelisting (`app.js`)**: Enforces explicit domain origin validation via `env.ALLOWED_ORIGINS` to protect credentialed requests.
4. **Microservice Request Timeout Guard (`aiService.js`)**: Integrates `AbortSignal.timeout(5000)` on all HTTP calls to Python FastAPI service to prevent Node.js thread hanging.
5. **Security Headers (`Helmet.js`)**: Enforces HTTP security headers against clickjacking, MIME sniffing, and XSS.
6. **Rate Limiting (`rateLimiter.js`)**: Enforces IP-based rate limiting (100 req/15min for API endpoints, 10 req/15min for auth).
7. **Production Structured Logging (`logger.js`)**: Emits structured JSON log formatting when `NODE_ENV=production` for Datadog / ELK ingestion.
8. **Global Error Handling (`errorHandler.js`)**: Captures unhandled exceptions and returns standardized JSON error payloads.

---

## 3. Implemented API Endpoints Reference

### 3.1 Authentication Endpoints (`/api/v1/auth`)
- `POST /register`: Registers customer/agent and returns JWT access token (self-registration strictly enforces `CUSTOMER` role).
- `POST /login`: Validates credentials against bcrypt hash and returns signed JWT token (1-hour expiration).
- `GET /me`: Returns profile details for the authenticated user.
- `GET /users`: Lists all registered user accounts (Admin only).
- `PATCH /users/:id/role`: Modifies user role (`CUSTOMER`, `AGENT`, `ADMIN` — Admin only).

### 3.2 Ticket Management Endpoints (`/api/v1/tickets`)
- `POST /`: Atomically creates ticket and customer message via transaction (`createTicketWithInitialMessage`), triggers AI triage and department auto-reply evaluation. Proactively scans for duplicates; returns `HTTP 409 DUPLICATE_RESOLVED_TICKET` if a similar resolved issue exists, unless `forceCreate: true` is supplied. Automatically links follow-up inquiries to active tickets.
- `GET /`: Returns tickets filtered by `status`, `priority`, or `search` term (role-guarded: Customers only view their own tickets).
- `GET /:id`: Retrieves complete ticket details with messages, AI metadata, checklists, and linked parent/child tickets.
- `PATCH /:id/status`: Enforces state machine transitions (`ALLOWED_STATUS_TRANSITIONS`). Reopening (`RESOLVED` ➔ `OPEN`) asynchronously triggers the AI timeline summarizer.
- `POST /:id/forward`: Forwards ticket to a target department (`Finance & Billing`, `Technical Support`, `Identity & Access`, `API Platform Team`) with internal handover notes.
- `PATCH /:id`: Modifies ticket attributes such as title, category, priority, status, or assigned agent (Admin/Agent escalation override).
- `DELETE /:id`: Deletes or archives a ticket record (Admin only).
- `POST /:id/messages`: Posts message or internal note to conversation thread (customers cannot view or create internal notes).
- `PATCH /:id/checklist/:itemId`: Toggles checklist item completion state in `agent_checklists`.

### 3.3 AI Decision Assistance Proxy (`/api/v1/ai`)
- `POST /concierge`: AI Concierge Chatbot & Formal Ticket Crafter (accessible to all authenticated roles).
- `POST /polish-tone`: 1-Click AI Response Tone Polishing into `empathetic`, `concise`, `formal`, or `technical` styles with 3 distinct cycling variations and anti-nesting.
- `POST /verify-response`: Forwards draft reply to AI microservice for 4-pillar quality & empathy analysis (Agent/Admin).
- `POST /department-auto-reply`: Evaluates auto-reply eligibility and generates department confirmation response (Agent/Admin).
- `GET /departments`: Returns configured departments, categories, target SLAs, and active auto-reply rules (Agent/Admin).
- `GET /benchmarks`: Fetches category SLA resolution durations and priority benchmarks (Agent/Admin).
- `GET /insights`: Fetches weekly organizational learning insights and FAQ suggestions (Agent/Admin).
- `GET /faqs`: Retrieves domain knowledge base FAQs across Technical, Billing, Identity, and API categories.
- `GET /faqs/search?q=...`: Real-time fuzzy keyword search over FAQs for instant deflection.

---

## 4. Key Architectural Mechanisms

### 4.1 Atomic Transactional Ticket Creation (SCRUM-112)
Implemented in [`ticketModel.js`](file:///D:/Projects/SupportSenseAI/backend/src/models/ticketModel.js) (`createTicketWithInitialMessage`), wrapping:
1. `BEGIN` transaction.
2. Sequence retrieval (`ticket_number_seq`).
3. `INSERT INTO tickets ... RETURNING *`.
4. `INSERT INTO ticket_messages ... RETURNING *`.
5. `COMMIT` transaction.
If message creation fails, `ROLLBACK` executes, eliminating orphaned tickets.

### 4.2 Strict Status Transition State Machine (SCRUM-111)
Implemented in [`ticketController.js`](file:///D:/Projects/SupportSenseAI/backend/src/controllers/ticketController.js):
```javascript
const ALLOWED_STATUS_TRANSITIONS = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['OPEN', 'CLOSED'],
  CLOSED: []
};
```
Invalid transitions return HTTP 400 with a descriptive error. `CLOSED` is a terminal state.

### 4.3 Async Fire-and-Forget Timeline Summarizer (SCRUM-113)
When an agent updates ticket status from `RESOLVED` to `OPEN`:
- The HTTP PATCH response returns immediately (HTTP 200) without blocking on LLM latency.
- Background worker `triggerReopenedTimelineSummary(ticketId, messages)` queries `/api/v1/ai/summarize-timeline` and upserts the result into `ai_metadata.timeline_summary`.

### 4.4 Connection Pooling & Concurrency Resilience (SCRUM-110)
- Configured in [`db.js`](file:///D:/Projects/SupportSenseAI/backend/src/config/db.js) with 20 max clients and idle timeouts.
- Tested in [`ticket-concurrency.test.js`](file:///D:/Projects/SupportSenseAI/tests/integration/ticket-concurrency.test.js) under 10 concurrent requests without sequence number collisions.

### 4.5 Duplicate Resolved Ticket Interception (SSAI-409)
Implemented via [`findDuplicateOrRelatedTickets`](file:///D:/Projects/SupportSenseAI/backend/src/models/ticketModel.js#L50-L95) in `ticketModel.js`:
- Searches previous tickets for the same customer using keyword similarity and category matching.
- If a matching ticket in `RESOLVED` or `CLOSED` status is found and `forceCreate` is false:
  - Halts creation and returns `HTTP 409` with code `DUPLICATE_RESOLVED_TICKET`.
  - Transmits previous ticket number, title, resolution date, and resolution summary notes.
  - Allows client to bypass with `{ forceCreate: true }` if the problem has recurred.

### 4.6 Same-User Follow-Up Ticket Linking (SSAI-409)
- If the customer already has an `OPEN` or `IN_PROGRESS` ticket in the same category or their message indicates follow-up intent (`"status"`, `"update"`, `"follow up"`):
  - Backend links the inquiry to the active ticket via `linked_ticket_id` or appends the message directly into the thread.
  - Returns `linked_to_existing: true` and ticket details to ensure single-source conversation history.

### 4.7 Multi-Department Routing Architecture
- Organizes agents and tickets across 4 departments:
  - **Technical Support**: Infrastructure, bugs, performance, hardware.
  - **Finance & Billing**: Invoices, charges, refunds, subscription plans.
  - **Identity & Access**: Passwords, 2FA/MFA, SSO, permissions.
  - **API Platform**: Endpoints, SDKs, webhooks, rate limits.
- Persisted in `users.department` and evaluated for intelligent ticket assignment.
