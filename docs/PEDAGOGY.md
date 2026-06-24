# 🎓 OpenPrimer Pedagogical Philosophy & Curriculum Metrics
## The Socratic AI Tutor, Feynman Analogies & Dynamic Syllabus Design

This document details the pedagogical framework of OpenPrimer, including the Socratic method of our interactive tutor, learning heuristics, research notes, and syllabus metrics.

---

## 1. Core Pedagogical Heuristics

OpenPrimer rejects simple slide-reading formats. The platform leverages two primary educational principles to achieve high student retention:

### A. The Feynman Technique (Analogical Learning)
Our **Agent 3A (Narrative Scribe)** drafts all course contents based on Richard Feynman's simplification technique:
1.  **Deconstruction:** Demystifying highly abstract technical concepts (e.g. *Quantum Superposition*) using standard real-world analogies.
2.  **Linguistic Clarity:** Removing complex terminology in introductory chapters, introducing concepts sequentially.
3.  **Active Simulation:** Integrating React components designed by **Agent 3B (Widgets Architect)** directly into reading panes so students can manipulate vectors or examine code outputs dynamically as they read.

### B. The Socratic Method (Guided Dialogue)
The **AI Tutor Agent** operates as an interactive Socratic Guide. Unlike standard LLM assistants that immediately output direct solutions, our tutor:
1.  **Never gives the direct answer:** When a student asks "What is the answer to question 3?", the tutor breaks the problem down.
2.  **Asks guiding questions:** Encourages critical thinking by prompting: *"What would happen to the balance if we doubled the gravity?"* or *"Let's look at line 4 of the code snippet together. What is the value of variable `x` at that step?"*
3.  **Adapts instructions dynamically:** If the student fails an assessment MCQ, the tutor analyzes the selected wrong choice and suggests tailored analogies to fill the specific knowledge gap.

### C. Dynamic Syllabus Design (Agent 1 & 2 / Syllabus Scribe)
Course structures are dynamically aligned with the discipline's epistemological DNA (ADN Cognitif) and the student's level:
1. **Sciences Déductives / Formelles**: Focused on logical causations (Lemme ➔ Théorème ➔ Démonstration ➔ Corollaire).
2. **Sciences Empiriques / Expérimentales**: Focused on observation and visual aids (Hypothèse ➔ Protocole ➔ Observation ➔ Modélisation).
3. **Sciences Humaines et Discursives**: Focused on rhetoric and dialectics (Thèse ➔ Antithèse ➔ Synthèse).
4. **Sciences Appliquées / Ingénierie**: Focused on engineering design patterns, sandbox simulations, and constructivism.

Gradation limits adjust constraints per age group:
* **Primaire (CP-CM2)**: Metaphor-heavy, visual, narrative structure. Max 3 lessons.
* **Collège/Lycée**: Transitional formalization of core methodology.
* **Supérieur (L1-L3)**: Strict academic formalism, research-grade proofs, limits of models.

### D. Dual-Decoupled Verification Loop & Quality Gate (Agent 4A & 4B)
All dynamically written outputs from Agent 3A (Narrative text) and Agent 3B (Widgets JSON) are checked independently for "Zero-Placeholder" compliance and pedagogical alignment. Skeletal text or misaligned JSON is rejected, and constructive critiques are looped back to the respective generator (up to 3 times) to guarantee maximum text density, pedagogical integrity, and perfect grammatical cohesion.

---

## 2. Academic Credits & Calibration Metrics

To align with professional academic paths and represent study workloads without government-regulated misrepresentation, each course inside OpenPrimer maps to strict workload metrics:

*   **Academic Credits:** Instead of regulated ECTS terminology, OpenPrimer uses **Academic Credits** (crédits). These credits are calibrated to exactly **10 times the number of estimated course hours** (e.g., a course requiring 60 hours of active study yields exactly 600 credits, representing the equivalent academic weight).
*   **Archiving Level / Status:**
    *   `0`: Active course (fully available in browse catalog).
    *   `1`: Archived Level 1.
    *   `2`: Archived Level 2 (available only for enrolled students).
    *   `3`: Archived Level 3 (deleted/suppressed).
*   **Validation Threshold Metric:** Configurable passing metrics (default: 80% correct answers across module quizzes) required to unlock the canonical Course Badge.
*   **Translations dictionary:** Courses contain a nested translations map (`translations?: Record<string, { title: string; description: string }>`) supporting localized browse cards in **EN**, **FR**, **ES**, **DE**, and **ZH**.

---

## 3. Academic Research Notes & Historical Context

OpenPrimer draws heavily from modern cognitive science research regarding self-paced learning and LLM-assisted coaching:

### A. The 2-Sigma Problem (Benjamin Bloom, 1984)
*   **Context:** Bloom's research proved that an average student tutored one-on-one using mastery learning techniques performs **two standard deviations (2-Sigma)** better than students taught in standard classrooms.
*   **OpenPrimer Implementation:** Our interactive Socratic sidebar is designed to approximate this private tutoring level at zero cost, scaling personalized master-level guidance to millions of global students.

### B. Active Recalling & Spaced Repetition (Ebbinghaus Forgetting Curve)
*   **Context:** Cognitive retention drops exponentially unless students actively recall concepts.
*   **OpenPrimer Implementation:** We place assessments (MCQs and self-reflection prompts) directly inside course reading streams rather than consolidating them at the very end, forcing active retrieval cycles.
*   **Milestones Telemetry:** When a student unlocks achievements (Badges), the Supabase database logs dynamic study logs, tracking student retention metrics to fine-tune active recall thresholds.
