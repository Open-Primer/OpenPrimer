You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Finance quantitative et modélisation stochastique"
Level: "Master 1st Year (M1)"
Lesson Title: "Processus Stochastiques Discrets et Martingales"
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
"The verbs used in the 'knowledge' section of the learning objectives are generally too low-level (e.g., 'Expliquer', 'Décrire', 'Identifier') for a Licence 3 / Master level course, which should aim for higher-order thinking skills such as 'Appliquer', 'Analyser', 'Évaluer', or 'Créer' as per Bloom's Taxonomy.
Detailed errors:
- Field "learningObjectives": The verbs used in the 'knowledge' section (e.g., 'Expliquer', 'Décrire', 'Identifier') are more aligned with 'Remembering' or 'Understanding' levels of Bloom's Taxonomy. For a Licence 3 / Master level, these should be replaced with verbs that reflect higher-order thinking skills such as 'Appliquer', 'Analyser', 'Évaluer', or 'Créer'."
Please fix these issues and regenerate.