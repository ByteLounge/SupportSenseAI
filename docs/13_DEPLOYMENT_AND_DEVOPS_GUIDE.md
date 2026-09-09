# Module 13: Deployment, CI/CD Pipeline & DevOps Guide

---

## 1. Containerized Multi-Tier Architecture

SupportSense AI is fully containerized across 4 multi-tier services, deployable via **Docker Compose** locally or through automated cloud infrastructure pairing **Render.com** (Compute) with **Supabase** (Managed PostgreSQL):

```
                          [ Internet Ingress ]
                                   |
                  +----------------+----------------+
                  |                                 |
                  v                                 v
        [ React Frontend ]                  [ Express Backend ]
         Port 80 (Nginx)                    Port 5000 (Node 18)
                  |                                 |
                  |                                 +---> [ Supabase Cloud ]
                  |                                 |      Port 6543 (Supavisor Pooler)
                  v                                 |
        [ REST Proxy / API ]                        +---> [ FastAPI AI Service ]
                  +------------------------------------->  Port 8000 (Gemini SDK)
```

---

## 2. One-Command Local & VM Deployment (`Docker Compose`)

To boot the entire production stack locally or on a cloud virtual machine (AWS EC2, Azure VM, GCP Compute Engine):

```bash
# 1. Clone repository and navigate to deployment directory
cd deployment

# 2. Start all services in detached container mode with live build
docker-compose up -d --build

# 3. Verify active container health
docker-compose ps

# 4. View container logs
docker-compose logs -f
```

### Container Ports & Service Access
| Container Name | Exposed Port | Role / Internal Endpoint |
| :--- | :--- | :--- |
| `supportsense_frontend` | `http://localhost:80` | Production React SPA (Served via Nginx) |
| `supportsense_backend` | `http://localhost:5000` | Express REST API & Swagger UI (`/api-docs`) |
| `supportsense_ai_service` | `http://localhost:8000` | FastAPI Python AI Microservice (`/api/v1/docs`) |
| `supportsense_db` | `localhost:5432` | PostgreSQL 15 Database (`supportsense_db`) |

---

## 3. 1-Click Cloud Deployment via Render Blueprint (`render.yaml`) & Supabase

SupportSense AI utilizes **Supabase** for its production relational database tier and **Render** for compute services, defined via [`render.yaml`](file:///D:/Projects/SupportSenseAI/render.yaml):

### Render Infrastructure Topology
```yaml
services:
  # 1. Python FastAPI AI Microservice (Google Gemini)
  - type: web
    name: supportsense-ai-service
    env: docker
    dockerfilePath: ./ai-service/Dockerfile
    dockerContext: ./ai-service
    plan: free
    envVars:
      - key: GEMINI_API_KEY
        sync: false # Configured via Render Dashboard
      - key: GEMINI_MODEL_NAME
        value: gemini-1.5-flash

  # 2. Node.js Express Backend API
  - type: web
    name: supportsense-backend
    env: docker
    dockerfilePath: ./backend/Dockerfile
    dockerContext: ./backend
    plan: free
    envVars:
      - key: PORT
        value: 5000
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false # Set in Render Dashboard to Supabase Pooler URI (port 6543)
      - key: DB_SSL
        value: "true"
      - key: JWT_SECRET
        generateValue: true
      - key: AI_SERVICE_URL
        fromService:
          type: web
          name: supportsense-ai-service
          property: host

  # 3. React SPA Frontend (Static Site)
  - type: web
    name: supportsense-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    envVars:
      - key: VITE_API_BASE_URL
        fromService:
          type: web
          name: supportsense-backend
          property: host
          append: /api/v1
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## 4. GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)

Every pull request and push to `main` or `develop` triggers the automated CI workflow in [`.github/workflows/ci.yml`](file:///D:/Projects/SupportSenseAI/.github/workflows/ci.yml):

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

    env:
      DATABASE_URL: postgresql://postgres:postgrespassword@localhost:5432/supportsense_db
      DB_HOST: localhost
      DB_PORT: 5432
      DB_NAME: supportsense_db
      DB_USER: postgres
      DB_PASSWORD: postgrespassword
      NODE_ENV: test

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: supportsense_db
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgrespassword
        ports:
          - 5432:5432
        options: >-
          --health-cmd="pg_isready -U postgres -d supportsense_db"
          --health-interval=5s
          --health-timeout=5s
          --health-retries=5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: backend/package-lock.json

      - name: Initialize Database
        run: |
          CONTAINER=$(docker ps -q --filter "ancestor=postgres:15-alpine")
          docker exec -i "$CONTAINER" psql -U postgres -d supportsense_db < database/migrations/001_init_schema.sql
          docker exec -i "$CONTAINER" psql -U postgres -d supportsense_db < database/seeds/001_seed_data.sql

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

---

## 5. Production Environment Variables Reference

| Variable | Target Service | Purpose | Example / Default |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | Port Express binds to | `5000` |
| `NODE_ENV` | Backend | Environment flag | `production` / `development` |
| `DATABASE_URL` | Backend | Supabase / PostgreSQL URI | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres` |
| `DB_SSL` | Backend | Enforce SSL encrypted connection | `true` |
| `JWT_SECRET` | Backend | HMAC SHA-256 signing secret | `supersecretjwtkey...` |
| `AI_SERVICE_URL` | Backend | FastAPI proxy destination | `http://localhost:8000` or Render internal host |
| `CORS_ORIGIN` | Backend | Allowed CORS origins | `http://localhost:3000,http://localhost:80` |
| `GEMINI_API_KEY` | AI Service | Google Gemini API Key | `AIzaSy...` |
| `GEMINI_MODEL_NAME`| AI Service | Target Gemini model | `gemini-1.5-flash` |
| `VITE_API_BASE_URL`| Frontend | Ingress API base path | `/api/v1` or full backend domain |

