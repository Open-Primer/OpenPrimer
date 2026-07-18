You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Physique des ondes",
        "slug": "physique-des-ondes",
        "level": "L1",
        "subject": "Physique"
      },
      {
        "title": "Introduction à l'acoustique",
        "slug": "introduction-acoustique",
        "level": "L1",
        "subject": "Physique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la nature physique fondamentale du son ?",
    "options": [
      "Une onde électromagnétique",
      "Une onde de pression mécanique",
      "Une particule subatomique",
      "Un champ d'énergie statique"
    ],
    "correctIndex": 1,
    "targetSectionId": "definition-nature-son",
    "sectionTitle": "Définition et nature du son"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les différentes conceptions historiques du son, de l'Antiquité à l'ère moderne.",
      "Évaluer l'impact des découvertes scientifiques majeures sur la compréhension du phénomène sonore.",
      "Distinguer les propriétés physiques fondamentales du son (fréquence, amplitude, célérité) et leurs unités."
    ],
    "skills": [
      "Analyser des documents historiques et scientifiques pour retracer l'évolution des théories acoustiques.",
      "Évaluer la validité et les limites des modèles conceptuels du son développés à différentes époques.",
      "Synthétiser les informations historiques et physiques pour construire une chronologie cohérente de la pensée acoustique."
    ],
    "attitudes": [
      "Développer un esprit critique face aux sources historiques et aux interprétations scientifiques.",
      "Apprécier la démarche scientifique dans la construction progressive du savoir sur le son.",
      "Manifester une ouverture d'esprit envers les différentes approches culturelles et scientifiques du son."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).
4. ZERO placeholders, draft markers (e.g. bracketed text like "[insert]"), or template values are allowed. Reject the block if any text or option contains placeholder words like "Option", "placeholder", "todo", "tbd", "tbc", "lorem", "ipsum" or empty strings. All text fields must be fully fleshed out and complete.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'prerequisites', 'diagnosticQuiz', or 'learningObjectives')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.