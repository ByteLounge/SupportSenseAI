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
name: SupportSense AI Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install & Run Backend Tests
        run: |
          cd backend
          npm ci
          npm test

  test-ai-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install & Run AI Unit Tests
        run: |
          cd ai-service
          pip install -r requirements.txt
          pytest

  docker-build:
    needs: [test-backend, test-ai-service]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Compose Stack
        run: |
          cd deployment
          docker-compose build
```
