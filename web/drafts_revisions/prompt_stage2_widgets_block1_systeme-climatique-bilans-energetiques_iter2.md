You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Géographie physique et climatologie"
Level: "University Year 3 / Bachelor 3rd Year (L3)"
Lesson Title: "Le système climatique terrestre: bilans énergétiques et composition atmosphérique"
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
"The learning objectives in the 'attitudes' section do not consistently use higher-order Bloom's Taxonomy verbs such as 'Analyze', 'Evaluate', or 'Create'. Verbs like 'Développer', 'Adopter', and 'Reconnaître' are either not direct Bloom's verbs or represent lower cognitive levels than expected for advanced learning objectives.
Detailed errors:
- Field "learningObjectives": The 'attitudes' section contains verbs that do not align with the specified higher-order Bloom's Taxonomy levels (Analyze, Evaluate, Create). Specifically, 'Développer', 'Adopter', and 'Reconnaître' should be revised to reflect more advanced cognitive processes."
Please fix these issues and regenerate.