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
"Widget Block 1 rejected.
Detailed errors:
- Field "learningObjectives": The verb "Concevoir" (to design/create) in the "skills" section is generally considered a higher-level cognitive verb (Bloom's Taxonomy: Create) typically associated with L3/Master levels. For an L1 course, it would be more appropriate to use verbs that align with lower cognitive levels such as "Appliquer" (Apply), "Structurer" (Structure), "Élaborer" (Develop), or "Proposer" (Propose) when referring to the initial steps of algorithm design."
Please fix these issues and regenerate.