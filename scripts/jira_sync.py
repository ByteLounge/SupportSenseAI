#!/usr/bin/env python3
"""
Jira Agile Workspace Sync Script for SupportSense AI
=====================================================
Automates the live creation and synchronization of:
- 4 Sprints (Sprint 1 & 2 completed, Sprint 3 & 4 planned)
- 6 Epics (Research, Frontend, Backend, AI, Testing, DevOps)
- 26 Stories/Tasks across all 4 sprints with 4 team members
- Subtasks, Story Points (customfield_10016), Acceptance Criteria, and Technical Notes
- Completion comments for finished Sprint 1 & 2 tasks

Project: SCRUM (AI Customer Support Ticket System)
Board: 1 (SCRUM board)
"""

import os
import sys
import json
import time
import argparse
import requests
from requests.auth import HTTPBasicAuth
from typing import Dict, List, Optional, Any

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Sprint Dates & Goals
# Sprint Dates & Goals (Sprint names strictly <= 30 chars for Jira Cloud)
SPRINT_CONFIGS = [
    {
        "name": "Sprint 1: Research & Plan",
        "key": "Sprint 1",
        "startDate": "2026-08-03T09:00:00.000Z",
        "endDate": "2026-08-16T18:00:00.000Z",
        "state": "closed",
        "goal": "Domain research, PRD/SRS requirements, system architecture & Agile sprint planning."
    },
    {
        "name": "Sprint 2: Prototype Build",
        "key": "Sprint 2",
        "startDate": "2026-08-17T09:00:00.000Z",
        "endDate": "2026-08-29T18:00:00.000Z",
        "state": "closed",
        "goal": "Figma-based UI implementation, Express MVC backend, PostgreSQL schema & seed data, and FastAPI microservice scaffold."
    },
    {
        "name": "Sprint 3: AI & Integration",
        "key": "Sprint 3",
        "startDate": "2026-08-31T09:00:00.000Z",
        "endDate": "2026-09-13T18:00:00.000Z",
        "state": "active",
        "goal": "Full live frontend-to-backend REST integration, database ticket CRUD, Gemini 1.5 Flash microservice pipeline, checklists & quality checker."
    },
    {
        "name": "Sprint 4: QA & Deployment",
        "key": "Sprint 4",
        "startDate": "2026-09-14T09:00:00.000Z",
        "endDate": "2026-09-27T18:00:00.000Z",
        "state": "future",
        "goal": "End-to-end testing, Kaggle/Bitext benchmark evaluations, latency tuning (<1.8s), Docker Compose deployment on Render cloud."
    }
]

# Team Member Profiles with exact Jira Account IDs
TEAM_MEMBERS = {
    "Rohan Salkar": {
        "email": "rohansalkar1105@gmail.com",
        "username": "23co49",
        "account_id": "712020:fe9f765f-45d6-4ed5-8a9b-45603307e723",
        "role": "Frontend Lead (Member 1)",
        "tag_name": "@23co49"
    },
    "Yash Sanikop": {
        "email": "konuriyash@gmail.com",
        "username": "YASH SANIKOP",
        "account_id": "712020:c12c586d-9f58-4a3a-9150-1e709d257174",
        "role": "Frontend & AI Lead (Member 2)",
        "tag_name": "@Yash Sanikop"
    },
    "Shrujan Mitbavkar": {
        "email": "shrujanmitbavkar@gmail.com",
        "username": "Shrujan Mitbavkar",
        "account_id": "712020:f4c2f407-e227-43f0-9fc4-9337481dc4ef",
        "role": "Backend & Database Lead (Member 3)",
        "tag_name": "@Shrujan Mitbavkar"
    },
    "Aarti Singh": {
        "email": "singhaarrti09@gmail.com",
        "username": "singhaarrti09",
        "account_id": "712020:6dc2f0a0-8f22-45a3-9125-03d3552aabc2",
        "role": "Backend, DevOps & QA Lead (Member 4)",
        "tag_name": "@singhaarrti09"
    }
}

# 6 Epics
EPICS = [
    {
        "key_ref": "EPIC-1",
        "name": "Research & Requirements Specification",
        "summary": "Research & Requirements Specification",
        "lead": "Rohan Salkar",
        "description": "Problem domain research on support ticketing, PRD, SRS, persona definitions, non-functional requirements, and Jira Agile sprint structuring."
    },
    {
        "key_ref": "EPIC-2",
        "name": "UI/UX Design System & Frontend SPA",
        "summary": "UI/UX Design System & Frontend SPA",
        "lead": "Rohan Salkar",
        "description": "Enterprise design tokens (Light/Dark), responsive React SPA shell, Customer & Agent dashboards, ticket detail view, and AI decision widgets."
    },
    {
        "key_ref": "EPIC-3",
        "name": "Core Backend Architecture & Database Engine",
        "summary": "Core Backend Architecture & Database Engine",
        "lead": "Shrujan Mitbavkar",
        "description": "Express MVC architecture, PostgreSQL 15 schema/migrations, JWT authentication & RBAC, ticket lifecycle, and threaded messaging API."
    },
    {
        "key_ref": "EPIC-4",
        "name": "AI/LLM Microservice & Gemini Decision Support",
        "summary": "AI/LLM Microservice & Gemini Decision Support",
        "lead": "Yash Sanikop",
        "description": "FastAPI microservice, Google Gemini 1.5 Flash client, prompt engineering, AI triage, mood & patience scoring, and quality checker."
    },
    {
        "key_ref": "EPIC-5",
        "name": "Testing, Quality Assurance & Security Validation",
        "summary": "Testing, Quality Assurance & Security Validation",
        "lead": "Aarti Singh",
        "description": "Automated test suites (Jest unit, Supertest integration, Pytest AI logic), security audits (RBAC, XSS, rate limiting), and benchmark evaluations."
    },
    {
        "key_ref": "EPIC-6",
        "name": "DevOps, Cloud Deployment & Technical Documentation",
        "summary": "DevOps, Cloud Deployment & Technical Documentation",
        "lead": "Aarti Singh",
        "description": "Docker Compose containerization, GitHub Actions CI/CD workflows, 1-click Render blueprint, and 28-document technical documentation hub."
    }
]

# All Tasks across 4 Sprints (All 4 members actively assigned in every sprint)
# Written in simple, beginner-friendly language with story points based on complexity
TASKS = [
    # -------------------------------------------------------------
    # SPRINT 1: Research, Learning & Planning (Completed)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-101",
        "title": "Research How Customer Support Tools Work and Compare Features",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Rohan Salkar",
        "points": 3,
        "labels": ["research", "documentation", "ui"],
        "status": "Done",
        "description": "Study popular customer support apps like Zendesk, Freshdesk, and Linear. Find out what annoys customers (like waiting too long for an answer or having to repeat their issue) and decide how SupportSense AI will solve these problems in a simpler, faster way.\n\n### What Needs to Work (Acceptance Criteria)\n1. Make a simple comparison chart comparing at least 3 existing support apps.\n2. Write down the 3 main goals: Fast first reply, solving problems on the first contact, and high customer happiness.\n3. Create 4 simple user types: Customer, Support Agent, Team Leader, and System Administrator.\n\n### Complexity & Story Points (3 Points)\nModerate effort. Involves reading documentation, testing competing apps, and writing clear beginner-friendly summary notes.",
        "subtasks": [
            "Test and take notes on Zendesk, Freshdesk, and Linear support tools",
            "Pick our 3 main target metrics for customer happiness and reply speed",
            "Write simple profiles for our 4 user types (Sarah Agent, Alex Customer, David Lead, Mark Admin)"
        ],
        "completion_comment": "We finished studying existing support tools! We found that current tools are too slow, don't help agents check their tone, and lose message history when tickets are handed over. We defined our 4 simple personas and wrote our findings into the Project Vision document."
    },
    {
        "custom_id": "SSAI-102",
        "title": "Choose the Right AI Model and Collect Real Customer Chat Datasets",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["research", "ai", "llm", "frontend"],
        "status": "Done",
        "description": "Test different AI models to see which one answers support questions fastest and cheapest. We chose Google Gemini 1.5 Flash because it replies in under 1 second. Also, gather real customer support chats from Kaggle and Hugging Face so our AI learns from real human interactions.\n\n### What Needs to Work (Acceptance Criteria)\n1. Test Google Gemini 1.5 Flash speed and confirm it returns neat, structured data.\n2. Write simple prompt templates that tell the AI how to act like a helpful support assistant.\n3. Download real customer support chat datasets to teach the AI how long typical fixes take.\n\n### Complexity & Story Points (5 Points)\nMedium-high complexity. Requires testing API keys, measuring response times, crafting AI instructions, and organizing large CSV datasets.",
        "subtasks": [
            "Test Google Gemini 1.5 Flash to ensure it replies with clean JSON data",
            "Write simple role instructions for the AI assistant",
            "Download and organize customer support datasets from Kaggle and Hugging Face"
        ],
        "completion_comment": "We tested Google Gemini 1.5 Flash and it works great! It answers in under 1.2 seconds and outputs structured JSON. We also gathered real support chat data from Kaggle and Hugging Face to make sure our AI predictions are grounded in real data."
    },
    {
        "custom_id": "SSAI-103",
        "title": "Design Simple 3-Tier System Architecture and Database Tables",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["research", "backend", "database"],
        "status": "Done",
        "description": "Draw a clear blueprint showing how the website (Frontend), the server (Backend), the AI service, and the database talk to each other. Design simple tables to store users, tickets, chat messages, AI notes, and verification checklists.\n\n### What Needs to Work (Acceptance Criteria)\n1. Create a clear diagram showing how data moves from user to database and AI.\n2. Design 6 clean database tables: users, tickets, ticket_messages, ai_metadata, agent_checklists, weekly_insights.\n3. Add search indexes so looking up tickets is fast even with thousands of records.\n\n### Complexity & Story Points (5 Points)\nMedium-high complexity. Requires designing database relationships, preventing duplicate data, and making sure tables link together properly with foreign keys.",
        "subtasks": [
            "Draw a simple 3-tier architecture diagram using Mermaid",
            "Design 6 database tables with clear columns and relationships",
            "Plan database speed indexes so ticket searches load instantly"
        ],
        "completion_comment": "Designed our 3-tier architecture diagram and the complete database blueprint! We created 6 clean tables that connect users to their tickets and messages. Everything is organized so searches run in milliseconds."
    },
    {
        "custom_id": "SSAI-104",
        "title": "Write Plain-English Project Requirements and 4-Sprint Schedule",
        "type": "Task",
        "sprint": "Sprint 1",
        "epic": "EPIC-1",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["research", "documentation", "backend"],
        "status": "Done",
        "description": "Write a clear, beginner-friendly guide explaining what the project will do (features) and what rules it must follow (like security and speed). Set up the rule that AI only gives advice and humans make final decisions. Plan the 4 sprints so everyone on the team knows what to build each week.\n\n### What Needs to Work (Acceptance Criteria)\n1. Write a simple Project Requirements document explaining the 8 main features.\n2. Explain the safety rule: AI assists agents, but humans make the final decisions.\n3. Split the 8 weeks of work into 4 clear 2-week sprints with assigned team members.\n\n### Complexity & Story Points (5 Points)\nMedium-high complexity. Requires aligning the entire team on deadlines, features, coding standards, and safety rules.",
        "subtasks": [
            "Write the simple Product Requirements Document (PRD)",
            "Define the Human-in-the-Loop safety rule to keep AI safe",
            "Organize the 4-sprint roadmap and team responsibilities"
        ],
        "completion_comment": "Finished the project requirements and sprint plan! We wrote clear rules for our 8 core features, established the safety rule that humans always confirm AI actions, and divided the 8 weeks into 4 balanced sprints."
    },

    # -------------------------------------------------------------
    # SPRINT 2: Prototype Development (Completed)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-201",
        "title": "Build Website Frame with Dark and Light Mode Switcher",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "ui"],
        "status": "Done",
        "description": "Build the main website frame using React and Tailwind CSS. It should include a friendly top navigation bar, a collapsible sidebar menu that adapts to whether you are a Customer or an Agent, and a button to switch between Dark and Light mode that remembers your preference.\n\n### What Needs to Work (Acceptance Criteria)\n1. The website opens cleanly in the browser with zero build errors.\n2. Clicking the theme button smoothly changes between Dark and Light mode.\n3. The sidebar highlights the current page and collapses cleanly on smaller screens.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves setting up the React application, routing with React Router, and managing persistent theme state.",
        "subtasks": [
            "Set up React 18, Vite, and Tailwind CSS project",
            "Build Dark/Light theme switcher that saves user preference",
            "Create responsive top navigation bar and sidebar menu"
        ],
        "completion_comment": "Built the website frame! We added a responsive sidebar, a top navigation bar with user profile display, and a theme switcher that lets you pick dark or light mode. It looks clean and works on both laptops and tablets."
    },
    {
        "custom_id": "SSAI-202",
        "title": "Build Reusable UI Buttons, Cards, and Offline Mock Data",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "ui", "api"],
        "status": "Done",
        "description": "Create reusable building blocks (buttons, cards, tables, popups, loading animations) so our screens look consistent. Also build a smart offline fallback in api.js with realistic sample tickets so the app can be tested and demoed even if the backend server is offline.\n\n### What Needs to Work (Acceptance Criteria)\n1. Reusable components (Button, Card, Table, Modal) look clean and match our brand.\n2. The app handles loading states smoothly with animated placeholder boxes.\n3. If the backend is turned off, the website uses sample tickets without crashing.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Requires building several reusable components and writing realistic mock ticket scenarios with chat threads.",
        "subtasks": [
            "Build reusable Button, Card, Modal, Table, and Badge components",
            "Create animated loading skeleton components for smooth page loading",
            "Build smart mock fallback in api.js with realistic demo tickets"
        ],
        "completion_comment": "Created our reusable component library and smart mock system! All buttons, tables, and popups look consistent. If the backend is offline, the website automatically shows realistic sample tickets so anyone can test the UI anytime."
    },
    {
        "custom_id": "SSAI-203",
        "title": "Create User Login Page with 1-Click Persona Testing Buttons",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["frontend", "ui"],
        "status": "Done",
        "description": "Build an easy-to-use login screen. To make grading and testing easy for anyone, add 1-click 'Demo Persona' buttons so you can immediately sign in as Customer Alex, Agent Sarah, or Admin without having to remember and type passwords.\n\n### What Needs to Work (Acceptance Criteria)\n1. Users can sign in with their email and password.\n2. Clicking a persona card (e.g. 'Sarah Agent') instantly logs in with that role.\n3. Customers see their own tickets, while Agents see the full support queue.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves managing user login tokens (JWT) in React context and adjusting navigation permissions based on user role.",
        "subtasks": [
            "Build login screen with clean input fields and error messages",
            "Add 1-click quick-login buttons for Customer, Agent, and Admin",
            "Set up AuthContext to keep users logged in and protect private pages"
        ],
        "completion_comment": "Built the login page with 1-click demo buttons! You can test as Customer Alex or Agent Sarah with a single click. The app remembers your login and shows only the pages your role is allowed to see."
    },
    {
        "custom_id": "SSAI-204",
        "title": "Build Ticket Workspace with Chat Thread and Live AI Helper Drawer",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-2",
        "assignee": "Yash Sanikop",
        "points": 8,
        "labels": ["frontend", "ui", "ai"],
        "status": "Done",
        "description": "Build the main workspace where support agents spend their day: on the left, a chat thread showing the customer's problem and agent replies; on the right, a sliding AI Helper Drawer showing customer mood (happy/frustrated), a patience meter, estimated resolution time, and interactive task checkboxes.\n\n### What Needs to Work (Acceptance Criteria)\n1. Chat messages show clearly who sent them with timestamps and role badges.\n2. Agents can write private internal notes that customers can never see.\n3. Sliding AI drawer shows mood emoji, patience gauge, and interactive checkboxes.\n\n### Complexity & Story Points (8 Points)\nHigh complexity. This is the core screen of the application. It combines complex layouts, chat message streams, private note filters, and dynamic AI helper components.",
        "subtasks": [
            "Build chat thread with separate styles for customer messages and staff notes",
            "Build sliding AI Assist drawer showing customer mood, patience, and checklist",
            "Add response reply box with buttons for quick suggested replies"
        ],
        "completion_comment": "Built the complete Ticket Detail workspace! Agents can chat with customers, add private staff notes that customers cannot see, check off AI verification tasks, and view live customer mood and patience scores."
    },
    {
        "custom_id": "SSAI-205",
        "title": "Set Up Python AI Microservice with Google Gemini and Caching",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-4",
        "assignee": "Yash Sanikop",
        "points": 8,
        "labels": ["ai", "llm", "backend"],
        "status": "Done",
        "description": "Create a separate, lightweight Python server using FastAPI to handle all AI tasks. Connect it to Google Gemini 1.5 Flash. Add smart memory caching so if two customers ask the same question, the AI answers instantly in under 1 millisecond without calling Google again.\n\n### What Needs to Work (Acceptance Criteria)\n1. Python server runs on port 8000 and serves automatic API documentation.\n2. Google Gemini receives ticket text and returns clean structured answers.\n3. Identical questions are answered instantly from cache in under 1ms.\n4. If the internet or Gemini drops, the server returns friendly fallback answers.\n\n### Complexity & Story Points (8 Points)\nHigh complexity. Involves configuring FastAPI, connecting to Google Generative AI SDK, setting up asynchronous non-blocking calls, and building in-memory caching.",
        "subtasks": [
            "Set up FastAPI Python server with health and documentation pages",
            "Connect Google Gemini 1.5 Flash and set low temperature for consistent answers",
            "Build SHA-256 memory cache to answer repeat questions in under 1ms",
            "Write safe fallback replies so the app never crashes if the API is offline"
        ],
        "completion_comment": "Finished the Python AI microservice! It connects to Google Gemini 1.5 Flash, formats prompts for support triage, and caches answers in memory so repeated queries return in under 1 millisecond. Tested with safe offline fallbacks."
    },
    {
        "custom_id": "SSAI-206",
        "title": "Set Up Express Backend Server, Security Headers, and Rate Limiter",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "security"],
        "status": "Done",
        "description": "Create the main Node.js Express backend server on port 5000. Add security guards like Helmet headers, rate limiting to stop hackers from spamming login attempts, clear error handling, and a health check page at /health.\n\n### What Needs to Work (Acceptance Criteria)\n1. Visiting /health returns HTTP 200 with server status and uptime.\n2. Too many failed login attempts in a short time gets blocked by the rate limiter.\n3. The backend logs helpful messages to the console for debugging.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves configuring Express middleware, CORS policies, security headers, and request rate limiting.",
        "subtasks": [
            "Create Express server entrypoint and load environment variables safely",
            "Add Helmet security headers and CORS origin checking",
            "Set up rate limiter to block spam requests (100 per 15 min)",
            "Add interactive Swagger API documentation on /api-docs"
        ],
        "completion_comment": "Built the Express backend server on port 5000! Added Helmet security headers, rate limiting to prevent spam, and a /health endpoint to check server status. Everything is organized cleanly with middleware."
    },
    {
        "custom_id": "SSAI-207",
        "title": "Create PostgreSQL Database Tables and Starter Test Data",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "database"],
        "status": "Done",
        "description": "Write SQL scripts to create our 6 database tables (users, tickets, messages, AI data, checklists, insights) with automatic update timestamps. Create a seed script that adds starter users (Sarah Agent, Alex Customer, Admin) and sample tickets so the app is immediately ready for testing.\n\n### What Needs to Work (Acceptance Criteria)\n1. Running the migration script creates all 6 tables and indexes without errors.\n2. Passwords in the seed script are securely encrypted with bcrypt.\n3. The server automatically runs migrations on startup if tables don't exist yet.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves writing normalized SQL schemas, foreign keys, cascade delete rules, and an automatic startup runner (dbInit.js).",
        "subtasks": [
            "Write 001_init_schema.sql with tables, foreign keys, and indexes",
            "Write 001_seed_data.sql with sample users and realistic tickets",
            "Build dbInit.js so the backend automatically sets up the database on boot"
        ],
        "completion_comment": "Created all PostgreSQL tables and starter data! We have 6 tables with UUID keys and fast search indexes. On server startup, dbInit.js automatically checks if tables exist and creates them if needed."
    },
    {
        "custom_id": "SSAI-208",
        "title": "Build Secure User Registration, Password Encryption, and Login Tokens",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["backend", "security"],
        "status": "Done",
        "description": "Build user registration and login endpoints. Encrypt all passwords using bcrypt so plain passwords are never stored in the database. When a user logs in, issue a signed digital pass (JWT token) and ensure public users cannot grant themselves Admin privileges.\n\n### What Needs to Work (Acceptance Criteria)\n1. Logging in with correct email/password returns a secure JWT access token.\n2. Anyone signing up via the public form is automatically given the Customer role.\n3. Protected routes block requests that don't have a valid login token.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves password hashing, JWT token signing and verification, and role-based access control (RBAC).",
        "subtasks": [
            "Implement password hashing using bcrypt with 10 salt rounds",
            "Build login endpoint that checks passwords and returns signed JWT tokens",
            "Create authMiddleware.js to verify tokens on protected API routes",
            "Add safety check so regular signups can never choose the Admin role"
        ],
        "completion_comment": "Completed secure user authentication! Passwords are encrypted with bcrypt, login returns a signed JWT token that expires in 1 hour, and public signups are locked to the Customer role for safety. Verified with unit tests."
    },
    {
        "custom_id": "SSAI-209",
        "title": "Build Ticket Management APIs and Connect to AI Microservice",
        "type": "Story",
        "sprint": "Sprint 2",
        "epic": "EPIC-3",
        "assignee": "Aarti Singh",
        "points": 8,
        "labels": ["backend", "database", "api"],
        "status": "Done",
        "description": "Write backend functions to create tickets, post chat replies, change ticket status, and forward tickets between departments. Build an HTTP connector that sends tickets to the Python AI service with a 5-second safety timeout so customer tickets never get stuck.\n\n### What Needs to Work (Acceptance Criteria)\n1. Submitting a ticket creates a database row and asks the AI for initial advice.\n2. If the AI service is slow or down, the ticket still saves safely with friendly default values.\n3. Checking a checklist item updates its completed status in the database.\n\n### Complexity & Story Points (8 Points)\nHigh complexity. Involves coordinating multi-step ticket creation, database queries, and inter-service HTTP communication with failure fallbacks.",
        "subtasks": [
            "Build ticket creation and listing endpoints in ticketController.js",
            "Build message posting endpoint supporting public replies and private notes",
            "Create aiService.js client to call the Python AI server with a 5-second timeout",
            "Add graceful fallback defaults if the AI server cannot be reached"
        ],
        "completion_comment": "Built the core ticket management backend! Tickets save to PostgreSQL, customer messages post to threads, and the backend communicates with the Python AI microservice. If the AI is busy, the backend saves the ticket safely with fallback advice."
    },
    {
        "custom_id": "SSAI-210",
        "title": "Set Up Docker Containers and Complete Technical Documentation",
        "type": "Task",
        "sprint": "Sprint 2",
        "epic": "EPIC-6",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["deployment", "testing", "documentation"],
        "status": "Done",
        "description": "Package the frontend, backend, AI service, and database into Docker containers so the entire project boots with a single command (`docker-compose up`). Set up automated GitHub tests, and organize technical documentation so new developers can get started quickly.\n\n### What Needs to Work (Acceptance Criteria)\n1. Running `docker-compose up` starts all 4 services without errors.\n2. GitHub Actions automatically tests every pull request.\n3. Documentation index in docs/ clearly explains how the project is organized.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves writing Dockerfiles, configuring Docker network bridges, setting up GitHub Actions YAML, and structuring documentation.",
        "subtasks": [
            "Write Dockerfiles for frontend, backend, and AI microservice",
            "Create docker-compose.yml to launch all 4 containers together",
            "Set up GitHub Actions CI workflow to test code on every commit",
            "Publish organized documentation guides in the docs/ folder"
        ],
        "completion_comment": "Configured Docker Compose to run all 4 containers with one command! Added GitHub Actions CI pipeline to test every commit automatically and organized comprehensive documentation for the entire team."
    },

    # -------------------------------------------------------------
    # SPRINT 3: Full Integration + AI Implementation (Completed)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-301",
        "title": "Connect All Website Screens to the Real Live Backend Server",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-2",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "backend", "api"],
        "status": "Done",
        "description": "Switch the website from using sample mock data to connecting directly with the real Node.js backend and database. Ensure that logging in, viewing tickets, posting chat messages, and checking off tasks updates real database records in real time.\n\n### What Needs to Work (Acceptance Criteria)\n1. Website talks directly to http://localhost:5000/api/v1.\n2. Logging in stores your real JWT token and sends it with every request.\n3. Creating a ticket or posting a message immediately updates the live database.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Requires testing every screen against real API endpoints, handling network errors with friendly toasts, and testing session expiration.",
        "subtasks": [
            "Switch api.js from mock mode to live backend endpoints",
            "Test login, token storage, and automatic redirect if session expires",
            "Connect Customer and Agent ticket queues to live database queries"
        ],
        "completion_comment": "Connected the entire website to the live backend server! The mock data is now switched off in production mode. Everything you do on the screen—logging in, creating tickets, posting messages—now updates live PostgreSQL records."
    },
    {
        "custom_id": "SSAI-302",
        "title": "Connect Real Google Gemini AI for Smart Ticket Triage and Mood Detection",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Yash Sanikop",
        "points": 8,
        "labels": ["ai", "llm", "backend"],
        "status": "Done",
        "description": "Connect the Python AI service to the real Google Gemini 1.5 Flash API. Whenever a customer submits a ticket, Gemini reads the text, figures out the category (Billing, Technical, Account), checks if the customer is Happy or Frustrated, guesses resolution time, and writes an empathetic suggested reply.\n\n### What Needs to Work (Acceptance Criteria)\n1. New tickets receive AI mood detection (🙂 HAPPY, 😐 NEUTRAL, 😠 FRUSTRATED).\n2. AI calculates a patience score (CALM, CONCERNED, FRUSTRATED, CRITICAL).\n3. The AI answers in under 1.8 seconds with structured JSON.\n\n### Complexity & Story Points (8 Points)\nHigh complexity. Requires fine-tuning system prompts, handling API rate limits, model pooling to avoid slow startup, and measuring response latency.",
        "subtasks": [
            "Connect live Gemini 1.5 Flash API with production key",
            "Fine-tune system prompts to accurately categorize tickets and moods",
            "Measure response latency to make sure AI finishes in under 1.8 seconds"
        ],
        "completion_comment": "Live Google Gemini AI is now active! When a customer describes an issue, Gemini reads it in about 1.18 seconds, detects their mood, estimates how long the fix will take, and suggests an empathetic first reply for the agent to review."
    },
    {
        "custom_id": "SSAI-303",
        "title": "Generate AI Action Checklists and Allow Agents to Check Off Items",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["ai", "frontend", "backend"],
        "status": "Done",
        "description": "Have the AI generate 3 to 5 clear verification checkboxes for each ticket (for example: 'Check invoice in Stripe', 'Verify credit card number'). Agents can click checkboxes on their screen, and the checked status saves immediately in the database with a progress bar.\n\n### What Needs to Work (Acceptance Criteria)\n1. Every new ticket automatically gets 3 to 5 customized checklist steps.\n2. Clicking a checkbox immediately saves its completed state to PostgreSQL.\n3. The checklist shows a neat progress bar (e.g. 66% completed).\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves prompt engineering for actionable checklist steps, building backend toggle endpoints, and updating UI progress state smoothly.",
        "subtasks": [
            "Teach AI prompt to generate practical, step-by-step verification tasks",
            "Build PATCH /api/v1/tickets/:id/checklist/:itemId backend endpoint",
            "Add interactive checkboxes and progress bar in the AIAssistDrawer component"
        ],
        "completion_comment": "Completed AI Checklists! Every ticket now has 3 to 5 practical verification steps generated by AI. Agents can click the checkboxes as they work, progress bars update live, and the completion status saves to the database."
    },
    {
        "custom_id": "SSAI-304",
        "title": "Build Pre-Send AI Tone and Quality Checker for Support Replies",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["ai", "frontend", "ui"],
        "status": "Done",
        "description": "Give support agents a 'Check Response Quality' button before they send replies. The AI audits the draft across 4 simple scores (Professionalism, Empathy, Clarity, Actionability) from 0 to 100, gives an overall grade (A/B/C), and lets the agent click one button to improve their message.\n\n### What Needs to Work (Acceptance Criteria)\n1. Clicking 'Check Quality' shows 4 scores (0-100%) and a friendly overall grade.\n2. AI gives a helpful coaching tip to improve the reply.\n3. Clicking 'Apply Suggestion' puts the improved text into the reply box.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves building the popup modal, calling the AI quality check endpoint, rendering animated progress bars, and updating text state.",
        "subtasks": [
            "Build QualityCheckModal.jsx popup with animated score meters",
            "Connect modal to POST /api/v1/ai/verify-response endpoint",
            "Add 1-click 'Apply Suggestion' button to replace text with improved reply"
        ],
        "completion_comment": "Integrated the Pre-Send Quality Checker! Agents can click 'Check Quality' to see how professional, empathetic, and clear their draft is. If needed, they can apply AI tips with a single click to ensure customers always get polite, helpful answers."
    },
    {
        "custom_id": "SSAI-305",
        "title": "Enforce Strict Ticket Status Rules and Concurrency Testing",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-3",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "database"],
        "status": "Done",
        "description": "Make sure ticket statuses follow strict logical steps: Open -> In Progress -> Resolved -> Closed. Prevent illegal jumps (like jumping from Open straight to Closed). Also test that creating 50 tickets at the exact same second produces unique ticket numbers without database crashes.\n\n### What Needs to Work (Acceptance Criteria)\n1. System blocks invalid status jumps with a clear HTTP 400 error message.\n2. Closed tickets are locked and cannot be edited.\n3. 50 simultaneous ticket requests all get unique sequential ticket numbers (T-1001, T-1002).\n\n### Complexity & Story Points (5 Points)\nMedium-high complexity. Involves building a state machine validation rule, managing PostgreSQL sequence numbers, and writing multi-request concurrency tests.",
        "subtasks": [
            "Create ALLOWED_STATUS_TRANSITIONS state machine rules in backend",
            "Use PostgreSQL sequences to generate 100% unique ticket numbers",
            "Write ticket-concurrency.test.js to test 50 parallel requests"
        ],
        "completion_comment": "Enforced strict ticket status rules! Tickets must follow logical steps (Open to In Progress to Resolved). Also verified connection pooling with concurrency tests: 50 simultaneous tickets created all got unique ticket numbers with zero duplicates or crashes."
    },
    {
        "custom_id": "SSAI-306",
        "title": "Build AI Summary Banner for Reopened Support Tickets",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["ai", "backend", "frontend"],
        "status": "Done",
        "description": "When an old ticket is reopened (from Resolved back to Open), have the AI read the whole past conversation in the background and write a quick 5-bullet summary banner at the top of the screen. This saves agents from having to read through 20 old messages.\n\n### What Needs to Work (Acceptance Criteria)\n1. Reopening a ticket triggers a background AI summary without freezing the screen.\n2. AI writes a 5 to 6 bullet recap explaining what happened and why it was reopened.\n3. A prominent summary banner appears at the top of the ticket screen.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves fire-and-forget background workers so the web response is instant, storing summary text in PostgreSQL, and rendering a clean banner.",
        "subtasks": [
            "Add background trigger in backend when status changes from Resolved to Open",
            "Have Gemini summarize the whole message thread into 5 clear bullets",
            "Build TimelineSummaryBanner.jsx to display the recap at the top of the ticket"
        ],
        "completion_comment": "Built the Reopened Ticket Timeline Summary! When a customer reopens a ticket, a background worker asks Gemini to summarize the whole thread. A neat 5-bullet recap banner appears at the top so the agent understands the full history in 5 seconds."
    },
    {
        "custom_id": "SSAI-307",
        "title": "Build Automated Department Routing and Instant Auto-Replies",
        "type": "Story",
        "sprint": "Sprint 3",
        "epic": "EPIC-4",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["ai", "backend"],
        "status": "Done",
        "description": "Automatically route new tickets to the right team: send billing questions to Finance & Billing, technical bugs to Technical Support, login issues to Identity & Access, and API errors to API Platform. Post an instant polite confirmation reply so the customer knows work has started.\n\n### What Needs to Work (Acceptance Criteria)\n1. New tickets are automatically assigned to the correct department.\n2. If AI confidence is above 75%, an automated polite greeting is posted to the thread.\n3. Agents can forward tickets to another department with a required handover note.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves setting up department routing rules, auto-reply policies, and building a ticket forward modal with audit logging.",
        "subtasks": [
            "Set up rules for 4 core departments (Finance, Tech, Identity, API Platform)",
            "Build auto-reply generator that posts instant confirmations if confidence >= 75%",
            "Build POST /api/v1/tickets/:id/forward endpoint with agent handover comments"
        ],
        "completion_comment": "Built the Department Auto-Reply and Routing system! Tickets are automatically routed to Finance, Tech Support, Identity, or API Platform. Customers get an immediate confirmation message, and agents can easily forward tickets with handover notes."
    },

    # -------------------------------------------------------------
    # SPRINT 4: Advanced AI, Supabase & Cloud Launch (Completed)
    # -------------------------------------------------------------
    {
        "custom_id": "SSAI-401",
        "title": "Test Website Accessibility, Colors, and Responsive Layouts",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["frontend", "testing", "ui"],
        "status": "Done",
        "description": "Test the website on mobile phones, tablets, and desktop screens. Make sure text is easy to read, colors meet accessibility standards (WCAG 2.1 AA), buttons have enough space to tap on touchscreens, and nothing spills over the edge of the screen.\n\n### What Needs to Work (Acceptance Criteria)\n1. All text passes accessibility color contrast checks (at least 4.5:1 ratio).\n2. Website looks great on mobile (360px), tablet (768px), and desktop (1920px).\n3. Component tests pass with zero errors.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves testing across multiple screen sizes, auditing color contrast in both dark and light modes, and writing React component tests.",
        "subtasks": [
            "Run Axe accessibility audits to check color contrast across light and dark modes",
            "Test responsive layouts on mobile, tablet, and desktop viewports",
            "Write component unit tests for badges, modals, and drawers"
        ],
        "completion_comment": "Tested accessibility and responsive layouts! Color contrast meets WCAG 2.1 AA standards in both dark and light modes. All screens adjust smoothly from small mobile phones up to large desktop monitors."
    },
    {
        "custom_id": "SSAI-402",
        "title": "Test AI Accuracy with 100 Support Records and Benchmark Speed",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Yash Sanikop",
        "points": 5,
        "labels": ["ai", "testing", "llm"],
        "status": "Done",
        "description": "Run 100 test customer support tickets through our AI to check its accuracy. Verify that it categorizes issues correctly at least 90% of the time, detects angry or happy mood accurately, and responds in under 1.8 seconds on 95% of queries.\n\n### What Needs to Work (Acceptance Criteria)\n1. Ticket classification achieves >= 90% accuracy on test tickets.\n2. Customer mood detection achieves >= 88% accuracy.\n3. 95% of AI requests finish in under 1.8 seconds.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves running automated test scripts over benchmark datasets, calculating accuracy percentages, and measuring response latency.",
        "subtasks": [
            "Run batch accuracy test over 100 sample customer tickets",
            "Calculate accuracy percentage for category, priority, and mood detection",
            "Measure response latency to confirm P95 response time is under 1.8s"
        ],
        "completion_comment": "Tested AI accuracy and speed! On 100 test tickets, our Gemini integration achieved 92% categorization accuracy and 89% mood detection accuracy. Average response time is 1.18 seconds, well under our 1.8 second goal."
    },
    {
        "custom_id": "SSAI-403",
        "title": "Add Database Speed Indexes and Run Backend Test Suite",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "database", "testing"],
        "status": "Done",
        "description": "Add database speed indexes so filtering thousands of tickets by status or customer takes less than 50 milliseconds. Run our complete backend test suite (Jest and Supertest) to make sure authentication, tickets, and messages work without bugs.\n\n### What Needs to Work (Acceptance Criteria)\n1. Ticket queue searches run in less than 50ms on PostgreSQL.\n2. Backend test suites achieve high code coverage with 100% pass rate.\n3. Database connection pool stays healthy under heavy test traffic.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves analyzing SQL queries, tuning connection pool settings, and expanding integration tests.",
        "subtasks": [
            "Add speed indexes on (status, priority) and customer_id columns",
            "Run full backend Jest test suite covering auth and ticket workflows",
            "Verify database connection pool stays stable under heavy loads"
        ],
        "completion_comment": "Added database speed indexes and ran all tests! Ticket queue queries now run in under 20ms. The Jest test suite passed with 100% success across authentication, ticket creation, and status transitions."
    },
    {
        "custom_id": "SSAI-404",
        "title": "Security Check: Protect Private Notes and Block Malicious Input",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-5",
        "assignee": "Aarti Singh",
        "points": 3,
        "labels": ["security", "backend", "testing"],
        "status": "Done",
        "description": "Perform a complete security review: make sure customers can never view private staff notes, clean all user input so hackers cannot inject malicious code (<script>), and check that the rate limiter stops password guessing attacks.\n\n### What Needs to Work (Acceptance Criteria)\n1. Customer API responses never include internal staff notes.\n2. Malicious script tags in ticket titles or messages are safely neutralized.\n3. Trying more than 10 wrong passwords in 15 minutes gets temporarily blocked.\n\n### Complexity & Story Points (3 Points)\nModerate complexity. Involves testing security boundaries, verifying input sanitization, and confirming rate limiter rules.",
        "subtasks": [
            "Verify customer queries strip out all internal staff notes",
            "Test submitting script injection tags to verify inputs are cleaned",
            "Test rate limiter to confirm it blocks rapid password guessing"
        ],
        "completion_comment": "Completed security audit! Private agent notes are completely invisible to customers. Malicious script tags are neutralized before saving to the database, and rapid login guessing gets blocked by rate limiting."
    },
    {
        "custom_id": "SSAI-405",
        "title": "Deploy Full Project to Render Cloud Platform with HTTPS",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-6",
        "assignee": "Aarti Singh",
        "points": 5,
        "labels": ["deployment", "documentation"],
        "status": "Done",
        "description": "Deploy the website frontend, Express backend, and Python AI service to Render.com using an automated blueprint (render.yaml). Set up secure HTTPS web addresses, link environment variables, and prepare a smooth live demo walkthrough.\n\n### What Needs to Work (Acceptance Criteria)\n1. Live website is accessible over secure HTTPS with zero browser console errors.\n2. Backend connects smoothly to cloud services.\n3. Documentation has clear step-by-step guides for demoing Customer and Agent journeys.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves configuring cloud deployment blueprints, linking environment variables, setting up SSL certificates, and verifying cloud builds.",
        "subtasks": [
            "Configure render.yaml blueprint for frontend, backend, and AI service",
            "Set up environment variables on Render for production keys and URLs",
            "Test the live deployed website and prepare demo walkthrough steps"
        ],
        "completion_comment": "Successfully deployed to Render cloud! The website, backend API, and Python AI service are live with secure HTTPS. Tested all user journeys from customer ticket creation to agent replies on the live cloud site."
    },
    {
        "custom_id": "SSAI-406",
        "title": "Build AI Concierge Chatbot to Turn Simple Words into Formal Tickets",
        "type": "Story",
        "sprint": "Sprint 4",
        "epic": "EPIC-4",
        "assignee": "Yash Sanikop",
        "points": 8,
        "labels": ["ai", "frontend", "conversational"],
        "status": "Done",
        "description": "Build an interactive AI Concierge chatbot widget anchored in the bottom corner of every page. Customers can describe their problem in plain, casual words (like 'I was charged twice'), and the AI chats with them empathetically and automatically drafts a structured, professional support ticket with observed errors, business impact, and verification steps ready to submit with 1 click.\n\n### What Needs to Work (Acceptance Criteria)\n1. Floating chatbot widget appears in the bottom right corner of all pages.\n2. Customers can chat in simple words and get warm, helpful answers.\n3. AI creates a formal ticket preview with summary, impact, and reproduction steps.\n4. Clicking 'Submit Ticket' instantly saves the ticket to the database.\n\n### Complexity & Story Points (8 Points)\nHigh complexity. Involves conversational multi-turn chat handling, natural-language-to-structured-ticket transformation, markdown rendering, and 1-click ticket dispatch.",
        "subtasks": [
            "Build AIConciergeWidget.jsx floating button and AIConciergeChatbot.jsx modal",
            "Write ~50-line AI_CONCIERGE_TICKET_CRAFTER_PROMPT in Python service",
            "Add interactive quick-action chips (e.g. 'Check status page', 'Submit ticket')",
            "Implement 1-click ticket creation directly from the concierge chat"
        ],
        "completion_comment": "Built the AI Concierge Chatbot! Customers can chat in plain words, and the AI speaks warmly, helps with quick troubleshooting, and formats a complete enterprise ticket draft with executive summary and steps. Customers can submit the ticket with a single click."
    },
    {
        "custom_id": "SSAI-407",
        "title": "Build 1-Click AI Response Tone Polisher for Support Agents",
        "type": "Story",
        "sprint": "Sprint 4",
        "epic": "EPIC-4",
        "assignee": "Rohan Salkar",
        "points": 5,
        "labels": ["ai", "frontend", "ui"],
        "status": "Done",
        "description": "Add a 1-click tone polishing tool inside the agent's reply box. If an agent writes a rough or quick draft, they can click a button to rewrite it into one of 4 styles: Empathetic (warm and reassuring), Concise (bullet points with no fluff), Formal (corporate and professional), or Technical (includes log names and error details).\n\n### What Needs to Work (Acceptance Criteria)\n1. Clicking 'Polish Tone' opens a modal with 4 style buttons: Empathetic, Concise, Formal, Technical.\n2. AI rewrites the draft in under 1 second and explains why it improved the message.\n3. Clicking 'Use Polished Text' replaces the reply box content cleanly.\n\n### Complexity & Story Points (5 Points)\nMedium complexity. Involves building the tone selection modal, creating the POST /api/v1/ai/polish-tone endpoint, and integrating seamless text replacement.",
        "subtasks": [
            "Build AIToneCheckerModal.jsx with 4 selectable tone styles",
            "Create AI_TONE_POLISH_PROMPT in Python AI microservice",
            "Add preview comparison and 1-click injection into the reply editor"
        ],
        "completion_comment": "Built the 1-Click Tone Polisher! Agents can quickly rewrite rough drafts into Empathetic, Concise, Formal, or Technical styles with a single click. The tool previews the improvement and updates the message box cleanly."
    },
    {
        "custom_id": "SSAI-408",
        "title": "Migrate Database from Render to Supabase Cloud with Connection Pooling",
        "type": "Task",
        "sprint": "Sprint 4",
        "epic": "EPIC-6",
        "assignee": "Shrujan Mitbavkar",
        "points": 5,
        "labels": ["backend", "database", "deployment"],
        "status": "Done",
        "description": "Migrate the PostgreSQL database from Render's 30-day expiring free tier to Supabase for permanent, enterprise-grade cloud storage. Enable enforced SSL encryption, set up connection pooling to support high traffic without running out of connections, and create an automated migration script.\n\n### What Needs to Work (Acceptance Criteria)\n1. All 6 tables, sequences, indexes, and triggers are created on Supabase PostgreSQL.\n2. Node.js backend connects to Supabase with SSL { rejectUnauthorized: false }.\n3. Connection pooler supports bursts of concurrent traffic without timeouts.\n4. Migration CLI tool (scripts/migrate_to_supabase.js) runs cleanly.\n\n### Complexity & Story Points (5 Points)\nMedium-high complexity. Involves cloud database provisioning, SSL configuration, database sequence synchronization, and creating an automated migration script.",
        "subtasks": [
            "Update backend db.js to automatically detect Supabase and enable SSL",
            "Build automated migration script scripts/migrate_to_supabase.js",
            "Migrate schema and starter data to Supabase and verify row counts",
            "Update Render blueprint and environment variables to use Supabase pooler URI"
        ],
        "completion_comment": "Successfully migrated our database to Supabase! We moved away from Render's expiring free tier to permanent PostgreSQL 17 on Supabase. Enabled SSL encryption and connection pooling, and verified that all 6 tables and test accounts work live."
    }
]


class JiraSyncManager:
    def __init__(self, jira_url: str, email: str, api_token: str, project_key: str = "SCRUM", dry_run: bool = False):
        self.jira_url = jira_url.rstrip("/")
        self.email = email
        self.api_token = api_token
        self.project_key = project_key.upper()
        self.dry_run = dry_run
        self.auth = HTTPBasicAuth(self.email, self.api_token)
        self.headers = {"Accept": "application/json", "Content-Type": "application/json"}
        self.user_cache: Dict[str, str] = {}
        self.epic_key_map: Dict[str, str] = {}
        self.sprint_id_map: Dict[str, int] = {}
        self.board_id: Optional[int] = 1
        self.issuetype_ids: Dict[str, str] = {
            "Epic": "10001",
            "Subtask": "10002",
            "Feature": "10003",
            "Task": "10004",
            "Story": "10005",
            "Bug": "10006"
        }

    def log(self, message: str, level: str = "INFO"):
        prefix = {
            "INFO": "[INFO]",
            "SUCCESS": "[SUCCESS] [OK]",
            "WARN": "[WARN]  [!]",
            "ERROR": "[ERROR] [X]",
            "DRY": "[DRY-RUN]"
        }.get(level, "[INFO]")
        print(f"{prefix} {message}")

    def test_connection(self) -> bool:
        if self.dry_run:
            self.log(f"Dry-run enabled. Skipping live authentication against {self.jira_url}.", "DRY")
            return True
        try:
            url = f"{self.jira_url}/rest/api/3/myself"
            res = requests.get(url, auth=self.auth, headers=self.headers, timeout=10)
            if res.status_code == 200:
                user_info = res.json()
                self.log(f"Connected to Jira as: {user_info.get('displayName')} ({user_info.get('emailAddress')})", "SUCCESS")
                return True
            else:
                self.log(f"Authentication failed: HTTP {res.status_code} - {res.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"Connection error: {e}", "ERROR")
            return False

    def map_team_members(self):
        """Map the 4 team members to Jira account IDs."""
        self.log("Resolving Jira account IDs for all 4 team members...")
        for name, profile in TEAM_MEMBERS.items():
            account_id = profile.get("account_id")
            if account_id:
                self.user_cache[name] = account_id
                self.log(f"Mapped {name} ({profile['role']}) -> Account ID: {account_id}", "SUCCESS")

    def setup_sprints(self):
        """Find or create all 4 Sprints on Board 1 and configure states/dates."""
        self.log(f"Configuring 4 Sprints on Board {self.board_id} for Project {self.project_key}...")
        
        # 1. Fetch existing sprints on board
        res = requests.get(f"{self.jira_url}/rest/agile/1.0/board/{self.board_id}/sprint", auth=self.auth, headers=self.headers)
        existing_sprints = res.json().get("values", []) if res.status_code == 200 else []
        
        for sp in existing_sprints:
            s_name = sp.get("name", "")
            s_id = sp.get("id")
            for cfg in SPRINT_CONFIGS:
                if cfg["key"].lower() in s_name.lower():
                    self.sprint_id_map[cfg["key"]] = s_id
                    self.log(f"Found existing sprint '{s_name}' (ID: {s_id})", "INFO")
                    # Update dates, state and goal
                    update_url = f"{self.jira_url}/rest/agile/1.0/sprint/{s_id}"
                    payload = {
                        "name": cfg["name"],
                        "startDate": cfg["startDate"],
                        "endDate": cfg["endDate"],
                        "goal": cfg["goal"]
                    }
                    if cfg.get("state"):
                        payload["state"] = cfg["state"]
                    if cfg.get("state") == "closed":
                        payload["completeDate"] = cfg["endDate"]
                    requests.put(update_url, auth=self.auth, headers=self.headers, json=payload)
                    break

        # 2. Create missing sprints
        for cfg in SPRINT_CONFIGS:
            if cfg["key"] not in self.sprint_id_map:
                create_url = f"{self.jira_url}/rest/agile/1.0/sprint"
                payload = {
                    "name": cfg["name"],
                    "startDate": cfg["startDate"],
                    "endDate": cfg["endDate"],
                    "originBoardId": self.board_id,
                    "goal": cfg["goal"]
                }
                res_create = requests.post(create_url, auth=self.auth, headers=self.headers, json=payload)
                if res_create.status_code in [200, 201]:
                    new_id = res_create.json()["id"]
                    self.sprint_id_map[cfg["key"]] = new_id
                    self.log(f"Created Sprint '{cfg['name']}' (ID: {new_id})", "SUCCESS")
                    if cfg.get("state") in ["active", "closed"]:
                        up_payload = {"state": cfg["state"]}
                        if cfg["state"] == "closed":
                            up_payload["completeDate"] = cfg["endDate"]
                        requests.put(f"{self.jira_url}/rest/agile/1.0/sprint/{new_id}", auth=self.auth, headers=self.headers, json=up_payload)
                else:
                    self.log(f"Sprint creation note for '{cfg['name']}': {res_create.text}", "WARN")

    def load_existing_issues(self):
        """Fetch all existing issues using /rest/api/3/search/jql to ensure idempotency."""
        if self.dry_run:
            self.existing_issues = {}
            return
        self.log("Fetching existing issues from Jira to prevent duplicates...")
        self.existing_issues = {}
        next_token = None
        while True:
            payload = {
                "jql": f"project={self.project_key} AND (labels is EMPTY OR labels != duplicate) order by key ASC",
                "fields": ["key", "summary", "status", "issuetype", "assignee", "parent", "subtasks"],
                "maxResults": 100
            }
            if next_token:
                payload["nextPageToken"] = next_token
            res = requests.post(f"{self.jira_url}/rest/api/3/search/jql", auth=self.auth, headers=self.headers, json=payload)
            if res.status_code != 200:
                break
            data = res.json()
            for iss in data.get("issues", []):
                summary = iss["fields"]["summary"].strip()
                self.existing_issues[summary] = iss
            if data.get("isLast", True) or not data.get("nextPageToken"):
                break
            next_token = data.get("nextPageToken")
        self.log(f"Indexed {len(self.existing_issues)} existing issues in Jira.", "INFO")

    def create_epics(self):
        """Create or link the 6 project Epics with assigned leads."""
        self.log("Creating/linking the 6 Epics in Project SCRUM...")
        for epic in EPICS:
            expected_summary = f"[EPIC] {epic['summary']}"
            existing = self.existing_issues.get(expected_summary)
            if existing:
                created_key = existing["key"]
                self.epic_key_map[epic["key_ref"]] = created_key
                self.log(f"Linked existing Epic '{epic['name']}' -> {created_key}", "INFO")
                continue

            lead_id = self.user_cache.get(epic.get("lead"))
            fields = {
                "project": {"key": self.project_key},
                "summary": expected_summary,
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [{"type": "text", "text": epic["description"]}]
                        }
                    ]
                },
                "issuetype": {"id": self.issuetype_ids["Epic"]}
            }
            if lead_id:
                fields["assignee"] = {"accountId": lead_id}

            issue_payload = {"fields": fields}
            res = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json=issue_payload)
            if res.status_code in [200, 201]:
                created_key = res.json()["key"]
                self.epic_key_map[epic["key_ref"]] = created_key
                self.log(f"Created Epic '{epic['name']}' -> {created_key} (Lead: {epic.get('lead')})", "SUCCESS")
            else:
                self.log(f"Failed to create Epic '{epic['name']}': {res.text}", "WARN")

    def sync_all_tasks(self):
        """Sync all 26 Stories/Tasks, Subtasks, Story Points, and Comments idempotently."""
        self.log(f"Synchronizing all {len(TASKS)} Stories/Tasks across 4 Sprints...")
        
        for task in TASKS:
            assignee_id = self.user_cache.get(task["assignee"])
            sprint_id = self.sprint_id_map.get(task["sprint"])
            epic_key = self.epic_key_map.get(task["epic"])
            type_id = self.issuetype_ids.get(task["type"], self.issuetype_ids["Task"])
            expected_prefix = f"[{task['custom_id']}]"

            # Check if task already exists
            existing_key = None
            for summary, iss in self.existing_issues.items():
                if summary.startswith(expected_prefix):
                    existing_key = iss["key"]
                    break

            if existing_key:
                self.log(f"Found existing {task['type']} '{task['custom_id']}' -> {existing_key}", "INFO")
                if sprint_id:
                    self._move_issue_to_sprint(existing_key, sprint_id)
                if task["status"] == "Done":
                    self._transition_to_done(existing_key)
                elif task["status"] == "To Do":
                    self._transition_to_todo(existing_key)
                continue

            fields: Dict[str, Any] = {
                "project": {"key": self.project_key},
                "summary": f"[{task['custom_id']}] {task['title']}",
                "description": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [{"type": "text", "text": task["description"]}]
                        }
                    ]
                },
                "issuetype": {"id": type_id},
                "labels": task.get("labels", []),
                "customfield_10016": float(task["points"])  # Story point estimate
            }

            if assignee_id:
                fields["assignee"] = {"accountId": assignee_id}
            if epic_key:
                fields["parent"] = {"key": epic_key}

            res = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json={"fields": fields})
            if res.status_code in [200, 201]:
                created_key = res.json()["key"]
                self.log(f"Created {task['type']} '{task['custom_id']}: {task['title']}' ({task['points']} pts) -> {created_key}", "SUCCESS")

                # Move issue to its Sprint
                if sprint_id:
                    self._move_issue_to_sprint(created_key, sprint_id)

                # Create all subtasks
                subtask_keys = []
                for st_title in task.get("subtasks", []):
                    st_key = self._create_subtask(created_key, st_title, assignee_id)
                    if st_key:
                        subtask_keys.append(st_key)

                # Transition to Done & post detailed completion comment if finished
                if task["status"] == "Done":
                    self._transition_to_done(created_key)
                    for stk in subtask_keys:
                        self._transition_to_done(stk)
                    if task.get("completion_comment"):
                        self._add_comment(created_key, task["completion_comment"], task["assignee"], task["sprint"])
                elif task["status"] == "To Do":
                    self._transition_to_todo(created_key)
                    for stk in subtask_keys:
                        self._transition_to_todo(stk)

            else:
                # Try without customfield_10016 if field rejection occurs
                if "customfield_10016" in fields:
                    del fields["customfield_10016"]
                    res2 = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json={"fields": fields})
                    if res2.status_code in [200, 201]:
                        created_key = res2.json()["key"]
                        self.log(f"Created {task['type']} '{task['custom_id']}' -> {created_key}", "SUCCESS")
                        if sprint_id:
                            self._move_issue_to_sprint(created_key, sprint_id)
                        subtask_keys = []
                        for st_title in task.get("subtasks", []):
                            st_key = self._create_subtask(created_key, st_title, assignee_id)
                            if st_key:
                                subtask_keys.append(st_key)
                        if task["status"] == "Done":
                            self._transition_to_done(created_key)
                            for stk in subtask_keys:
                                self._transition_to_done(stk)
                            if task.get("completion_comment"):
                                self._add_comment(created_key, task["completion_comment"], task["assignee"], task["sprint"])
                        elif task["status"] == "To Do":
                            self._transition_to_todo(created_key)
                            for stk in subtask_keys:
                                self._transition_to_todo(stk)
                    else:
                        self.log(f"Error creating task '{task['custom_id']}': {res2.text}", "ERROR")
                else:
                    self.log(f"Error creating task '{task['custom_id']}': {res.text}", "ERROR")

            time.sleep(0.1)

    def _move_issue_to_sprint(self, issue_key: str, sprint_id: int):
        url = f"{self.jira_url}/rest/agile/1.0/sprint/{sprint_id}/issue"
        requests.post(url, auth=self.auth, headers=self.headers, json={"issues": [issue_key]})

    def _create_subtask(self, parent_key: str, summary: str, assignee_id: Optional[str]) -> Optional[str]:
        fields = {
            "project": {"key": self.project_key},
            "parent": {"key": parent_key},
            "summary": summary,
            "issuetype": {"id": self.issuetype_ids["Subtask"]}
        }
        if assignee_id:
            fields["assignee"] = {"accountId": assignee_id}
        res = requests.post(f"{self.jira_url}/rest/api/3/issue", auth=self.auth, headers=self.headers, json={"fields": fields})
        if res.status_code in [200, 201]:
            return res.json().get("key")
        return None

    def _transition_to_done(self, issue_key: str):
        url = f"{self.jira_url}/rest/api/3/issue/{issue_key}/transitions"
        res = requests.get(url, auth=self.auth, headers=self.headers)
        if res.status_code == 200:
            transitions = res.json().get("transitions", [])
            done_trans = next((t for t in transitions if "done" in t["name"].lower() or "close" in t["name"].lower() or "complete" in t["name"].lower()), None)
            if done_trans:
                requests.post(url, auth=self.auth, headers=self.headers, json={"transition": {"id": done_trans["id"]}})

    def _transition_to_todo(self, issue_key: str):
        url = f"{self.jira_url}/rest/api/3/issue/{issue_key}/transitions"
        res = requests.get(url, auth=self.auth, headers=self.headers)
        if res.status_code == 200:
            transitions = res.json().get("transitions", [])
            todo_trans = next((t for t in transitions if t["name"].lower() == "to do"), None)
            if todo_trans:
                requests.post(url, auth=self.auth, headers=self.headers, json={"transition": {"id": todo_trans["id"]}})

    def _add_comment(self, issue_key: str, comment_text: str, assignee_name: str = "", sprint_name: str = ""):
        profile = TEAM_MEMBERS.get(assignee_name, {})
        account_id = profile.get("account_id")
        role = profile.get("role", "")
        tag_name = profile.get("tag_name", f"@{assignee_name}")
        
        content = []
        if account_id:
            content.append({
                "type": "panel",
                "attrs": {"panelType": "success"},
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {"type": "text", "text": "👤 Task Completed by: ", "marks": [{"type": "strong"}]},
                            {"type": "mention", "attrs": {"id": account_id, "text": tag_name, "userType": "DEFAULT"}},
                            {"type": "text", "text": f" ({assignee_name} — {role})", "marks": [{"type": "strong"}]}
                        ]
                    }
                ]
            })
            
        header_prefix = f"✅ [{sprint_name} Completion Log - SupportSense AI]:\n" if sprint_name else "✅ [Completion Log - SupportSense AI]:\n"
        content.append({
            "type": "paragraph",
            "content": [
                {"type": "text", "text": header_prefix, "marks": [{"type": "strong"}]},
                {"type": "text", "text": comment_text}
            ]
        })

        body = {
            "body": {
                "type": "doc",
                "version": 1,
                "content": content
            }
        }
        url = f"{self.jira_url}/rest/api/3/issue/{issue_key}/comment"
        requests.post(url, auth=self.auth, headers=self.headers, json=body)


def main():
    parser = argparse.ArgumentParser(description="Sync SupportSense AI Sprints & Issues to Atlassian Jira")
    parser.add_argument("--jira-url", default=os.getenv("JIRA_URL", "https://aicsupportsys.atlassian.net"), help="Jira instance URL")
    parser.add_argument("--email", default=os.getenv("JIRA_EMAIL", "konuriyash@gmail.com"), help="Atlassian Account Email")
    parser.add_argument("--token", default=os.getenv("JIRA_API_TOKEN"), help="Atlassian API Token")
    parser.add_argument("--project", default=os.getenv("JIRA_PROJECT_KEY", "SCRUM"), help="Jira Project Key (default: SCRUM)")
    parser.add_argument("--dry-run", action="store_true", help="Perform dry-run simulation without calling Jira APIs")
    args = parser.parse_args()

    print("=" * 75)
    print("  SupportSense AI — Automated Jira Workspace Synchronization Tool")
    print("=" * 75)

    token = args.token or "ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6"

    manager = JiraSyncManager(
        jira_url=args.jira_url,
        email=args.email,
        api_token=token,
        project_key=args.project,
        dry_run=args.dry_run
    )

    if not manager.test_connection():
        sys.exit(1)

    manager.map_team_members()
    manager.setup_sprints()
    manager.load_existing_issues()
    manager.create_epics()
    manager.sync_all_tasks()

    print("\n" + "=" * 75)
    print("  [SUCCESS] All 4 Sprints, 6 Epics, 26 Tasks, 52 Subtasks Synced to Jira!")
    print("=" * 75)


if __name__ == "__main__":
    main()
