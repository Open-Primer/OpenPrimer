You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Macroéconomie avancée et politique économique"
Level: "Master 1st Year (M1)"
Lesson Title: "Cycles économiques réels et chocs stochastiques"
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
"The learning objectives use the verb 'Créer' (Create) in a way that does not align with Bloom's Taxonomy for active learning verbs in the 'knowledge' and 'attitudes' sections. While 'Create' is a valid Bloom's verb, 'Créer une compréhension' and 'Créer une curiosité' describe outcomes or fostering, rather than an action the learner performs. These should be replaced with more appropriate verbs like 'Développer', 'Construire', or 'Manifester' to reflect measurable learning actions.
Detailed errors:
- Field "learningObjectives": In the 'knowledge' section, 'Créer une compréhension approfondie' should be rephrased to use an active verb that the learner performs, such as 'Développer une compréhension approfondie' or 'Construire une compréhension approfondie'. Similarly, in the 'attitudes' section, 'Créer une curiosité pour l'application' should be changed to an active verb like 'Développer une curiosité' or 'Manifester une curiosité' to better fit Bloom's Taxonomy for learning objectives."
Please fix these issues and regenerate.