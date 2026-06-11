# OpenPrimer — Educational Enrichment Roadmap

> **Status**: Living document — last updated 2026-06-12  
> **Scope**: Curriculum quality pipeline (Agent 4 Critic), UX enrichment proposals, and multi-modal learning enhancements.

---

## Part 1 — Agent 4 Critic: Comprehensive Validation Checklist

The Level 4 Critic Agent (Agent 4) validates every AI-generated or AI-revised lesson before it is persisted to the database. All prompts are written strictly in **English** to ensure deterministic LLM responses.

### Checkpoint 1 — Zero-Placeholder & Prohibited Empty Tags
- Detect skeletal placeholder formulations: `"Dans cette section, nous aborderons..."`, `"Example to complete..."`, `"to be determined"`, `"etc."`.
- Detect empty custom component tags (`<Evaluation></Evaluation>`, `<SummativeEvaluation></SummativeEvaluation>`, `<Objectives></Objectives>`, `<Callout></Callout>`, etc.).
- **Action**: Hard rejection (`approved: false`) if any empty tag or placeholder is found.

### Checkpoint 2 — Academic Density
- Content must be exhaustive, detailed, and academically rigorous for the specified course level.
- Lazy summaries, text-avoidance patterns, and overly short sections are rejected.

### Checkpoint 3 — Structural Completeness & Mandated Sections
Every lesson **must** contain all of the following structural components in order:

| Position | Component | Tag / Heading |
|---|---|---|
| 1 | Prerequisites block | `<Prerequisites items={[...]} />` |
| 2 | Diagnostic quiz | `<DiagnosticQuiz ... />` |
| 3 | Introduction | `## Introduction` (or localized equivalent) |
| 4 | Learning objectives (KSA) | `<Objectives>` + `<Knowledge>`, `<Skills>`, `<Attitudes>` |
| 5 | Core body sections | `##` headings (each with interactivity — see CP5) |
| 6 | What's next / forward-looking | `<WhatsNext>` or `<EtApres>` |
| 7 | Conclusion + Summary | `## Conclusion` + `<Summary items={[...]} />` |
| 8 | Final timed evaluation | `<Quiz durationLimit={...}>`, `<SummativeEvaluation>`, or `<EssayEvaluation />` |
| 9 | Glossary | `### Glossary` / `### Glossaire` |
| 10 | Bibliography / References | `### References` / `### Références` *(not required for primary school level)* |

**Action**: Hard rejection if any of these are missing.

### Checkpoint 4 — Multimedia, Illustrations & Non-Text Media (DISCIPLINE-AWARE)

The illustration requirement is evaluated against the course subject and level:

| Discipline category | Requirement | Action if violated |
|---|---|---|
| **Visual / Spatial / Historical / Empirical** (visual arts, architecture, geography, anatomy, biology, cinema, history of art) | ≥ 2–3 `<CustomFigure />`/`<Image />` + ≥ 1 `<Mermaid />` or `<InteractiveDiagram />` | **Hard rejection** |
| **Quantitative / Experimental** (mathematics, physics, chemistry, economics, computer science) | ≥ 1 visual interactive component: `<Mermaid />`, `<FunctionPlotter />`, `<FunctionManipulator />`, `<EquationManipulator />`, `<Geometry2D />`, `<DataChart />`, or `<StructureViewer3D />` | **Hard rejection** if none present |
| **Textual / Philosophical / Literary / Humanistic** (philosophy, literature, linguistics, ethics, law, political theory) | Text-dominant lessons are acceptable. Zero visual elements → soft advisory in critique only. Minimum enrichment recommended: 1 portrait `<CustomFigure />`, 1 `<Mermaid />` concept map, or 1 `<CriticalThinking />`/`<PointOfView />` block. | **No rejection** — advisory only |

#### Audio/Video Integrity Sub-Check
When `<AudioPlayer />`, `<Audio />`, or `<Video />` components are present:
- `src` or `url` must be non-empty (not a placeholder like `"url_here"`).
- `duration` attribute must be specified and **≤ 3 minutes** (micro-learning constraint).
- A caption line must appear directly below (italicized: `*Audio 1 : Title - Description.*`).
- For actual external resources, an accessible fallback redirect link must be present.
- **Action**: Hard rejection if `duration` is missing or empty on any `<Audio />` or `<Video />` tag.

### Checkpoint 5 — Section Interactivity & Discipline-Specific Simulators

#### 5a — Per-Section Interactivity Rule
Every `##` section must contain ≥ 1 active learning component:
- `<Quiz>`, `<FillInBlanks />`, `<SolvedExercise>`, `<UnsolvedExercise />`
- OR any sandbox: `<FunctionPlotter />`, `<FunctionManipulator />`, `<EquationManipulator />`, `<Geometry2D />`, `<CodeSandbox />`, `<DataChart />`, `<StructureViewer3D />`, `<DynamicSimulation />`

> A `<Quiz>`-only section is acceptable for introductory/textual sections. Deeper technical sections must use higher-order interactive components.

#### 5b — Discipline-Specific Simulator Mandate

| Discipline | Mandatory component | Action if absent |
|---|---|---|
| Life Sciences / Anatomy / Biology / Medicine / Chemistry / Material Sciences | `<InteractiveDiagram />` OR `<StructureViewer3D presetId="..." />` | **Hard rejection** |
| Mathematics / Physics / Economics / Finance | `<FunctionPlotter />`, `<FunctionManipulator />`, `<EquationManipulator />`, `<DataChart />`, or `<Geometry2D />` | **Hard rejection** |
| Computer Science / Engineering / Programming | `<CodeSandbox />` | **Hard rejection** |
| History / Geography / Political Science / Social Sciences | `<Mermaid />` (timeline or process flowchart) | **Hard rejection** |
| Philosophy / Literature / Linguistics / Law / Ethics | No mandatory simulator. `<CriticalThinking />`, `<PointOfView />`, or `<HistoricalAnecdote />` strongly recommended | **Advisory only** |

### Checkpoint 6 — No Fragmented Sentences in Key Points
`<Summary items={[...]} />` items must each be a **complete, grammatically whole, self-contained sentence**. No artificial splits of a single clause across multiple items.

### Checkpoint 7 — Historical Person & Artwork Overlays
- Every historical figure, scientist, writer, director, or notable person in the **body text** must be wrapped in `<HistoricalPerson name="..." lang="..." bio="...">`.
- Notable artworks must be wrapped in `<Artwork name="..." lang="...">`.
- ⚠️ Do **NOT** require these tags inside JSX attribute properties (`options`, `explanation`, `knowledge`, `skills`, `attitudes` arrays) — nesting JSX inside JS string attributes crashes the MDX parser.

### Checkpoint 8 — No Source Redirects for Flowcharts
System-generated `<Mermaid />` diagrams, `<InteractiveDiagram />`, sandboxes, and simulators must **NOT** have `"Accéder directement à la source"` / `"Access the resource directly"` links — they have no external source URL.

### Checkpoint 9 — Interactive Assessment Integrity
Audit all `<Quiz>`, `<Question>`, `<Option>`, `<DiagnosticQuiz>`, `<EssayEvaluation>`, `<UnsolvedExercise>`:
- Every `<Quiz>` must have ≥ 1 `<Question>`, each with ≥ 2 `<Option>` elements.
- Every `<Option>` must have a `correct={true|false}` attribute. Reject any quiz where no option has `correct={true}`.
- Every `<DiagnosticQuiz>` must have `options` and a valid `correctIndex`.
- Questions, answers, and `explanation` attributes must match the academic level — no generic, trivial, or low-effort content.

---

## Part 2 — Full Component & Media Registry

All components available in the MDX renderer (`MdxContent.tsx`) and their pedagogical role:

### Assessments & Exercises
| Component | Use case |
|---|---|
| `<Quiz>` + `<Question>` + `<Option>` | Formative and summative MCQ quizzes with rerouting explanations |
| `<DiagnosticQuiz>` | Entry-point adaptive diagnostic with section-skip targeting |
| `<FillInBlanks sentence="..." answer="..." />` | Cloze-text exercises (ideal for primary/middle school) |
| `<SolvedExercise>` | Fully worked example with step-by-step resolution |
| `<UnsolvedExercise>` | Interactive numerical challenge with tolerance, hints, and solution unlock |
| `<EssayEvaluation>` | Long-form written evaluation with AI tutor grading |
| `<SelfEval>` | Student self-evaluation reflection prompt |
| `<SummativeEvaluation>` | Module-closing formal evaluation block |

### Visual & Diagrams
| Component | Use case |
|---|---|
| `<CustomFigure />` / `<Image />` | Static illustrations (Pollinations.ai generated) with caption and fallback |
| `<Mermaid chart="..." />` | Flowcharts, timelines, concept maps, process diagrams |
| `<InteractiveDiagram />` | Labeled interactive anatomy/biology/engineering schematics with hotspots |
| `<ComparisonSlider before="..." after="..." />` | Before/after visual comparisons (art restoration, map changes, etc.) |
| `<DataChart data={...} />` | Dynamic bar, line, or pie charts from inline data |

### Simulations & Sandboxes
| Component | Use case |
|---|---|
| `<FunctionPlotter />` | Plots linear, supply-demand, compound interest curves with parameter sliders |
| `<FunctionManipulator />` | Full curve sandbox: linear, quadratic, sinusoidal, exponential, logarithmic |
| `<EquationManipulator />` | Step-by-step algebraic equation solver + chemical stoichiometry balancer |
| `<Geometry2D />` | Interactive 2D geometry canvas for angles, shapes, and coordinate systems |
| `<StructureViewer3D presetId="..." />` | Interactive 3D molecular/crystal structure viewer (h2o, co2, ch4, nacl, graphene) |
| `<DynamicSimulation presetId="..." />` | Physics, chemistry, or economic variable simulation |
| `<CodeSandbox />` | Inline code execution environment (HTML, JS, Python) |

### Audio & Video (Micro-learning)
| Component | Use case |
|---|---|
| `<AudioPlayer />` / `<Audio />` | Narrations, historical audio documents, language pronunciation — max 3 min |
| `<Video />` | Embedded educational video (YouTube/Vimeo) — max 3 min |

### Contextual Enrichment Blocks
| Component | Use case |
|---|---|
| `<HistoricalPerson>` | Hover-overlay biographical panel with Wikipedia redirect |
| `<FictionalCharacter>` | Hover-overlay for fictional characters (literature, cinema) |
| `<Artwork>` / `<Oeuvre>` | Hover-overlay for artworks with Wikipedia redirect |
| `<Location>` / `<Place>` | Hover-overlay for pedagogically important places |
| `<HistoricalEvent>` | Hover-overlay for major historical events |
| `<Epistemology>` | University-level digression box (history of concept, controversies, limits) |
| `<CriticalThinking>` / `<EspritCritique>` | Socratic reasoning challenge |
| `<DidYouKnow>` / `<LeSaviezVous>` | Curiosity-sparking factoid |
| `<HistoricalAnecdote>` / `<AnecdoteHistorique>` | Contextual historical narrative |
| `<ScientificMethod>` / `<MethodeScientifique>` | Empirical cycle walkthrough |
| `<PointOfView>` / `<PointDeVue>` | Dialectical perspective confrontation |
| `<GoingFurther>` + `<GoingFurtherItem>` | Deep-dive academic/research reading recommendations |
| `<WhatsNext>` / `<EtApres>` | Forward-looking connector to next lesson/module |

### Learning Objectives
| Component | Use case |
|---|---|
| `<Objectives>` | KSA objectives container |
| `<Knowledge>` | Declarative knowledge targets (Savoir) |
| `<Skills>` | Procedural skill targets (Savoir-faire) |
| `<Attitudes>` | Epistemic/analytical posture targets |

### Alerts & Callouts
| Component | Use case |
|---|---|
| `<Alert type="note|warning|info|important|tip|caution">` | Styled callout blocks |
| `<Callout>` | Alias for Alert |
| Standard markdown `> [!NOTE]`, `> [!WARNING]`, etc. | Parsed to styled Alert blocks |

---

## Part 3 — Educational Experience Enrichment Proposals

The following proposals are ranked by estimated pedagogical impact. Items marked 🔴 are high-priority, 🟡 medium, 🟢 exploratory.

### 🧠 Adaptive Cognition & Personalization
| # | Proposal | Description | Priority |
|---|---|---|---|
| A1 | **Fluid DiagnosticQuiz Skip UX** | Make the section-skip triggered by `<DiagnosticQuiz targetSectionId="...">` more visible in the UI — animated scroll, highlighted skipped badge, and confirmation toast | 🔴 |
| A2 | **Dynamic Quiz Difficulty Scaling** | After 3+ lessons, adjust formative `<Quiz>` difficulty automatically based on the user's historical answer success rate (SRS-inspired adaptive difficulty) | 🔴 |
| A3 | **Coach Persona by Discipline** | The `CoachPopover` AI persona adapts tone per discipline: socratic for philosophy, rigorous for math, encouraging for primary — beyond just language | 🟡 |
| A4 | **Personalization Agent (Agent 5)** | Post-generation agent that rewrites 2–3 examples per lesson to match the learner's declared background (e.g. sports metaphors for athletes, musical analogies for musicians) | 🟡 |

### 🎮 Gamification & Engagement
| # | Proposal | Description | Priority |
|---|---|---|---|
| B1 | **Badges & Achievement System** | Award badges for: first lesson completed, perfect quiz score, 7-day streak, full curriculum completion. Stored in user profile | 🔴 |
| B2 | **Daily Learning Streak** | Day-streak counter visible in `TopNav` or profile dashboard. Reset at midnight local time. Push notification opt-in for mobile | 🟡 |
| B3 | **Opt-in Leaderboard** | Anonymous ranking by curriculum (e.g. "Top 10 learners in Art History this month") visible on the curriculum page | 🟢 |
| B4 | **XP & Level System** | Accumulated XP per quiz/flashcard/essay completion. Learner level (Apprentice → Scholar → Master) displayed on profile | 🟢 |

### 📊 Feedback & Meta-Learning
| # | Proposal | Description | Priority |
|---|---|---|---|
| C1 | **Post-Lesson Session Report** | After finishing a lesson: time spent, quiz score breakdown, glossary terms consulted, flashcards reviewed — shown as a visual summary card | 🔴 |
| C2 | **Concept Mastery Graph** | Visual graph (D3 or Mermaid) of concepts mastered vs in-progress vs not-started across a full curriculum | 🟡 |
| C3 | **Personal Annotations** | Allow users to highlight text and attach private notes (stored in Supabase), visible inline on re-reading the lesson | 🟡 |
| C4 | **On-demand Exercise Generator** | "Generate a new exercise" button in-lesson that calls the AI to produce a fresh `<UnsolvedExercise>` contextually adapted to the current section | 🟡 |

### 🔊 Accessibility & Multimodality
| # | Proposal | Description | Priority |
|---|---|---|---|
| D1 | **Full Lesson TTS Read-Aloud** | "Read this lesson" button that activates `AudioReader` on the complete lesson text (not just excerpts), with pause/resume and speed control | 🔴 |
| D2 | **Auto-generated 90-second Audio Summary** | After lesson validation, auto-generate a TTS audio clip of the `<Summary>` key points — downloadable and listenable offline | 🟡 |
| D3 | **High-Contrast Adaptive Mode** | Detect `prefers-contrast: more` CSS media query and auto-switch to high-readability palette (no user action required) | 🟡 |
| D4 | **Video Auto-Subtitles** | Generate subtitles for embedded `<Video>` content via Whisper API, displayed as closed captions | 🟢 |

### 🤝 Social & Collaborative Learning
| # | Proposal | Description | Priority |
|---|---|---|---|
| E1 | **Per-Lesson Discussion Thread** | Comment thread per lesson (Notion-style), AI-moderated for quality. Threaded replies for peer discussion | 🟡 |
| E2 | **Shareable Flashcard Decks** | Export/share personal SRS flashcard decks as a public link — other users can import and study the same deck | 🟡 |
| E3 | **Duo Revision Sessions** | Real-time synchronized flashcard session for two learners (WebSocket), alternating question-answer roles | 🟢 |
| E4 | **Study Group Rooms** | Small group (≤ 8) shared curriculum progress view, with group quiz sessions triggered by a group admin | 🟢 |

### ⚙️ AI Pipeline Enhancements
| # | Proposal | Description | Priority |
|---|---|---|---|
| F1 | **Pre-check Regex Guard before Agent 4** | Lightweight regex scan (check for `<Prerequisites`, `<DiagnosticQuiz`, `<Objectives`, `<Summary`, `### Glossary`, `### References`) before invoking the LLM critic — saves token cost by catching obvious omissions in milliseconds | 🔴 |
| F2 | **Bloom's Taxonomy Verb Audit** | Agent 4 verifies that `<Objectives>` verbs match the expected Bloom's level for the course (Recall/Understand for primary, Analyze/Evaluate/Create for L3+) | 🟡 |
| F3 | **Citation Reachability Pre-validation** | Before persisting, ping all `### References` URLs via HEAD requests. Replace 404s with a `[⚠️ Link unavailable]` marker rather than storing dead links | 🟡 |
| F4 | **Auto-generated Lesson Audio Summary** | After generation, call TTS on the `<Summary items={[...]} />` to produce a `<Audio />` clip stored in Supabase Storage and auto-injected at the top of the Conclusion section | 🟢 |

---

## Part 4 — Implemented Changes (Session 2026-06-11/12)

| Change | File | Status |
|---|---|---|
| Feynman trigger threshold: 15 → 3 characters | `CourseClientWrapper.tsx` | ✅ Done |
| Flashcard "Skip / Next Card" button | `RefinedUI.tsx` | ✅ Done |
| Auth callback localization (5 languages) | `auth/callback/page.tsx`, `translations.ts` | ✅ Done |
| Agent 4: mandate Conclusion, Glossary, References | `ai.ts` — `verifierPrompt` | ✅ Done |
| Agent 4: mandate Prerequisites, DiagnosticQuiz, Objectives, WhatsNext | `ai.ts` — `verifierPrompt` | ✅ Done |
| Agent 4: discipline-aware illustration checkpoint | `ai.ts` — `verifierPrompt` | ✅ Done |
| Agent 4: Audio/Video `duration` integrity check | `ai.ts` — `verifierPrompt` | ✅ Done |
| Agent 4: discipline-specific simulator mandate (5b) | `ai.ts` — `verifierPrompt` | ✅ Done |
| Same full checklist applied to revision `promptCritic` | `ai.ts` — `reviseCourseContent` | ✅ Done |
| Quiz/translation strings localized (5 languages) | `translations.ts` | ✅ Done (by user) |
| `resolveAndPersistMedia` integrated in all 3 save points | `ai.ts` | ✅ Done (by user) |
