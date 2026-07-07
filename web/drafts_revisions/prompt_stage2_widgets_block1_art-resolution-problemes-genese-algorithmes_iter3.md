You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Algorithmique fondamentale"
Level: "University Year 1 / Bachelor 1st Year (L1)"
Lesson Title: "L'art de la résolution de problèmes: Genèse et rôle des algorithmes"
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
"The learning objectives for 'skills' use verbs that are too advanced for an introductory module. 'Élaborer' (Elaborate/Develop) and 'Proposer' (Propose/Design) align more with higher-order thinking skills like 'Create' in Bloom's Taxonomy, which are typically expected at more advanced levels (L3/Master) rather than an introductory course. For an introductory module, verbs like 'Illustrer' (Illustrate), 'Construire' (Construct simple), or 'Utiliser' (Use) would be more appropriate to reflect foundational application skills.
Detailed errors:
- Field "learningObjectives": The 'skills' section contains verbs ('Élaborer', 'Proposer') that are too high on Bloom's Taxonomy (closer to 'Create') for an introductory module. Consider rephrasing these objectives with verbs that reflect foundational application or understanding, such as 'Illustrer', 'Construire des représentations simples', or 'Utiliser des outils de représentation'."
Please fix these issues and regenerate.