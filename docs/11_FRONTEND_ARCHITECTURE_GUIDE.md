# Module 11: React SPA Frontend Architecture Guide

---

## 1. Frontend Architecture Overview

Built using **React 18 + Vite** and styled with **Tailwind CSS**, the SupportSense AI frontend is structured around modular state contexts, reusable UI widgets, and clear separation of concerns:

```
[ App Shell (App.jsx) ]
       |
       +---> [ AuthContext (JWT & User state) ]
       +---> [ ThemeContext (Dark/Light mode switch) ]
       |
       +---> [ Pages ]
       |        |-- LoginPage.jsx (Pre-filled demo personas)
       |        |-- DashboardPage.jsx (Filterable ticket queue & metrics)
       |        |-- TicketDetailPage.jsx (Threaded conversation & AI assist)
       |        |-- CreateTicketPage.jsx (Form submission triggering AI triage)
       |        |-- InsightsPage.jsx (Weekly AI Learning Insights)
       |
       +---> [ Novel AI Widgets ]
                |-- AIMoodBadge.jsx (🙂/😐/😠 Mood + confidence indicator)
                |-- QualityCheckModal.jsx (Pre-send response tone evaluation)
                |-- AIAssistDrawer.jsx (Checklist, Patience score, Resolution estimate)
```

---

## 2. Implemented Features

1. **Authentication & Quick Persona Switch**: Sign in as Agent Sarah or Customer Alex.
2. **Interactive Ticket Queue Dashboard**: Filter by status, priority, and text search query.
3. **AI Decision Assist Drawer**: Live rendering of customer mood, patience rating, resolution time prediction, interactive checklist checkboxes, and reopened timeline summary.
4. **Pre-Send Response Quality Checker**: 4-axis evaluation (Professionalism, Empathy, Clarity, Actionability) with 1-click suggestion insertion.
5. **Weekly AI Learning Insights**: Top repeated customer issues, common agent mistakes, and recommended Knowledge Base FAQs.
6. **Dark / Light Theme Switcher**: Persisted theme preferences toggling Tailwind `dark` class on root HTML.
