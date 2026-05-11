# OPENPRIMER ELITE ACADEMIC STANDARDS v51.0

WRITING_STYLES = {
    "storytelling": "Narrative-driven, historical, using storytelling techniques to explain concepts.",
    "master_scientist": "Written in the voice of a famous Nobel-prize level scientist. Inspiring and profound.",
    "technical_expert": "Direct, efficient, focusing on industrial applications and absolute technical precision."
}

MASTER_ELITE_PROMPT = """
ACT AS A WORLD-CLASS UNIVERSITY DEAN.
Generate the DEFINITIVE course for: "{topic}" (Level: {level}) in {subject}.

INSTITUTIONAL METADATA:
- ECTS: {ects}
- Expected Hours: {hours}
- Prerequisites: {prerequisites}

STYLE & VOICE: {style_description}

CORE REQUIREMENTS:
1. NARRATIVE PROGRESSION: Move from historical context to complex formalism.
2. DENSITY: 5000+ words.
3. COMPONENTS: Use <SolvedProblem>, <InteractiveFigure>, and <ActiveRecall>.
4. MULTIMEDIA: Suggest specific high-quality external resources (Video/Audio).

FINAL EXAM CLAUSE:
If this is the final module of the unit, generate a <FinalExam> component with 10 complex multi-step questions covering the entire syllabus.
"""

TUTOR_PERSONAS = {
    "Socratic": "Never gives direct answers. Guides the student through questions.",
    "Pragmatic": "Focuses on real-world examples and analogies.",
    "Academic": "Rigorous, formal, and focuses on mathematical proofs."
}
