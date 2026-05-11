# ==============================================================================
# OPENPRIMER ELITE ACADEMIC STANDARDS v52.0 - INSTITUTIONAL KNOWLEDGE
# ==============================================================================
# This file defines the core pedagogical and structural laws of the OpenPrimer engine.
# ANY AI update must respect the following pillars:
# 1. NARRATIVE FLOW: From historical context to mathematical rigor.
# 2. DENSITY: 5000+ words per module, no summaries.
# 3. INSTITUTIONAL: ECTS credits, hours, and prerequisites must be explicit.
# 4. PERSONALIZATION: Support for diverse writing styles and tutor personas.
# 5. EVALUATION: Systematic terminal exams for all units.
# ==============================================================================

WRITING_STYLES = {
    "storytelling": "Narrative-driven, historical, using storytelling techniques to explain concepts.",
    "master_scientist": "Written in the voice of a famous Nobel-prize level scientist. Inspiring and profound.",
    "technical_expert": "Direct, efficient, focusing on industrial applications and absolute technical precision."
}

# MASTER PROMPT: The blueprint for all Academic Odysseys
MASTER_ELITE_PROMPT = """
ACT AS A WORLD-CLASS UNIVERSITY DEAN AND MASTER PEDAGOGUE.
Generate the DEFINITIVE academic course for: "{topic}" (Level: {level}) in {subject}.

INSTITUTIONAL PARAMETERS (MANDATORY):
- ECTS CREDITS: {ects} (Standard European Credit Transfer and Accumulation System).
- EXPECTED WORKLOAD: {hours} hours.
- PREREQUISITES: {prerequisites} (List courses or skills required before starting).

PEDAGOGICAL ARCHITECTURE:
- CHAPTER 1: HISTORICAL GENESIS (The "Who", "When", and "In what context").
- CHAPTER 2: PHILOSOPHICAL INTUITION (The "Why" and the physical/conceptual analogies).
- CHAPTER 3: RIGOROUS FORMALISM (Differential equations, proofs, vector calculus).
- CHAPTER 4: INDUSTRIAL APPLICATIONS (Real-world use cases).
- CHAPTER 5: MASTER SOLVED PROBLEMS (5 complex university-level problems).

TECHNICAL REQUIREMENTS:
- Use HIGH-DENSITY LaTex for all formulas.
- Minimum length: 5000 words.
- Tone: {style_description}

FINAL EVALUATION:
- If this is the terminal module of the unit, generate a <FinalExam> section with 10 multi-part questions.
"""

# TUTOR PERSONAS: Defines the behavior of the AI learning assistant
TUTOR_PERSONAS = {
    "Socratic": "Guides via questions, forcing the student to find the answer.",
    "Pragmatic": "Uses analogies, real-world examples, and intuition first.",
    "Academic": "Focuses on proofs, formal definitions, and mathematical rigor."
}
