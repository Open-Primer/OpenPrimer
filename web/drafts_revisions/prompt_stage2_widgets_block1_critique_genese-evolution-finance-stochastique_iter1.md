You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités Avancée",
        "slug": "theorie-probabilites-avancee",
        "level": "Master 1",
        "subject": "Mathématiques"
      },
      {
        "title": "Calcul Stochastique Introduction",
        "slug": "calcul-stochastique-introduction",
        "level": "Master 1",
        "subject": "Mathématiques"
      },
      {
        "title": "Principes Fondamentaux de la Finance",
        "slug": "principes-fondamentaux-finance",
        "level": "Licence 3 / Master 1",
        "subject": "Finance"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la raison principale de l'introduction des modèles stochastiques en finance?",
    "options": [
      "Pour simplifier les calculs financiers complexes.",
      "Pour rendre les marchés financiers plus prévisibles.",
      "Pour capturer l'incertitude et la nature aléatoire des prix des actifs.",
      "Pour éliminer le besoin d'analyse des données historiques."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-modelisation-stochastique",
    "sectionTitle": "Introduction à la Modélisation Stochastique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements historiques et conceptuels de la finance stochastique.",
      "Évaluer les contributions majeures des mathématiciens et économistes à son développement.",
      "Créer une compréhension des paradigmes successifs qui ont marqué l'évolution de la discipline."
    ],
    "skills": [
      "Analyser les principes sous-jacents aux premiers modèles stochastiques (e.g., Black-Scholes).",
      "Évaluer la portée et les limites des approches stochastiques initiales face aux réalités des marchés.",
      "Créer des liens entre les avancées théoriques et les applications pratiques en finance."
    ],
    "attitudes": [
      "Analyser l'importance de la pensée critique face aux modèles financiers.",
      "Évaluer la valeur de l'interdisciplinarité (mathématiques, finance, informatique) dans ce domaine.",
      "Créer une curiosité pour les défis actuels et futurs de la modélisation stochastique."
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