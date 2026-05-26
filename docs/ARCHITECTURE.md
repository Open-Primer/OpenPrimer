# Technical Architecture of OpenPrimer

This document details the software infrastructure enabling the massive generation and distribution of knowledge.

## 1. Content Factory (Python / Vertex AI)
The generation pipeline follows an agentic flow powered by **LangChain**:
1.  **Ingestion Agent**: Researches official syllabi and open-courseware resources.
2.  **Synthesis Agent**: Drafts structured `.mdx` files by chapters.
3.  **Quiz Agent**: Creates mini-quizzes and global tests based on content.
4.  **Translation Agent**: Localizes the corpus into multiple languages.

## 2. Front-end (Next.js / Tailwind CSS)
The user interface is optimized for reading and interaction:
- **Dynamic Rendering**: `next-mdx-remote` to inject interactive React components into markdown.
- **Context Engine**: Asynchronous delivery of active page content to the AI Tutor (Side Pane).
- **Gamification**: Management of user state (KP, Levels, UVs) via LocalStorage or Supabase.

## 3. Vector Intelligence
- **Embeddings**: Each module is transformed into vectors via Vertex AI Embeddings.
- **Vector Search**: Semantic search and interactive "Knowledge Map" to link concepts across disciplines.

## 4. Revision Loop (Auto-Wiki)
- **Feedback API**: Collection of user reports.
- **Correction Agent**: Analyzes reports on the GCP VM and automatically updates MDX files on GitHub.

## 5. Curriculum Autonomy Engine & Governance Cockpit
The OpenPrimer Curriculum Autonomy Engine represents a 100% query-driven governance console designed to recursively monitor search behaviors, localizations, and revisions without mock mockups:
1. **Search History Autonomy (Tab 1)**: Computes course proposals dynamically from raw `dbService.getSearchHistory()` entries representing failed queries (`wasSuccessful: false`). If counts exceed the configured `courseThreshold` (or the distinct resuggested threshold for previously rejected items), the agent auto-promotes the course request into the pipeline queue.
2. **Side-by-Side Translation Workspace (Tab 2)**: Triggers an elegant slide-over drawer showing original English content alongside translated AI drafts for dual-comparison.
3. **AI Tutor Personality Controls (Tab 3)**: Integrates global tutor system instructions (Socratic Coach, Direct Synthesizer, Gamified Companion) and tracks real-time Vertex AI token usage and cost metrics.
4. **Topology syllabus analysis (Tab 4)**: Includes a collapsible interactive topology viewer showing prerequisite dependencies.
5. **AI Badge Icon Agent (Tab 6)**: Employs real-time keyword analysis (e.g. "streak" triggers Zap/Flame icons) and auto-compiles multi-language JSON translation dictionaries instantly. Enforces strict input validation to block zero or negative metrics thresholds.
6. **Project Overview Metrics & Leaderboard**: Main `/admin` screen integrates a 28-day active study cohort heatmap and elite student leaderboard directly calculated from active local databases.
7. **Granular Retention Sliders**: Retention settings are placed directly inside the tabs they affect (Tab 1 for search logs, Tab 2 for translations, Tab 3 for reports) to vacuum expired history.

## 6. Playwright E2E Validation Matrix
E2E tests in `web/tests/admin_governance.spec.ts` execute real user simulation scenarios to guarantee database integrity:
- **Identity CRUD**: Assures student profile creation, block toggles, and secure modal deletion.
- **Autonomy Promotion**: Seeds failed search logs to force-trigger the agent's threshold evaluator, verifying reactive queue additions and cancel operations.
- **Badge Bounds Safeguard**: Asserts input sanitization, dynamic Lucide selection, and force purging.
- **Overview Mathematics**: Validates that calculated dashboard overview values match actual database counts.

## 🧱 Folder Structure
```
OpenPrimer/
├── content/          # MDX Knowledge Database
├── generator/        # Generation Factory (Python)
├── web/              # User Interface (Next.js)
## 7. Cybersecurity, Session Safeguards & Global Theming
* **API Gating & Prevent Footprinting**: The server health endpoint `/api/health` requires session verification (`x-admin-session` or `x-admin-token` headers) to prevent unauthorized footprinting of latency parameters and connection status. Safe bypasses are granted strictly in local development environments.
* **Cockpit Authorization Redirects**: A layout-level session hook (`AdminLayout`) inspects student credentials. Unauthenticated requests targeting `/admin/*` are automatically blocked and redirected to `/login`.
* **Hot-Swap Credentials persistence**: Sensitive keys (Supabase, Resend, Gemini) can be dynamic, browser-swapped dynamically without redeployments. Custom keys are transmitted via headers and preserved locally in client sandboxes.
* **Global CSS Variables Theming**: A central, event-driven theme manager is loaded at the root. Swapping theme modes (Default Dark, Sepia Paper, Focus Black) dynamically adjusts CSS variables (`--background`, `--foreground`) on `:root` and updates the entire DOM tree (including the Admin Cockpit layouts) in real-time.

## 🧱 Folder Structure
```
OpenPrimer/
├── content/          # MDX Knowledge Database
├── docs/             # Project Documentation
├── generator/        # Generation Factory (Python)
├── mobile/           # Mobile App Codebase
├── tmp/              # Temporarily Ignored Files (Ignored via .gitignore)
└── web/              # User Interface (Next.js)
```
