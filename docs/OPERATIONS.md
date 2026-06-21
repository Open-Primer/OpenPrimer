# 🛠️ OpenPrimer Operational Manual & Governance Handbook
## Administrative Cockpit, Cost Tracker Controls & Open-Source Contributing

This document details the operational governance, cost management, code contributions, and administration guidelines for the **OpenPrimer** platform.

---

## 1. The Administrative Governance Cockpit

OpenPrimer includes a centralized, tabbed administrative dashboard (`/admin`) designed to monitor search patterns, manage tutor parameters, review translations, and configure platform settings. The cockpit UI is **fully internationalized** in 9 languages (EN, FR, ES, DE, ZH, PT, AR, HI, UR) with automatic RTL layout for Arabic and Urdu:

1.  **Search History Autonomy (Tab 1):** Real-time monitoring of failed queries (`dbService.getSearchHistory()` where `wasSuccessful: false`). If a missing course topic crosses the configured threshold, the Autonomy Engine automatically queues it for creation.
2.  **Side-by-Side Translation Workspace (Tab 2):** Admin review drawer displaying original English MDX side-by-side with localized drafts, allowing instant edits and confirmation.
3.  **AI Tutor Personality Controls (Tab 3):** Global system instructions panel to configure Socratic, Direct, or Gamified prompt personas. Tracks total Vertex AI tokens consumed and cost estimations.
4.  **Syllabus Topology Viewer (Tab 4):** Collapsible graphical tree detailing prerequisite dependencies across disciplines.
5.  **AI Badge Builder Engine (Tab 6):** Automated badge generator. Analyzes user actions (e.g. \"streak\" triggers Flame icons) and automatically compiles multilingual dictionary entries. *Strict validation blocks zero or negative threshold parameters.*
6.  **Granular Retention Sliders:** Placed directly inside active views (Tab 1 for search, Tab 2 for translations, Tab 3 for feedback) to instantly vacuum and prune expired history logs.

---

## 2. Token Quotas & Operational Cost Tracking

To protect your budget, OpenPrimer tracks every API call and Vertex AI token spent by users interacting with the AI Tutor or the Content Translation pipeline.

### A. Cost tracker Metrics
*   **Gemini 2.5 Flash:** Used for fast tutoring conversations and simple assessments generation.
*   **Gemini 2.5 Pro:** Reserved for deep pedagogical revision patches and primary ingestion research.
*   **Cost Calculations:** Calculated in real-time on `/admin/health` and Tab 3 using direct token consumption counters.

### B. User Quotas & Abuse Safeguards
*   **Quota Limits:** Students have a daily token allowance. If a user profile sends abnormally repetitive queries or abuses conversational tools, the cost controller automatically restricts their profile key and logs a warning on the admin dashboard.
*   **Pruning & DB Vacuuming:** Administrative logs and telemetry are automatically vacuumed using the *Granular Retention Sliders* to prevent database bloat and keep hosting completely free.

---

## 3. Contributing Guidelines & Coding Standards

We welcome community pull requests to improve OpenPrimer! To keep the repository clean and ensure compile-time stability, adhere to these guidelines:

### A. Coding Standards (TypeScript & CSS)
*   **TypeScript Parity:** Every file must compile with zero errors under `npx tsc --noEmit`. No implicit `any` types.
*   **Vanilla CSS:** Swapping themes or adding styles must rely strictly on standard CSS Custom Variables (e.g. `--background`, `--foreground`) declared inside `/web/src/app/globals.css`. Avoid ad-hoc inline styles.
*   **No Placeholders:** Never commit temporary console log simulations or placeholder mock values for production features. Implement proper fallback degradation patterns instead.

### B. Git Workflow
1.  Fork the repository and create your feature branch: `git checkout -b feat/my-new-feature`.
2.  Maintain comment integrity. Never erase unrelated docstrings or developer comments.
3.  Stage only source files (exclude logs or compiler cache files).
4.  Commit with clean descriptive messages: `feat(tutor): implement custom socratic prompt overrides`.
5.  Ensure compilation tests succeed before requesting review:
    ```bash
    cd web
    npx tsc --noEmit
    ```
