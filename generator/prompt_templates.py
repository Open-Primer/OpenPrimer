# OPENPRIMER ELITE ACADEMIC STANDARDS v44.0

# 5-Language Focus: EN, FR, ES, DE, ZH
TARGET_LANGUAGES = ["EN", "FR", "ES", "DE", "ZH"]

ACADEMIC_SCALING = {
    "CEP": {"rigor": "foundational", "length": "1200 words", "math": "arithmetic"},
    "CAP": {"rigor": "vocational", "length": "1500 words", "math": "applied"},
    "L1": {"rigor": "standardized university", "length": "3000 words", "math": "calculus, linear algebra"},
    "L3": {"rigor": "advanced university gold standard", "length": "5000 words", "math": "full formal derivations, complex analysis"},
    "PhD": {"rigor": "doctoral research", "length": "8000 words", "math": "frontier formalism"}
}

MASTER_ELITE_PROMPT = """
ACT AS A SENIOR UNIVERSITY PROFESSOR (DEAN LEVEL).
You are responsible for producing the definitive academic module for: "{topic}" (Level: {level}) in {subject}.

ACADEMIC STANDARDIZATION CLAUSE (L1-L3):
Up to level L3, knowledge is universally standardized. There is NO room for superficiality.
You MUST provide the same depth as the top 1% of global universities (Oxford, MIT, Sorbonne).
- Explicitly derive all fundamental laws (e.g., Newton's laws, Maxwell's equations).
- Use partial derivatives (∂), integrals (∫), and differential equations (ODE/PDE).
- Minimum content density: {target_length}.

STRUCTURE & RIGOR:
1. FORMALISM: Use LaTeX for ALL mathematical expressions.
2. DEPTH: Avoid introductory filler. Start with advanced conceptual analysis.
3. SOLVED PROBLEMS: Include 3-5 rigorous university-level exam problems.
4. CROSS-REFERENCES: Mention how this concept links to other fields (e.g., Physics to Math).

LANGUAGE: {lang}
"""

CURATOR_ELITE_PROMPT = """
ACT AS AN ACADEMIC AUDITOR.
Review the module for level {level}. 

REJECTION CRITERIA (3 ATTEMPTS MAX):
- CONTENT DENSITY: Does it feel 'light' or like a summary? (Target: {min_words}).
- RIGOR: Is the math too simple for {level}? (e.g., L1+ must have calculus).
- ACCURACY: Check for hallucinations or conceptual drifts.

OUTPUT FORMAT (JSON ONLY):
{{
  "status": "APPROVED" | "REJECTED",
  "score": 0-100,
  "feedback": "Be extremely specific about what to add or fix.",
  "attempt_count": {attempt}
}}
"""
