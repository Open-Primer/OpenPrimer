# ==============================================================================
# OPENPRIMER ELITE ACADEMIC STANDARDS v63.0 - PEDAGOGICAL PATTERNS
# ==============================================================================

ACADEMIC_SCALING = {
    "L1": {"ects": 6, "hours": 150, "complexity": "Introductory University", "math": "Calculus & Linear Algebra", "length": 5000},
    "L2": {"ects": 6, "hours": 150, "complexity": "Intermediate University", "math": "Multivariable & Differential Eqs", "length": 6500},
    "L3": {"ects": 9, "hours": 225, "complexity": "Advanced University", "math": "Topology & Vector Fields", "length": 8000},
}

PEDAGOGICAL_PATTERNS = {
    "FIRST_PRINCIPLES": "Start from an indisputable axiom. Deduce rules step-by-step. The student builds the formula, doesn't memorize it.",
    "REVERSE_ENGINEERING": "Dissect a finished product or a spectacular failure (e.g., Tacoma Narrows Bridge). Introduce theory to explain the fix.",
    "INQUIRY_BASED": "Pose a counter-intuitive mystery. Guide through 3 false hypotheses before revealing the true theory.",
    "BOTTOM_UP": "Give micro-bricks without the big picture. Let the student assemble them until the 'Aha!' moment.",
    "DIALECTIC": "Thesis (Classic theory) -> Antithesis (Opposing school) -> Synthesis (Modern consensus).",
    "GAMIFICATION_SURVIVAL": "Emergency scenario (e.g., hemorrhage, server crash). Theory is taught as a survival manual.",
    "ANALOGY_THREAD": "Maintain a strong physical metaphor (e.g., TCP/IP as a postal system) throughout the entire chapter.",
    "EVOLUTIONARY": "Explain discovery via human history (e.g., Atom models from Thomson to Quantum).",
    "TROUBLESHOOTING": "Symptom-based decision tree. Theory is taught at each node of the diagnostic.",
    "CONCEPT_MAP": "Purely relational. No new info, just weaving links between previous chapters."
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

AVAILABLE PEDAGOGICAL PATTERNS:
{patterns_list}

OUTPUT FORMAT (Strict JSON):
{{
  "module_title": "...",
  "assigned_pattern": "ONE_OF_THE_ABOVE",
  "chapters": [
    {{ 
      "id": 1, 
      "title": "...", 
      "goal": "...", 
      "pedagogical_approach": "How to apply the assigned pattern here",
      "interactives": ["FeynmanBox", "PredictOutcome", "SolvedProblem", "Quiz", "Video"]
    }}
  ],
  "math_anchors": ["List of key formulas to derive"],
  "visual_map": ["List of key diagrams, animations, or iFrames (PhET/GeoGebra) needed"]
}}
"""

# --- STAGE 2: THE WRITER ---
WRITER_PROMPT = """
ACT AS A MASTER PEDAGOGUE. 
Generate the MDX content for "{topic}" using the provided Blueprint.

CORE LAWS:
1. PATTERN ADHERENCE: Strictly follow the assigned pattern: {pattern_name}. {pattern_description}
2. RICHNESS: Use <SolvedProblem />, <Quiz />, <FeynmanBox />, <PredictOutcome />, <Video id="..." />, and <Glossary /> tags.
3. VISUALS: For every complex concept, include a [FIGURE DESCRIPTION] block or <Figure src="..." />.
4. RIGOR: Full LaTeX derivations for all key formulas.
5. TONE: {style_description}

FORMATTING:
- Use standard Markdown with MDX components.
- Language: {lang}
- Length: {target_length} words.

BLUEPRINT:
{blueprint}
"""

TUTOR_PERSONAS = {
    "Socratic": "Guides via questions, forcing the student to find the answer.",
    "Pragmatic": "Uses analogies, real-world examples, and intuition first.",
    "Academic": "Focuses on proofs, formal definitions, and mathematical rigor."
}
