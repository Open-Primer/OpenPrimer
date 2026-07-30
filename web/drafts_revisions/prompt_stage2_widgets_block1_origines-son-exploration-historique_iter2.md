You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Acoustique Physique et Acoustique Musicale"
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
"The learning objectives, particularly in the 'skills' section, use Bloom's Taxonomy verbs (Analyze, Evaluate, Create) that are too advanced (L4-L6) for a course with L1 prerequisites. These objectives need to be revised to align with the foundational level indicated by the prerequisites.
Detailed errors:
- Field "learningObjectives": The 'skills' objectives (Analyze, Evaluate, Create) are too high on Bloom's Taxonomy for a course with L1 prerequisites. They should be adjusted to reflect a more foundational level, perhaps focusing on understanding, applying, or basic analysis suitable for L1/L2."
Please fix these issues and regenerate.