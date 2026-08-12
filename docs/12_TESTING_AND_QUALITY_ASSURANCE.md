# Module 12: Testing Strategy & Automated Quality Assurance

---

## 1. Quality Assurance Strategy & Pyramid

SupportSense AI enforces a robust 3-tier testing hierarchy:

```
                  / \
                 /   \       E2E Automated Specs
                /-----\      (Playwright / User journeys)
               /       \     Integration API Tests
              /---------\    (Supertest / Auth & RBAC security)
             /           \   Unit Tests
            /-------------\  (Jest & Pytest / Business & AI logic)
```

---

## 2. Test Execution Commands

```bash
# 1. Run Backend Unit & Supertest Integration Tests (Jest)
cd backend
npm test
# Executes Jest + Supertest suites (3/3 test suites passing, 7/7 tests)

# 2. Run Python AI Microservice Unit Tests (Pytest)
python -m pytest tests/unit/ai-service
# Executes Python FastAPI unit specs (1/1 tests passing)

# 3. Run Frontend Build Check
cd frontend
npm run build
# Compiles React SPA production bundle to dist/
```

---

## 3. Test Coverage Summary

- **Authentication & Security Tests**: Validates password hashing (`bcrypt`), JWT token signing & verification, and strict role sanitization against privilege escalation.
- **Supertest REST Integration Specs**: Verifies `/health` system telemetry response, HTTP 401 unauthorized request blocking, and HTTP 400 parameter validation.
- **Role-Based Access Control (RBAC) Tests**: Verifies that `CUSTOMER` role users cannot access agent-only internal notes or update ticket status.
- **AI Microservice Fallback Specs**: Tests FastAPI zero-downtime resilience when external Gemini API is unconfigured or rate-limited.
- **Continuous Integration Pipeline**: Automated GitHub Actions CI workflow (`.github/workflows/ci.yml`) triggering on push/PR.
