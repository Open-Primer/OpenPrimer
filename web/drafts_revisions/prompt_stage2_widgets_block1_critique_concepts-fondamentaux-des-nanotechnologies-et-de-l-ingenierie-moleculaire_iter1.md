You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Chimie Générale et Organique",
        "slug": "chimie-generale-organique",
        "level": "L2",
        "subject": "Chimie"
      },
      {
        "title": "Principes de Physique Quantique",
        "slug": "principes-physique-quantique",
        "level": "L2",
        "subject": "Physique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la caractéristique principale qui distingue les nanotechnologies des approches d'ingénierie traditionnelles?",
    "options": [
      "Elles se concentrent sur la manipulation de structures macroscopiques.",
      "Elles s'appuient exclusivement sur la mécanique classique.",
      "Elles impliquent la manipulation de la matière à l'échelle atomique et moléculaire.",
      "Elles utilisent uniquement des matériaux biologiques pour leurs applications."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-nanotechnologies",
    "sectionTitle": "Introduction aux Nanotechnologies"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principes fondamentaux qui régissent le comportement de la matière à l'échelle nanométrique.",
      "Évaluer les différences et les similitudes entre les approches \"top-down\" et \"bottom-up\" en nanotechnologie.",
      "Distinguer les différentes échelles de grandeur et leurs implications en nanotechnologie."
    ],
    "skills": [
      "Créer des schémas conceptuels illustrant les interactions moléculaires à l'échelle nanométrique.",
      "Évaluer la faisabilité de la conception de nanostructures simples pour des applications spécifiques.",
      "Analyser des données expérimentales relatives aux propriétés uniques des matériaux nanostructurés."
    ],
    "attitudes": [
      "Évaluer l'importance éthique et sociétale des avancées en nanotechnologie.",
      "Développer une curiosité critique envers les nouvelles découvertes dans le domaine des nanosciences.",
      "Apprécier la nature interdisciplinaire des nanotechnologies et l'importance de la collaboration scientifique."
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