You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Acoustique physique et acoustique musicale"
Level: "University Year 2 / Bachelor 2nd Year (L2)"
Lesson Title: "Aux origines du son : une exploration historique et conceptuelle"
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
"The learning objectives use Bloom's Taxonomy verbs that are too high-level for an L1 course. Verbs like 'Analyser' (Analyze), 'Évaluer' (Evaluate), and especially 'Synthétiser' (Synthesize/Create) are typically associated with higher academic levels (L2, L3, Master). For an L1 course, objectives should generally focus on 'Remember', 'Understand', and 'Apply'. Please revise the learning objectives to use verbs appropriate for an introductory L1 level.
Detailed errors:
- Field "learningObjectives": The verbs used in the knowledge and skills objectives ('Analyser', 'Évaluer', 'Synthétiser') are too advanced for an L1 level. For L1, focus on foundational understanding and application. For example, instead of 'Analyser', consider 'Décrire' (Describe) or 'Identifier' (Identify). Instead of 'Évaluer', consider 'Expliquer' (Explain) or 'Démontrer' (Demonstrate). 'Synthétiser' should be replaced with a verb like 'Organiser' (Organize) or 'Classer' (Classify) if appropriate for L1."
Please fix these issues and regenerate.