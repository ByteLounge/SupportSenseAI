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
- **Backend (Jest)**: Validates auth password hashing, JWT token verification, ticket status transition rules, and error middleware.
- **AI Microservice (Pytest)**: Validates Pydantic schema parsing, prompt text builder functions, and mock Gemini fallback responses.
- **Frontend (React Testing Library)**: Tests component rendering, button click handlers, AI Mood badge color logic, and loading state skeletons.

### 25.2 Integration Testing
- Supertest suite verifying `/api/v1/tickets` endpoints, ensuring unauthorized HTTP requests return `401 Unauthorized` and invalid payloads return `400 Bad Request`.

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

---

## 27. Risk Analysis & Mitigation Matrix

| Risk ID | Identified Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|---|
| **R-01** | Gemini API Rate Limits or Outage | High | Medium | Implement retry logic with exponential backoff and a clean fallback UI flagging tickets as "Pending AI Triage" without blocking manual support flow. |
| **R-02** | Hallucinated AI Responses | High | Low | Enforce strict Pydantic JSON schemas with required `confidence_score`. Disallow autonomous message sending (HITL model). |
| **R-03** | Sensitive Customer PII Leakage | High | Low | Strip credit card patterns, social security numbers, and auth credentials before passing raw text to external AI endpoints. |
| **R-04** | Database Query Bottlenecks under Load | Medium | Medium | Apply strict SQL indexes on `status`, `assigned_agent_id`, `created_at`, and utilize connection pooling. |

---

## 28. Future Scope

1. **Omnichannel Ingestion**: Expand ingestion capabilities to automatically pull tickets from Email (IMAP/SMTP webhook), Slack channels, and WhatsApp Enterprise API.
2. **Multilingual Auto-Translation**: Automatic bidirectional translation of customer inquiries in Spanish, French, German, or Japanese so agents can communicate in their preferred native language.
3. **Voice AI Agent Integration**: Integration with Gemini Multimodal Live API to transcribe customer call recordings and automatically populate ticket timelines and checklists.
4. **Predictive SLA Breach Alerting**: Machine learning models predicting SLA breaches 2 hours in advance and auto-reassigning tickets to available senior agents.
