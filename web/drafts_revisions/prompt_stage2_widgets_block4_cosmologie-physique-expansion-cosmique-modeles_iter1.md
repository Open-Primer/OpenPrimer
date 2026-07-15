You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the final evaluation quiz and reference widgets of the lesson:
Course: "Introduction à l'astrophysique et à la cosmologie moderne"
Level: "University Year 2 / Bachelor 2nd Year (L2)"
Lesson Title: "Cosmologie Physique : De l'Expansion Cosmique aux Modèles de l'Univers"
Language: "FR"
Citation Style: "AIP Style (American Institute of Physics) for physics; ACS Style (American Chemical Society) for chemistry"

You must define the following JSON properties:
1. "finalEvaluation": A lesson-level final quiz. Provide a Quiz containing 5-10 questions covering this lesson.
2. "references": An array of 6 to 8 authoritative academic bibliography entries in the requested citation style.



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