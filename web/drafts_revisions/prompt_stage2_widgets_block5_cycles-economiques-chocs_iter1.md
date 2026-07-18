You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the final evaluation quiz and reference widgets of the lesson:
Course: "Macroéconomie avancée et politique économique"
Level: "Master 1st Year (M1)"
Lesson Title: "Cycles économiques réels et chocs stochastiques"
Language: "FR"
Citation Style: "Chicago Manual of Style, 17th edition — Author–Date system (general academic fallback)"

You must define the following JSON properties:
1. "finalEvaluation": An object with a "type" property (value "Quiz"), and a "props" object containing a "durationLimit" (integer, e.g. 1800) and a "questions" array. Provide 5-10 questions covering this lesson. Each question object in the array must contain "q" (the question string), "explanation" (string), and an "options" array. Each option object in the options array must contain "text" (string) and "correct" (boolean, true if correct, false otherwise).
2. "references": An array of 8 to 12 authoritative academic bibliography entries in the requested citation style.



Return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "durationLimit": 1800,
      "questions": [
        {
          "q": "string",
          "explanation": "string",
          "multiple": false,
          "options": [
            {
              "text": "string",
              "correct": boolean
            }
          ]
        }
      ]
    }
  },
  "references": ["string"]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.