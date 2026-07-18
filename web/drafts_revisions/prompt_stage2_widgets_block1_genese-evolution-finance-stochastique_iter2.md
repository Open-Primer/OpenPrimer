You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Finance quantitative et modélisation stochastique"
Level: "Master 1st Year (M1)"
Lesson Title: "Genèse et Évolution de la Finance Stochastique"
Language: "FR"

You must define the following JSON properties:
1. "prerequisites": List of 2-3 required concepts/lessons before taking this lesson.
2. "diagnosticQuiz": A single high-quality MCQ diagnostic question to check if the student has the prerequisites.
3. "learningObjectives": Knowledge, skills, and attitudes (3 items each) using Bloom's Taxonomy verbs (Analyze, Evaluate, Create for university level).

Return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "prerequisites": {
    "items": [
      { "title": "string", "slug": "string", "level": "string", "subject": "string" }
    ]
  },
  "diagnosticQuiz": {
    "question": "string",
    "options": ["string"],
    "correctIndex": integer,
    "targetSectionId": "string",
    "sectionTitle": "string"
  },
  "learningObjectives": {
    "knowledge": ["string"],
    "skills": ["string"],
    "attitudes": ["string"]
  }
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.

🚨 PREVIOUS CRITIQUE:
"Some learning objectives using the 'Create' verb do not align with Bloom's Taxonomy's highest cognitive level. The actions described are more akin to 'Understand' or 'Apply' rather than genuinely 'Create'.
Detailed errors:
- Field "learningObjectives": The objectives using 'Créer' (Create) are not correctly formulated according to Bloom's Taxonomy for the 'Create' level (L6). 'Créer une compréhension', 'Créer des liens', and 'Créer une curiosité' do not represent the synthesis of new products or ideas. They should be rephrased to genuinely reflect a 'Create' level objective (e.g., 'Développer un nouveau modèle', 'Concevoir une stratégie') or use a more appropriate lower-level verb."
Please fix these issues and regenerate.