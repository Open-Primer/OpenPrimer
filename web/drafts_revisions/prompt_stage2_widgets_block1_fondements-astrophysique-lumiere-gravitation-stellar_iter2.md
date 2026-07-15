You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "Introduction à l'astrophysique et à la cosmologie moderne"
Level: "University Year 2 / Bachelor 2nd Year (L2)"
Lesson Title: "Fondements de l'Astrophysique : Lumière, Gravitation et Évolution Stellaire"
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
"The block lacks thematic coherence. The diagnostic quiz focuses specifically on light and the electromagnetic spectrum, while the learning objectives cover a broader range of topics including gravitation and, predominantly, astrophysics and stellar evolution. This makes the block feel disjointed and unfocused.
Detailed errors:
- Field "learningObjectives": While the verbs used in the learning objectives are appropriate for Bloom's Taxonomy, the content of the objectives is too broad and disparate. They jump between fundamental concepts of light, universal gravitation, and detailed stellar evolution, which makes the block lack a clear, unified thematic focus. Please narrow down the scope of the learning objectives to a more specific and coherent topic."
Please fix these issues and regenerate.