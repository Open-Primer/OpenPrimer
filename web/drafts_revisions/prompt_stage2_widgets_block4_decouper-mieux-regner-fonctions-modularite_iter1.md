You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the final evaluation quiz and reference widgets of the lesson:
Course: "Algorithmique fondamentale"
Level: "University Year 1 / Bachelor 1st Year (L1)"
Lesson Title: "Découper pour mieux régner: Fonctions et modularité"
Language: "FR"
Citation Style: "Chicago Manual of Style, 17th edition — Author–Date system (general academic fallback)"

You must define the following JSON properties:
1. "finalEvaluation": A lesson-level final quiz. Provide a Quiz containing EXACTLY 8 to 12 questions covering this lesson.
2. "references": An array of EXACTLY 5 to 7 authoritative academic bibliography entries in the requested citation style.

Return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "finalEvaluation": {
    "questions": [
      {
        "question": "string",
        "options": ["string"],
        "correctIndex": integer,
        "explanation": "string"
      }
    ]
  },
  "references": ["string"]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.