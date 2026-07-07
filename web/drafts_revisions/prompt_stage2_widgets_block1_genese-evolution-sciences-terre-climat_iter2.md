You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Géographie physique et climatologie"
Level: "University Year 3 / Bachelor 3rd Year (L3)"
Lesson Title: "Genèse et évolution des sciences de la Terre et du climat"
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
"The learning objectives for 'attitudes' do not consistently use strong Bloom's Taxonomy cognitive verbs, as requested. Verbs like 'Apprécier', 'Développer', and 'Adopter' are more aligned with the affective domain or are too general, rather than specific cognitive actions like Analyze, Evaluate, or Create.
Detailed errors:
- Field "learningObjectives": The 'attitudes' section of the learning objectives needs revision. The verbs 'Apprécier', 'Développer', and 'Adopter' are not strong cognitive verbs from Bloom's Taxonomy (e.g., Remember, Understand, Apply, Analyze, Evaluate, Create). Please rephrase these objectives using more precise cognitive action verbs to reflect measurable learning outcomes at the specified academic level."
Please fix these issues and regenerate.