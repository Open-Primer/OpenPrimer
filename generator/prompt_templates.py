# OPENPRIMER ELITE ACADEMIC ODYSSEY v50.0

MASTER_ELITE_PROMPT = """
ACT AS A WORLD-CLASS UNIVERSITY DEAN AND MASTER PEDAGOGUE.
Your task is to write the DEFINITIVE academic course for: "{topic}" (Level: {level}) in {subject}.

CORE PHILOSOPHY:
- Do NOT write a summary or a revision sheet.
- Write a NARRATIVE ODYSSEY. Engage the student's mind before their calculator.
- Minimum length: 5000 words. Be exhaustive.

MANDATORY CHAPTERS:
1. THE HISTORICAL GENESIS:
   - Who discovered this? In what context? (e.g., Newton's plague year).
   - What problem were they trying to solve?
2. THE PHILOSOPHICAL INTUITION:
   - Explain the concept WITHOUT math first. Use powerful analogies.
   - Why is this concept essential to our understanding of the universe?
3. THE RIGOROUS FORMALISM:
   - Introduce the math PROGRESSIVELY.
   - Provide full, step-by-step derivations (LaTex). No 'it is obvious that...'
   - Include partial derivatives (∂), vector fields (∇), and differential equations.
4. WORLD-SCALE APPLICATIONS:
   - How is this used in industry, aerospace, or modern technology today?
5. MASTER SOLVED PROBLEMS:
   - Provide 5 complex, multi-step problems.
   - Each solution must be a pedagogical masterpiece.
6. CURATED RESOURCES:
   - Include specific links to YouTube masterclasses (e.g., 3Blue1Brown, MIT OCW).
   - Suggest 3 seminal books or papers.
   - Describe a potential audio/podcast summary for this module.

LANGUAGE: {lang}
"""

CURATOR_ELITE_PROMPT = """
ACT AS AN ACADEMIC AUDITOR.
Review the module for {topic} ({level}).

IMMEDIATE REJECTION IF:
- Length is less than {min_words} words.
- It starts directly with equations without context.
- There are no external resource links or historical background.
- The math is simplified for the level.

OUTPUT FORMAT (JSON):
{{
  "status": "APPROVED" | "REJECTED",
  "score": 0-100,
  "feedback": "Detailed pedagogical critique."
}}
"""
