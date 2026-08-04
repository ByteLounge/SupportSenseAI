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
# 1. Run Backend Unit & Integration Tests (Jest)
cd backend && npm test

# 2. Run Python AI Microservice Unit Tests (Pytest)
cd ai-service && pytest

# 3. Run End-to-End Test Suite
cd tests && npm run test:e2e
```

---

## 3. Test Coverage Summary

- **Authentication Security Tests**: Validates password hash generation, salt prefixes, and JWT signature verification.
- **Role-Based Access Control (RBAC) Tests**: Verifies that `CUSTOMER` role users cannot access agent-only internal notes or update ticket status.
- **AI Microservice Fallback Tests**: Verifies zero-downtime resilience when external Gemini API is rate-limited.
