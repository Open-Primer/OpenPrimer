You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the final evaluation quiz and reference widgets of the lesson:
Course: "Philosophie des sciences et épistémologie"
Level: "University Year 1 / Bachelor 1st Year (L1)"
Lesson Title: "Qu'est-ce que la science ? Le problème de la démarcation"
Language: "FR"
Citation Style: "Chicago Manual of Style, 17th edition — Notes–Bibliography system"

You must define the following JSON properties:
1. "finalEvaluation": A lesson-level final quiz. Provide a Quiz containing 5-10 questions covering this lesson.
2. "references": An array of 3-5 authoritative academic bibliography entries in the requested citation style.

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