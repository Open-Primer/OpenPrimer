You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Logique élémentaire",
        "slug": "logique-elementaire",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Mathématiques"
      },
      {
        "title": "Concepts fondamentaux de l'informatique",
        "slug": "concepts-fondamentaux-informatique",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Informatique"
      },
      {
        "title": "Méthodes de résolution de problèmes",
        "slug": "methodes-resolution-problemes",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Compétences transversales"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la première étape essentielle pour résoudre un problème complexe de manière structurée?",
    "options": [
      "Écrire le code",
      "Comprendre le problème",
      "Tester la solution",
      "Choisir un langage de programmation"
    ],
    "correctIndex": 1,
    "targetSectionId": "section-01-rappel-fondamentaux",
    "sectionTitle": "Rappel des fondamentaux de la résolution de problèmes"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire la genèse historique et l'évolution des algorithmes.",
      "Expliquer le rôle central des algorithmes dans la résolution de problèmes informatiques et quotidiens.",
      "Identifier les caractéristiques fondamentales et les propriétés essentielles d'un algorithme bien défini."
    ],
    "skills": [
      "Analyser un problème donné pour en extraire les données pertinentes et les contraintes.",
      "Appliquer une démarche structurée pour décomposer un problème complexe en sous-problèmes gérables.",
      "Concevoir les étapes initiales d'un algorithme simple pour résoudre un problème donné."
    ],
    "attitudes": [
      "Valoriser l'importance de la rigueur, de la logique et de la précision dans la conception algorithmique.",
      "Développer une approche critique et systématique face à la complexité des problèmes à résoudre.",
      "Adopter une curiosité intellectuelle pour l'exploration et l'apprentissage continu des nouvelles méthodes algorithmiques."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).

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