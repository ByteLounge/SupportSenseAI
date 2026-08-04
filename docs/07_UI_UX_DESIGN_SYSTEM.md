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

### 4.2 AI Response Quality Checker Modal Wireframe

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
| --------------------------------------------------------------------------------- |
| [ Original Draft Preview ]                | [ AI Enhanced Draft ]                |
| "We are looking into your billing error.   | "I understand how frustrating this   |
| Send your user ID."                       | billing issue is. We are reviewing   |
|                                           | your account now. Could you share..."|
|                                                                                   |
|                                           [ Apply AI Enhancement ]  [ Keep Draft] |
+-----------------------------------------------------------------------------------+
```

---

## 5. Component Library Specifications

### 5.1 Button Component Specifications
- **Primary Button**: `bg-brand-primary text-white rounded-lg px-4 py-2 hover:bg-brand-hover shadow-sm transition-all duration-200`
- **AI Action Button**: `bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-4 py-2 hover:opacity-90 shadow-md font-medium flex items-center gap-2`
- **Secondary Ghost**: `border border-border text-text-primary rounded-lg px-4 py-2 hover:bg-bg-elevated`

### 5.2 Skeleton Loader Spec (Loading States)
- Skeletons utilize a shimmer animation (`bg-gradient-to-r from-bg-elevated via-bg-surface to-bg-elevated animate-pulse`).
- Used during initial ticket queue fetch and AI recommendation loading.

---

## 6. Accessibility & Responsiveness Strategy

### 6.1 WCAG 2.1 AA Compliance
- **Keyboard Navigation**: All interactive components support `Tab`, `Shift+Tab`, `Enter`, and `Spacebar` with explicit custom focus rings (`focus:ring-2 focus:ring-brand-primary focus:outline-none`).
- **Screen Reader Support**: All dynamic badges include `aria-label` attributes (e.g. `<span aria-label="Customer Mood: Frustrated, Confidence 94 percent">😠 Frustrated</span>`).

### 6.2 Responsive Viewport Breakpoints
- **Desktop Extra Large (1440px+)**: 3-Pane Layout (Sidebar Navigation + Ticket Queue + Detail/AI Drawer).
- **Tablet / Laptop (1024px - 1439px)**: Collapsible Sidebar + Split Queue & Detail view.
- **Mobile / Small Tablet (< 1023px)**: Single Column View with slide-over drawers for AI Assist and Ticket Details.
