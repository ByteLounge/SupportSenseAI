# Module 11: React SPA Frontend Architecture Guide

---

## 1. Frontend Architecture Overview

SupportSense AI is built as an enterprise Single Page Application (SPA) using **React 18**, **Vite**, and styled with **Tailwind CSS**. It incorporates role-based access control, modular React contexts, responsive layouts, real-time optimistic state updates, and an intelligent offline-resilient mock fallback layer.

```
[ App Shell (App.jsx) ]
        |
        +---> [ AuthProvider (AuthContext - JWT, Roles, Sarah/Alex Personas) ]
        +---> [ ThemeProvider (ThemeContext - Light / Dark Persisted State) ]
        |
        +---> [ App Layout (Navbar.jsx + Sidebar.jsx + Breadcrumbs.jsx) ]
        |        |
        |        +---> [ Core Pages ]
        |        |        |-- LoginPage.jsx (Pre-filled demo personas)
        |        |        |-- DashboardPage.jsx (Filterable ticket queue & metrics)
        |        |        |-- TicketDetailPage.jsx (Threaded conversation & AI assist)
        |        |        |-- CreateTicketPage.jsx (Form submission triggering AI triage)
        |        |        |-- DepartmentsPage.jsx (Department policies & auto-replies)
        |        |        |-- InsightsPage.jsx (Weekly AI learning insights & FAQs)
        |        |        |-- AnalyticsPage.jsx (KPI trends & SLA performance)
        |        |        |-- UsersPage.jsx (Agent & customer management)
        |        |        +-- KnowledgeBasePage.jsx (Searchable articles & FAQs)
        |        |
        |        +---> [ Novel AI Widgets ]
        |        |        |-- AIConciergeWidget.jsx & AIConciergeChatbot.jsx
        |        |        |-- TimelineSummaryBanner.jsx (Reopened ticket TL;DR)
        |        |        |-- AIToneCheckerModal.jsx (1-Click tone polisher)
        |        |        |-- QualityCheckModal.jsx (4-pillar pre-send response audit)
        |        |        |-- AIMoodBadge.jsx (🙂/😐/😠 Mood + confidence indicator)
        |        |        |-- AIAssistDrawer.jsx (Checklist, Patience score, Resolution ETA)
        |        |        +-- AISuggestionsPanel.jsx (Inline reply recommendations)
        |        |
        |        +---> [ Common Design System ]
        |                 |-- PriorityBadge.jsx (LOW, MEDIUM, HIGH, URGENT)
        |                 |-- LoadingSkeleton.jsx & Skeleton.jsx
        |                 +-- Modal, Dropdown, Table, Pagination, Toast, ThemeToggle
```

---

## 2. Global State & Context Providers

### 2.1 AuthContext (`frontend/src/context/AuthContext.jsx`)
- **JWT Lifecycle**: Manages `supportsense_token` in `localStorage`, decodes claims, and provides reactive login/logout states.
- **1-Click Demo Personas**: Pre-configured switcher between:
  - **Sarah Agent** (`sarah@supportsense.io` / `AGENT` / Support Specialist)
  - **Alex Rivera** (`alex.rivera@customer.com` / `CUSTOMER` / Acme Corp)
- **Protected Routing**: Enforces role boundaries; customer personas are redirected away from agent-restricted administrative actions.

### 2.2 ThemeContext (`frontend/src/context/ThemeContext.jsx`)
- Controls application-wide visual theme (`light` vs `dark`).
- Toggles the `dark` class on document root `<html>` element and persists preference in `localStorage`.
- Deep MoonRow Enterprise Dark theme uses `#0F172A` (Slate 900) canvas with `#1E293B` (Slate 800) container elevation and indigo/violet brand highlights.

---

## 3. Novel AI Components & Interactive Widgets

### 3.1 AI Concierge Chatbot & Ticket Crafter
- **Launcher Widget ([`AIConciergeWidget.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/ai/AIConciergeWidget.jsx))**: Floating badge button anchored to the bottom-right corner across all authenticated pages.
- **Interactive Chatbot Modal ([`AIConciergeChatbot.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/ai/AIConciergeChatbot.jsx))**:
  - Converses empathetically with users describing problems in natural language.
  - Generates interactive suggestion quick-chips (e.g. *"Check status page"*, *"Submit ticket immediately"*).
  - Automatically synthesizes a formal enterprise ticket draft with executive summary, observed error details, business impact, reproduction steps, and diagnostic assessment.
  - One-click submission directly dispatches the formulated ticket via `createTicketApi`.

### 3.2 Reopened Timeline Summary Banner ([`TimelineSummaryBanner.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/ai/TimelineSummaryBanner.jsx))
- Automatically mounts at the top of the conversation view in [`TicketDetailPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/TicketDetailPage.jsx) whenever a ticket is reopened (`RESOLVED -> OPEN`) or has extended conversation turns.
- Displays a 5–6 bullet chronological history, identifying key actions taken and highlighting root failure causes for incoming senior agents.

### 3.3 1-Click AI Response Tone Polisher ([`AIToneCheckerModal.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/ai/AIToneCheckerModal.jsx))
- Accessible directly from the ticket reply composer.
- Enables agents to select between 4 tone styles:
  - **Empathetic**: Reassuring and compassionate language validating user frustration.
  - **Concise**: High-clarity bullet points stripping unnecessary conversational filler.
  - **Formal**: Structured enterprise correspondence suitable for corporate executives.
  - **Technical**: Diagnostic precision referencing telemetry, gateway logs, and API codes.
- Previews the rewritten response alongside AI rationale before 1-click injection into the composer.

### 3.4 Pre-Send Response Quality Checker ([`QualityCheckModal.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/ai/QualityCheckModal.jsx))
- Performs a 4-axis pre-send audit evaluating:
  1. **Professionalism** (0–100)
  2. **Empathy** (0–100)
  3. **Clarity** (0–100)
  4. **Actionability** (0–100)
- Computes overall letter grade (`EXCELLENT`, `GOOD`, `NEEDS_IMPROVEMENT`) and provides targeted coaching suggestions.

### 3.5 AI Mood Indicator ([`AIMoodBadge.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/ai/AIMoodBadge.jsx))
- Visual sentiment pill rendered across table queues and ticket headers:
  - `🙂 HAPPY` (Emerald Green)
  - `😐 NEUTRAL` (Amber / Yellow)
  - `😠 FRUSTRATED` (Rose / Red)
- Hover tooltip reveals the exact confidence score (e.g. *94.5% confidence*).

### 3.6 AI Decision Assist Drawer ([`AIAssistDrawer.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/ai/AIAssistDrawer.jsx))
- Slides out alongside the ticket detail conversation view.
- Renders customer patience score gauge (`CALM`, `CONCERNED`, `FRUSTRATED`, `CRITICAL`).
- Displays predicted resolution duration grounded in category benchmarks.
- Provides interactive verification checklist checkboxes with local completion state tracking.
- Offers 1-click insertion of the AI-drafted suggested response into the reply box.

---

## 4. Common Design System Components

Located in [`frontend/src/components/common/`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/):
- **[`PriorityBadge.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/PriorityBadge.jsx)**: Consistent badge displaying `LOW`, `MEDIUM`, `HIGH`, or `URGENT` with distinct background and border tones.
- **[`LoadingSkeleton.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/LoadingSkeleton.jsx) & [`Skeleton.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/Skeleton.jsx)**: Pulse animation placeholder components ensuring smooth zero-layout-shift UI loading.
- **[`Table.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/Table.jsx) & [`Pagination.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/Pagination.jsx)**: Sortable columns, page size selectors, and responsive row navigation.
- **[`Navbar.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/Navbar.jsx) & [`Sidebar.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/components/common/Sidebar.jsx)**: Unified MoonRow enterprise branding, SupportSense logo display, active route indicators, and persona quick-switching.

---

## 5. Resilient Smart Mock Fallback Architecture (`api.js`)

In [`frontend/src/services/api.js`](file:///D:/Projects/SupportSenseAI/frontend/src/services/api.js), every API function is wrapped in `safeApiCall`:

```javascript
async function safeApiCall(apiFn, mockFallbackFn) {
  try {
    const res = await apiFn();
    return res.data?.data || res.data;
  } catch (err) {
    console.warn('[SupportSense API] Backend unavailable or offline. Engaging smart mock fallback.', err);
    return typeof mockFallbackFn === 'function' ? mockFallbackFn() : mockFallbackFn;
  }
}
```

### Key Benefits:
1. **Air-Gapped & Offline Demo Capability**: The entire frontend functions seamlessly even when backend or PostgreSQL containers are not started.
2. **Instant UI Prototyping**: Complete mock tickets (`tck-1001` through `tck-1006`) provide rich threaded conversations, forward history, checklists, and AI metadata.
3. **Deterministic State Transitions**: Status updates and reply additions mutate in-memory mock state so local demos feel responsive and persistent within the session.

---

## 6. Page Specifications & Routing

| Route | Component | Key Capabilities |
| :--- | :--- | :--- |
| `/login` | [`LoginPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/LoginPage.jsx) | Persona cards for instant 1-click Agent or Customer login. |
| `/dashboard` | [`DashboardPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/DashboardPage.jsx) | Real-time queue, filter chips, KPI statistics, mood breakdown, forward modal. |
| `/tickets` | [`TicketsPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/TicketsPage.jsx) | Full tabular ticket list with multi-column sorting, pagination, and priority filters. |
| `/tickets/:id` | [`TicketDetailPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/TicketDetailPage.jsx) | Threaded conversation, internal notes, AI Assist Drawer, Timeline Banner, Tone Polisher. |
| `/tickets/create` | [`CreateTicketPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/CreateTicketPage.jsx) | Standard ticket creation form with live AI triage classification preview. |
| `/departments` | [`DepartmentsPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/DepartmentsPage.jsx) | Department definitions, active agent counts, auto-reply toggle rules. |
| `/insights` | [`InsightsPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/InsightsPage.jsx) | Aggregated weekly learning cards, friction rankings, agent coaching alerts, FAQ library. |
| `/analytics` | [`AnalyticsPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/AnalyticsPage.jsx) | SLA compliance gauges, resolution time distribution, CSAT trend charts. |
| `/users` | [`UsersPage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/UsersPage.jsx) | User directory, department assignments, agent status controls. |
| `/kb` | [`KnowledgeBasePage.jsx`](file:///D:/Projects/SupportSenseAI/frontend/src/pages/KnowledgeBasePage.jsx) | Searchable knowledge base repository generated from AI recommendations. |
