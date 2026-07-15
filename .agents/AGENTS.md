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
- **Zero Language Hardcoding**: Under no circumstances should UI strings or messages be conditionally toggled using hardcoded language-code checks (e.g. `isFR = language === 'FR'`, `language === 'EN'`, or `language === 'ES'`). This severely restricts compatibility and causes language regression bugs.
- **Universal Translator Pattern**: All interactive widgets and web interfaces must retrieve localized strings via the universal translator pattern. Add a helper inside the component:
  ```typescript
  const { language } = useLanguage();
  const t = (key: string) => {
    const dict = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };
  ```
- **Thematic Widget Registry Keys**: All UI keys injected into the global `STATIC_UI_STRINGS` registry (in `web/src/lib/translations.ts`) must follow the `widgetName_keyName` naming convention to avoid namespace collisions.
- **Dynamic Field Localization Pattern**: For widgets displaying complex database lists (such as `Milestone` or `ElementData`) containing multilingual properties, use a localized field getter rather than inline branch evaluations:
  ```typescript
  const getLocalizedField = (item: any, field: string) => {
    if (!item) return '';
    const langKey = language.toUpperCase();
    return item[`${field}${langKey}`] || item[`${field}EN`] || '';
  };
  ```
- **Seamless Extensibility**: Ensure all UI strings query the global `STATIC_UI_STRINGS` registry. This allows the system to seamlessly inherit static dictionaries (supporting all 9 languages: EN, FR, ES, DE, ZH, PT, AR, HI, UR) and dynamically resolved translations (via `DYNAMIC_UI_STRINGS` at runtime), making any widget instantly compatible with newly added languages without modifying component code.


### E. Scientific Simulations & High-Fidelity Pedagogical Laboratories
- **True Experimental & Scientific Laboratories**: All interactive widgets must be built as genuine scientific, physical, mathematical, or empirical exploration laboratories of the highest quality. We strictly prohibit "toy" components that offer shallow, gamified actions without real learning value.
- **Hands-on Manipulation & Exploration**: Widgets must enable active manipulation of parameters, allowing students to explore boundary cases, formulate scientific hypotheses, make critical observations, and test scenarios. This active pedagogical loop is crucial for reinforcing deep comprehension.
- **Real-World & Production Tooling**: The interface, inputs, control sliders, outputs, and visual metrics should closely resemble professional tools used in production environments (e.g., real-time signal synthesis, Bohr spectroscopy modeling, stoichiometry calculations, dynamic chart visualizers).
- **Faithfulness to Real Concepts**: Simulation equations, mixing coefficients, sound synthesis parameters, or physical properties must reflect authentic, real-world physics, mathematics, and science.
- **Academic Adaptability & Domain Isolation**: While widgets must adapt their vocabulary and features to the academic level (CP/elementary up to Master/PhD) and cognitive capabilities of the target student, they must not compromise on scientific accuracy. If a subject covers multiple distinct domains or degrees of complexity, develop multiple specialized widgets for the same topic rather than overloading a single component with compromises.
- **Systematic Parameterization & Translatability**: All text within widgets must be translatable using the universal translator helper pattern (`t(key)`), with zero hardcoded labels. All initial conditions, options, and limits must be customizable via MDX props to support varying pedagogical scenarios.


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

---

## 3. Database Export & Offline Git Course Set

### A. The Rule: Dual Persistence
Every fully generated course (i.e., a course whose ALL lessons have been successfully generated and validated by the pipeline) MUST exist in two forms:
1. **Primary Source of Truth (Database)**: Lessons are stored in the `lessons` Supabase table — this is the live, authoritative source used by the application.
2. **Offline Git Snapshot (MDX files)**: After successful generation, the course lessons are also exported as physical `.mdx` files under `web/content/{level}/{subject}/{course_slug}/` and committed to the Git repository. These files form the open-source, offline-accessible course set.

### B. When to Export to Git
A course qualifies for a Git file export if AND ONLY IF:
- All lessons of the course are in `status = 'completed'` in the database.
- No lesson has a `status` of `'pending'`, `'running'`, or `'failed'`.
- The course content has passed Critic validation (no pending revisions).

**Partial courses (even a single incomplete lesson) must NOT be committed to git** — the git snapshot must always represent a fully coherent course.

### C. How to Perform the Export
To regenerate the offline file set from the database, run:
```bash
node web/scripts/export_mdx.js
```
This script exports ALL completed lessons from Supabase into `web/content/` with the path structure `{level}/{subject}/{course_slug}/{lesson_slug}.{lang}.mdx`.

To additionally export the SQL seed (for seeding a fresh Supabase instance):
```bash
node web/scripts/export_db.js
```
This writes a safe, anonymized seed to `web/src/lib/supabase_seed.sql` (user data is excluded).

### D. Git Commit Convention
When committing new course content to git, use:
```
git add web/content/
git add web/src/lib/supabase_seed.sql
git commit -m "feat(courses): export [CourseName] offline MDX set + DB seed update"
```

### E. `.gitignore` Policy
- `web/content/` is **tracked** (NOT in `.gitignore`) so the offline course set is part of the open-source repository.
- `web/src/lib/supabase_seed.sql` is **tracked** for the same reason.
- Private data (user profiles, user progress) is NEVER exported by `export_db.js`.
