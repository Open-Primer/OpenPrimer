You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
We need to repair specific component keys of the generated widgets JSON for the lesson "Des mythes aux télescopes : L'éveil de la cosmologie" that were rejected by the Widgets Critic (Agent 4B).

⚠️ CRITICAL REMINDER FOR MDX COMPLIANCE:
- Do NOT use raw javascript arrow functions, backticks (`), or complex unescaped double quotes inside interactive component properties (such as "props").
- Keep MCQ options as simple, plain text strings. Never place markdown list items (- or *) or HTML tags inside of quiz "options" or "question" strings.

CONTEXT:
Course: "Introduction à l'astrophysique et à la cosmologie" | Level: "University Year 1 / Bachelor 1st Year (L1)" | Language: "FR"

REJECTED WIDGETS DATA:

--- REJECTED WIDGET 1 ---
Key: "finalEvaluation"
Critique from Agent 4B:
  "The 'finalEvaluation' quiz contains only one question focusing on Nicolas Copernic. For a lesson covering the evolution of cosmology from myths to Newton, the final evaluation must comprehensively assess understanding across all major topics discussed, not just a single historical figure. Please add more questions to cover the entire scope of the lesson."
Current JSON Value:
{
  "type": "Quiz",
  "props": {
    "durationLimit": 1800,
    "questions": [
      {
        "q": "Quel est l'apport majeur de Nicolas Copernic à l'évolution de la cosmologie ?",
        "explanation": "Nicolas Copernic a révolutionné la cosmologie en proposant un modèle héliocentrique, plaçant le Soleil au centre du système solaire et reléguant la Terre au rang de simple planète orbitant autour de lui. Ce modèle a jeté les bases de la science moderne, bien qu'il ait initialement rencontré une forte résistance.",
        "options": [
          {
            "text": "Il a prouvé que la Terre est plate et entourée d'un océan cosmique.",
            "correct": false
          },
          {
            "text": "Il a développé le modèle géocentrique avec des épicycles pour expliquer le mouvement des planètes.",
            "correct": false
          },
          {
            "text": "Il a proposé un modèle héliocentrique où la Terre et les autres planètes tournent autour du Soleil.",
            "correct": true
          },
          {
            "text": "Il a formulé les lois de la gravitation universelle pour décrire les mouvements célestes.",
            "correct": false
          }
        ]
      }
    ]
  }
}
----------------------------------


--- REJECTED WIDGET 2 ---
Key: "references"
Critique from Agent 4B:
  "The inline citation [1] in the narrative refers to ancient Mesopotamian cosmogonies, but 'references[0]' is a modern book on black holes and dark energy by Luminet. This is a semantic mismatch. Additionally, the inline citation [4] for Newton's *Principia Mathematica* points to 'references[3]', which is a popular science book by Stephen Hawking. While relevant, it is not an authoritative source for direct citation of Newton's foundational work in an academic context. Please ensure all inline citations map to appropriate and authoritative academic sources in the 'references' array."
Current JSON Value:
[
  "Luminet, Jean-Pierre. \"Le destin de l'univers: Trous noirs et énergie sombre.\" Fayard, 2006.",
  "Lachièze-Rey, Marc. \"Cosmologie.\" Dunod, 2013.",
  "Carroll, Bradley W., and Dale A. Ostlie. \"An Introduction to Modern Astrophysics.\" Cambridge University Press, 2017.",
  "Hawking, Stephen. \"Une brève histoire du temps: Du Big Bang aux trous noirs.\" Flammarion, 1989."
]
----------------------------------


INSTRUCTIONS:
1. Repair each rejected widget key to fully resolve its critique.
2. Return a SINGLE JSON object containing ONLY the repaired keys as its top-level properties (or for "interactiveComponents", return the repaired component object).
3. Format of output JSON:
   For top-level keys like "diagnosticQuiz", the output JSON should have:
   {
     "diagnosticQuiz": { ... repaired object ... }
   }
   For "interactiveComponents:compId" keys, return the repaired component object under the component's key, like:
   {
     "interactiveComponents:compId": { ... repaired component object, including id, componentType, sectionAnchor, props, etc. ... }
   }

Do NOT wrap your JSON response in markdown code blocks (```json or ```).