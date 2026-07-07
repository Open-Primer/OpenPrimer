You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Philosophie des sciences et épistémologie"
Level: "University Year 1 / Bachelor 1st Year (L1)"
Lesson Title: "Qu'est-ce que la science ? Le problème de la démarcation"
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
"The prerequisites are realistic and the diagnostic quiz's correct index is accurate. However, the 'knowledge' learning objectives primarily use lower-level Bloom's verbs (Décrire, Identifier, Expliquer). To fully meet the expectation of incorporating higher-order thinking skills (Analyze, Evaluate, Create) across different learning levels, these objectives should be revised to include more analytical, comparative, or evaluative components. For instance, instead of 'Décrire', consider 'Analyser les principales caractéristiques...' or 'Évaluer les enjeux du problème de la démarcation.'"
Please fix these issues and regenerate.