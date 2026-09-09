# Module 07: UI/UX Design System & Wireframe Specifications

---

## 1. Enterprise Design System Overview

SupportSense AI utilizes a modern, sleek, enterprise-grade design system engineered for high-density information display, low cognitive load, and effortless navigation across Light and Dark themes.

```
+-----------------------------------------------------------------------------------+
|                            SUPPORTSENSE UI DESIGN SYSTEM                          |
+-------------------+--------------------+-------------------+----------------------+
| Color Tokens      | Typography System  | Component Specs   | Accessibility (WCAG) |
| Dark/Light Theme  | Inter / Outfit     | Glassmorphic Cards| Contrast 4.5:1       |
| HSL Palette       | Fluid Scale 12-32  | AI Mood Badges    | ARIA Keyboard Focus  |
+-------------------+--------------------+-------------------+----------------------+
```

---

## 2. Color Palette & Design Tokens

### 2.1 HSL Color Tokens

| Token Name | Light Mode Value | Dark Mode Value | Usage / Semantic Role |
|---|---|---|---|
| `--color-bg-primary` | `hsl(210, 20%, 98%)` | `hsl(222, 47%, 11%)` | Main application background |
| `--color-bg-surface` | `hsl(0, 0%, 100%)` | `hsl(217, 33%, 17%)` | Card, container, and drawer background |
| `--color-bg-elevated` | `hsl(210, 20%, 96%)` | `hsl(217, 33%, 22%)` | Hover states, dropdowns, modal background |
| `--color-border` | `hsl(214, 32%, 91%)` | `hsl(217, 19%, 27%)` | Subtle dividing lines and component borders |
| `--color-text-primary` | `hsl(222, 47%, 11%)` | `hsl(210, 40%, 98%)` | Headings, primary text |
| `--color-text-secondary` | `hsl(215, 16%, 47%)` | `hsl(215, 20%, 65%)` | Subtitles, timestamps, metadata |
| `--color-brand-primary` | `hsl(234, 89%, 74%)` | `hsl(234, 89%, 74%)` | Primary buttons, active tabs, brand accents |
| `--color-brand-hover` | `hsl(234, 89%, 65%)` | `hsl(234, 89%, 80%)` | Interactive hover states |

### 2.2 Novel AI Status & Mood Color System

| Status / Mood | Emoji | Accent Color (Light/Dark) | Badge Background |
|---|---|---|---|
| **Mood: Happy** | 🙂 | `hsl(142, 71%, 45%)` (Emerald Green) | `hsla(142, 71%, 45%, 0.15)` |
| **Mood: Neutral** | 😐 | `hsl(217, 91%, 60%)` (Sky Blue) | `hsla(217, 91%, 60%, 0.15)` |
| **Mood: Frustrated** | 😠 | `hsl(0, 84%, 60%)` (Coral Red) | `hsla(0, 84%, 60%, 0.15)` |
| **Patience: Calm** | 🟢 | `hsl(142, 71%, 45%)` | Emerald Tint |
| **Patience: Concerned** | 🟡 | `hsl(38, 92%, 50%)` (Amber Yellow) | Amber Tint |
| **Patience: Frustrated** | 🟠 | `hsl(25, 95%, 53%)` (Orange) | Orange Tint |
| **Patience: Critical** | 🔴 | `hsl(350, 89%, 60%)` (Deep Crimson) | Crimson Tint |

---

## 3. Typography System

Powered by Google Fonts: **Inter** (Body & Controls) and **Outfit** (Display Headings & Analytics Numbers).

| Level | Size | Weight | Line Height | CSS Variable |
|---|---|---|---|---|
| Display H1 | 32px (2rem) | 700 (Bold) | 1.2 | `--font-h1` |
| Section H2 | 24px (1.5rem) | 600 (SemiBold) | 1.3 | `--font-h2` |
| Component H3 | 18px (1.125rem) | 600 (SemiBold) | 1.4 | `--font-h3` |
| Body Text | 14px (0.875rem) | 400 (Regular) | 1.5 | `--font-body` |
| Subtext / Caption | 12px (0.75rem) | 500 (Medium) | 1.4 | `--font-caption` |
| Code / Monospace | 13px | 400 | 1.4 | `--font-mono` |

---

## 4. UI Layout Wireframes

### 4.1 Ticket Dashboard Layout (Agent View)

```
+---------------------------------------------------------------------------------------------------+
| [SupportSense AI]  🔍 Search tickets...    [+ New Ticket]    🌙 Dark Mode  👤 Sarah (Agent)       |
+---------------------------------------------------------------------------------------------------+
| SIDEBAR         | TICKET QUEUE                                 | TICKET DETAIL & AI ASSIST        |
| --------------- | -------------------------------------------- | -------------------------------- |
| 📊 Dashboard    | 🔴 T-1042: Payment Failed on Checkout        | T-1042: Payment Failed           |
| 📥 All Tickets  |    Customer: Alex Rivera                     | Customer: Alex Rivera (Pro)      |
| ⭐ Assigned (5) |    Mood: 😠 Frustrated (94%)                 | Status: [ In Progress v ]        |
| ⏳ SLA Breach (1)|    Patience: 🔴 Critical                     | Priority: 🔴 URGENT              |
| 📈 Analytics    |    Est: 1-2 days | Category: Billing        | -------------------------------- |
| 💡 KB Insights  | -------------------------------------------- | 🤖 AI DECISION ASSIST DRAWER     |
|                 | 🟡 T-1039: API Authentication Token Error    | • Customer Mood: 😠 Frustrated   |
|                 |    Customer: DevCorp Team                    | • Patience: 🔴 Critical (0.92)    |
|                 |    Mood: 😐 Neutral (82%)                    | • Predicted Res: 1-2 days        |
|                 |    Patience: 🟡 Concerned                    | • AI Checklist:                   |
|                 | -------------------------------------------- |   [x] Verify Stripe Log ID       |
|                 | 🟢 T-1031: Request for Dark Theme           |   [ ] Issue Refund if failed     |
|                 |    Customer: Mina Vance                      |   [ ] Send confirmation email    |
|                 |    Mood: 🙂 Happy (89%)                      | -------------------------------- |
|                 |                                              | 📝 THREAD CONVERSATION            |
|                 |                                              | [Agent Reply Box               ] |
|                 |                                              | [ ✨ Check Quality ]  [ Send ]  |
+---------------------------------------------------------------------------------------------------+
```

### 4.2 AI Concierge Chatbot Widget Wireframe

```
+-----------------------------------------------------------------------------------+
| 🤖 SupportSense AI Concierge                                                [ — ][ X ]|
+-----------------------------------------------------------------------------------+
| [SupportSense Logo] "Hi Alex! Describe your issue in simple, everyday words.      |
|                      I'll diagnose it and formulate a formal support ticket."     |
|                                                                                   |
| Customer: "I got double charged on my card ending 4921 yesterday! $1,200 twice." |
|                                                                                   |
| Concierge: "I completely understand how frustrating that is. I've formulated a   |
|            formal ticket for our Finance & Billing team with high priority."      |
|                                                                                   |
| +-------------------------------------------------------------------------------+ |
| | 🎫 Synthesized Formal Ticket Specification                                    | |
| | Title: [Billing] Duplicate Payment Discrepancy & Gateway Audit - Alex Rivera  | |
| | Department: Finance & Billing   | Priority: 🔴 URGENT   | SLA: 2-4 Hours     | |
| | Mood: 😠 FRUSTRATED (94%)       | Patience: 🔴 CRITICAL                      | |
| | Checklist: [ ] Trace Stripe charge ID  [ ] Verify settled vs auth hold        | |
| +-------------------------------------------------------------------------------+ |
|                                                                                   |
| [ Type your message in plain words...                                  ] [ Send ] |
|                                                    [ 🚀 Dispatch Formal Ticket ]  |
+-----------------------------------------------------------------------------------+
```

### 4.3 Reopened Ticket Timeline Summary Banner Wireframe (`TimelineSummaryBanner.jsx`)

```
+-----------------------------------------------------------------------------------+
| ⚡ REOPENED TICKET TIMELINE SUMMARY (TL;DR)                     Generated by AI   |
| • Step 1 - Customer (Alex): Reported duplicate $1,200 charge on Visa card 4921.  |
| • Step 2 - Agent (Sarah): Verified Stripe logs and routed to Finance department.  |
| • Step 3 - Agent (Elena): Processed $1,200 refund for transaction ch_3N9x821a.  |
| • Step 4 - Customer (Alex): Reopened ticket stating bank shows charge not credited|
| • Pending: Re-verify payment processor settlement batch with merchant gateway.    |
+-----------------------------------------------------------------------------------+
```

### 4.4 1-Click AI Response Tone Polishing Modal (`AIToneCheckerModal.jsx`)

```
+-----------------------------------------------------------------------------------+
| ✨ 1-Click AI Response Tone Polisher                                        [ X ]|
+-----------------------------------------------------------------------------------+
| Select Desired Style:                                                             |
| [ 💖 Empathetic ]   [ ⚡ Concise ]   [ 👔 Formal ]   [ 🔧 Technical ]              |
|                                                                                   |
| Original Draft:                                                                   |
| "We are investigating the charge. Will let you know when refund settles."          |
|                                                                                   |
| AI Polished Output (Empathetic):                                                  |
| "Hello Alex! Thank you so much for your patience. I completely understand how     |
| concerning unexpected duplicate charges are for your team. We have escalated      |
| transaction ch_3N9x821a with our payment processor, and I will keep you updated  |
| every step of the way until it is fully resolved."                                |
|                                                                                   |
| Rationale: Added warm validation of user frustration and clear accountability.    |
|                                                                                   |
|                                               [ Apply to Reply Box ]  [ Discard ] |
+-----------------------------------------------------------------------------------+
```

### 4.5 AI Response Quality Checker Modal Wireframe

```
+-----------------------------------------------------------------------------------+
| 🤖 AI Response Quality & Tone Check                                          [ X ]|
+-----------------------------------------------------------------------------------+
| Overall Quality Score: 88 / 100 (GRADE: GOOD)                                     |
|                                                                                   |
|  Professionalism  [====================......] 85%                                |
|  Empathy          [======================....] 92%                                |
|  Clarity          [========================..] 96%                                |
|  Actionability    [==================........] 78%                                |
|                                                                                   |
| 💡 AI Recommendation:                                                             |
| "Consider adding exact timeline steps before requesting the account ID so the     |
| customer feels reassured about resolution timing."                                |
|                                                                                   |
| [ Apply AI Enhancement ]  [ Keep Draft ]                                          |
+-----------------------------------------------------------------------------------+
```

---

## 5. Component Library & Branding Specifications

### 5.1 MoonRow Enterprise Branding & Logo Asset
- **Asset Location**: `logo.png` (root) and `frontend/src/assets/logo.png`.
- **Display**: Embedded in Navbar brand header, Login screen card, AI Concierge launcher widget, and ticket details.
- **Brand Palette**: MoonRow dark indigo & deep sapphire gradients paired with crisp neutral borders.

### 5.2 Common & Enterprise Components
- **`PriorityBadge.jsx`**: Color-coded priority pill tags (`LOW`: Gray, `MEDIUM`: Blue, `HIGH`: Amber, `URGENT`: Crimson).
- **`AIMoodBadge.jsx`**: Renders customer sentiment (`🙂 HAPPY`, `😐 NEUTRAL`, `😠 FRUSTRATED`) with numerical confidence percentage.
- **`LoadingSkeleton.jsx` & `Skeleton.jsx`**: High-density shimmer animations for asynchronous data fetching states.
- **`Breadcrumbs.jsx`**: Contextual hierarchical navigation bar with route link history.
- **`Pagination.jsx`**: Accessible data table pagination controls.

---

## 6. Accessibility & Responsiveness Strategy

### 6.1 WCAG 2.1 AA Compliance
- **Keyboard Navigation**: All interactive components support `Tab`, `Shift+Tab`, `Enter`, and `Spacebar` with explicit custom focus rings (`focus:ring-2 focus:ring-brand-primary focus:outline-none`).
- **Screen Reader Support**: All dynamic badges include `aria-label` attributes (e.g. `<span aria-label="Customer Mood: Frustrated, Confidence 94 percent">😠 Frustrated</span>`).

### 6.2 Responsive Viewport Breakpoints
- **Desktop Extra Large (1440px+)**: 3-Pane Layout (Sidebar Navigation + Ticket Queue + Detail/AI Drawer).
- **Tablet / Laptop (1024px - 1439px)**: Collapsible Sidebar + Split Queue & Detail view.
- **Mobile / Small Tablet (< 1023px)**: Single Column View with slide-over drawers for AI Assist and Ticket Details.
