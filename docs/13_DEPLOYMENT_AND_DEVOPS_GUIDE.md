# Module 13: Deployment, CI/CD Pipeline & DevOps Guide

---

## 1. One-Command Production Deployment (`Docker Compose`)

SupportSense AI is fully containerized across 4 multi-tier microservices.

To boot the entire production stack locally or on a cloud virtual machine (AWS EC2, Azure VM, GCP Compute Engine):

```bash
# 1. Clone repository and navigate to deployment folder
cd deployment

# 2. Start all services in detached container mode
docker-compose up -d --build

# 3. Verify active container health
docker-compose ps
```

---

## 2. Container Ports & Service Access

| Container Name | Exposed Port | Role / Endpoint |
|---|---|---|
| `supportsense_frontend` | `http://localhost:80` | Production React SPA (Served via Nginx) |
| `supportsense_backend` | `http://localhost:5000` | Express REST API & Swagger UI (`/api-docs`) |
| `supportsense_ai_service` | `http://localhost:8000` | FastAPI Python AI Microservice (`/api/v1/docs`) |
| `supportsense_db` | `localhost:5432` | PostgreSQL 15 Database |

---

## 3. GitHub Actions CI/CD Pipeline Configuration (`.github/workflows/ci.yml`)

```yaml
name: SupportSense AI CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master ]

jobs:
  backend-tests:
    name: Backend Unit & Integration Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - name: Install Dependencies
        run: cd backend && npm ci
      - name: Run Jest Test Suite
        run: cd backend && npm test

  frontend-build:
    name: Frontend Build & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install Dependencies
        run: cd frontend && npm ci
      - name: Build React Production Bundle
        run: cd frontend && npm run build

  ai-service-tests:
    name: AI Microservice Pytest Suite
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python 3.10
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      - name: Install Python Dependencies
        run: |
          cd ai-service
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      - name: Run Pytest Test Suite
        run: PYTHONPATH=ai-service pytest tests/unit/ai-service
```
