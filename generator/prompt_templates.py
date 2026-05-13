# ==============================================================================
# OPENPRIMER ELITE ACADEMIC STANDARDS v62.0 - INSTITUTIONAL KNOWLEDGE
# ==============================================================================

ACADEMIC_SCALING = {
    "L1": {"ects": 6, "hours": 150, "complexity": "Introductory University", "math": "Calculus & Linear Algebra", "length": 5000},
    "L2": {"ects": 6, "hours": 150, "complexity": "Intermediate University", "math": "Multivariable & Differential Eqs", "length": 6500},
    "L3": {"ects": 9, "hours": 225, "complexity": "Advanced University", "math": "Topology & Vector Fields", "length": 8000},
}

WRITING_STYLES = {
    "storytelling": "Narrative-driven, historical, using storytelling techniques to explain concepts.",
    "master_scientist": "Written in the voice of a famous Nobel-prize level scientist. Inspiring and profound.",
    "technical_expert": "Direct, efficient, focusing on industrial applications and absolute technical precision."
}

# --- STAGE 1: THE ARCHITECT ---
ARCHITECT_PROMPT = """
ACT AS AN ACADEMIC ARCHITECT.
Task: Create a structural JSON blueprint for the module: "{topic}" ({level}).
The blueprint must define the pedagogical flow and anchor interactive elements.

OUTPUT FORMAT (Strict JSON):
{{
  "module_title": "...",
  "chapters": [
    {{ "id": 1, "title": "Historical Genesis", "goal": "..." }},
    {{ "id": 2, "title": "...", "goal": "...", "interactives": ["SolvedProblem", "VideoPlaceholder", "InteractiveDerivation"] }},
    ...
  ],
  "math_anchors": ["List of key formulas to derive"],
  "visual_map": ["List of 3-4 key diagrams or animations needed"]
}}
"""

# --- STAGE 2: THE WRITER ---
WRITER_PROMPT = """
ACT AS A MASTER PEDAGOGUE. 
Generate the MDX content for "{topic}" using the provided Blueprint.

CORE LAWS:
1. CONTENT ONLY: Do NOT add versions, certifications (Gold/Elite), or titles like "Academic Odyssey". Cut the crap.
2. RICHNESS: Use <SolvedProblem />, <Quiz />, <Video id="..." />, and <Glossary /> tags.
3. VISUALS: For every complex concept, include a [FIGURE DESCRIPTION] block or <Figure src="..." />.
4. RIGOR: Full LaTeX derivations for all key formulas.
5. TONE: {style_description}

FORMATTING:
- Use standard Markdown with MDX components.
- Language: {lang}
- Minimum length: {target_length} words.

BLUEPRINT:
{blueprint}
"""

MASTER_ELITE_PROMPT = """
[DEPRECATED - USE TWO-STAGE PIPELINE]
ACT AS A WORLD-CLASS UNIVERSITY DEAN AND MASTER PEDAGOGUE.
Generate the DEFINITIVE academic course for: "{topic}" (Level: {level}) in {subject}.
"""

TUTOR_PERSONAS = {
    "Socratic": "Guides via questions, forcing the student to find the answer.",
    "Pragmatic": "Uses analogies, real-world examples, and intuition first.",
    "Academic": "Focuses on proofs, formal definitions, and mathematical rigor."
}
