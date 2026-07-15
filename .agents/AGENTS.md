# OpenPrimer Workspace Guidelines & Rules

## 1. Vision, Mission & Academic Quality Guidelines

OpenPrimer is a sovereign, open-source global educational platform designed to achieve absolute academic excellence. All agents and developers working on this project must align with the core mission and standards of the platform:

### A. The Core Mission
- **Educational Spectrum**: OpenPrimer provides certified, highly rigorous courses spanning from **primary school (CP/elementary) up to university level (Master/PhD)**.
- **Global Multilingualism**: All curricula and interactive interfaces are designed to support and be localized in all major global languages natively.

### B. High-Tech Educational Stack
The platform leverages the most modern, immersive web and AI tools to create a state-of-the-art learning experience:
- **Interactive Widgets**: Rich, dynamic, and stateful widgets (like flashcards, interactive MCQ quizzes, code playgrounds, math calculators, and simulation boards) are embedded directly within the course MDX files.
- **AI Tutors & Personalities**: Personalized, context-aware AI tutors that support, test, and guide students at any time.
- **Multilingual TTS (Text-to-Speech)**: Integrated audio reading and speech synthesizers so that lessons can be listened to in any language.
- **Autonomous Generation & Translation**: Self-healing automated translation pipelines and generator agents ensuring rapid, premium-quality course production.

### C. Elite Academic Rigor
- **University-Grade Standards**: The academic content, vocabulary, definitions, and pedagogical structures of OpenPrimer must be of a quality **at least equal to that of a real-life premier university**. 
- **Real-World Authenticity**: Avoid overly simplified, generic summaries. Course materials should be deeply educational, feature authentic examples, and offer real-world academic depth close to a genuine curriculum.

### D. Zero-Hardcoding & Multi-Language Extensibility
- **Zero Language Hardcoding**: Under no circumstances should UI strings or messages be conditionally toggled using hardcoded language-code checks (e.g., `isFR = language === 'FR'`). This restricts compatibility.
- **Universal Translator Pattern**: All interactive widgets and web interfaces must retrieve localized strings via the universal translator pattern (`t("English original text")` or `t("translation_key")`).
- **Seamless Extensibility**: Ensure all strings resolved via the translator pattern query the global `STATIC_UI_STRINGS` registry. This allows the system to seamlessly inherit static dictionaries (supporting all 9 languages: EN, FR, ES, DE, ZH, PT, AR, HI, UR) and dynamically resolved translations (via `DYNAMIC_UI_STRINGS` at runtime), making any widget instantly compatible with newly added languages without modifying component code.

---

## 2. Directory Governance & Script Sandbox Rules

To prevent accidental deletion of critical system files or deployment scripts (such as `prebuild.js` or database utilities), all AI agents must strictly adhere to the following directory boundaries:

### A. The AI Sandbox Directory (`web/scratch/` and `scratch/`)
- **Primary AI Sandbox**: `web/scratch/` is the **only** directory where AI agents are allowed to write, test, execute, or manage temporary, draft, or experimental scripts. 
- **Freedom of Use**: Agents may create, edit, or delete files in `web/scratch/` without restriction. This directory is treated as transient and can be completely wiped at any time.

### B. Production Web Scripts Directory (`web/scripts/` - RESTRICTED)
- **Role**: This directory contains **production-critical machine scripts** used by the Next.js server, CI/CD, or deployment pipelines (e.g., `prebuild.js`, `export_db.js`, `import_mdx.js`, `export_mdx.js`).
- **Strict Prohibitions**:
  - **No Temporary Files**: Under no circumstances should any agent write temporary, test, or experimental files to `web/scripts/`.
  - **No Automated Mass-Cleanups**: Agents must never run automated cleanups, wildcard deletions, or script sweeps in `web/scripts/`.
  - **No Overwriting Build Assets**: Critical build and utilities scripts must never be moved or deleted unless explicitly requested.

### C. Human-Facing Admin Scripts Directory (`scripts/` at root - RESTRICTED)
- **Role**: This directory is reserved for human-facing admin tools, wrapper scripts, and high-level platform scripts.
- **Strict Prohibition**: Agents must never use the root `scripts/` directory as a sandbox for temporary files.
