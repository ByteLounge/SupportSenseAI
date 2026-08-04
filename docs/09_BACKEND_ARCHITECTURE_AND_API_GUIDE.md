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

1. **JWT Authentication & RBAC (`authMiddleware.js`)**: Enforces secure Bearer token verification and restricts specific operations (e.g. status updates, checklist toggles) to `AGENT` and `ADMIN` roles.
2. **Security Headers (`Helmet.js`)**: Enforces HTTP security headers to protect against clickjacking, MIME sniffing, and cross-site scripting (XSS).
3. **Rate Limiting (`rateLimiter.js`)**: Enforces IP-based request rate limiting (100 req/15min for API endpoints, 10 req/15min for login/registration).
4. **Global Error Handling (`errorHandler.js`)**: Captures unhandled exceptions and returns standardized error payloads.

---

## 3. Implemented API Endpoints Reference

### 3.1 Authentication Endpoints (`/api/v1/auth`)
- `POST /register`: Registers customer/agent and returns JWT access token.
- `POST /login`: Validates credentials and returns signed JWT token.
- `GET /me`: Returns profile details for the authenticated user.

### 3.2 Ticket Management Endpoints (`/api/v1/tickets`)
- `POST /`: Creates a ticket, triggers automated AI Triage, and persists initial checklist items.
- `GET /`: Returns tickets filtered by status, priority, or search term (scoped by role).
- `GET /:id`: Retrieves complete ticket details with messages, AI metadata, and checklists.
- `PATCH /:id/status`: Updates ticket status/assignment. Triggers AI timeline summarizer on reopen.
- `POST /:id/messages`: Posts message or internal note to conversation thread.
- `PATCH /:id/checklist/:itemId`: Toggles checklist item completion state.

### 3.3 AI Decision Assistance Proxy (`/api/v1/ai`)
- `POST /verify-response`: Forwards draft reply to AI microservice for tone & quality analysis.
- `GET /insights`: Fetches weekly organizational learning insights.
