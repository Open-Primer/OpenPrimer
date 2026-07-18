You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités Avancées",
        "slug": "theorie-probabilites-avancees",
        "level": "Licence 3 / Master 1",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Espaces Mesurables et Intégration de Lebesgue",
        "slug": "espaces-mesurables-integration",
        "level": "Licence 3 / Master 1",
        "subject": "Mathématiques Pures"
      },
      {
        "title": "Introduction aux Chaînes de Markov",
        "slug": "introduction-chaines-markov",
        "level": "Licence 3 / Master 1",
        "subject": "Probabilités et Statistique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la propriété fondamentale qui distingue une martingale d'un processus stochastique général, en tenant compte d'une filtration donnée?",
    "options": [
      "L'espérance conditionnelle de la valeur future du processus, sachant l'information présente, est égale à la valeur présente du processus.",
      "Le processus doit être stationnaire et ergodique.",
      "La variance du processus doit être constante au fil du temps.",
      "Le processus doit être à accroissements indépendants et stationnaires."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-martingales",
    "sectionTitle": "Introduction aux Martingales"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les propriétés fondamentales des processus stochastiques discrets.",
      "Évaluer la pertinence des martingales dans la modélisation des marchés financiers.",
      "Créer des cadres théoriques pour l'étude des temps d'arrêt et des théorèmes de convergence."
    ],
    "skills": [
      "Appliquer les théorèmes de convergence des martingales à des problèmes d'évaluation d'actifs.",
      "Modéliser des phénomènes aléatoires financiers à l'aide de processus stochastiques discrets.",
      "Résoudre des problèmes complexes d'optimisation sous incertitude en utilisant les outils des martingales."
    ],
    "attitudes": [
      "Valoriser la rigueur mathématique et la précision dans l'analyse des modèles stochastiques.",
      "Adopter une approche critique face aux hypothèses et aux limites des modèles de processus stochastiques.",
      "Développer une curiosité intellectuelle pour les applications avancées des processus stochastiques en finance quantitative."
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