You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Algorithmique fondamentale"
Level: "University Year 1 / Bachelor 1st Year (L1)"
Lesson Title: "Les briques élémentaires: Séquences, conditions et boucles"
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
"The diagnostic quiz's 'correctIndex' is incorrect. For the given algorithm, if 'nombre' starts at 7, it becomes 10 after 'nombre = nombre + 3'. The condition 'nombre > 10' (i.e., '10 > 10') is false, leading to the 'Sinon' block executing and displaying 'Petit'. Therefore, the 'correctIndex' should be 1 (for 'Petit'), not 0 (for 'Grand'). The prerequisites are realistic and the learning objectives use appropriate Bloom's Taxonomy verbs."
Please fix these issues and regenerate.