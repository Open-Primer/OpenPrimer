You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités Avancées",
        "slug": "theorie-probabilites-avancees",
        "level": "Master 1st Year (M1)",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Concepts Fondamentaux de la Finance de Marché",
        "slug": "concepts-fondamentaux-finance-marche",
        "level": "Master 1st Year (M1)",
        "subject": "Finance"
      },
      {
        "title": "Introduction aux Processus Stochastiques",
        "slug": "introduction-processus-stochastiques",
        "level": "Master 1st Year (M1)",
        "subject": "Mathématiques Appliquées"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel concept mathématique a été fondamental pour le développement initial de la modélisation stochastique en finance, notamment avec le modèle de Black-Scholes?",
    "options": [
      "La théorie des jeux",
      "Le calcul stochastique (Itô)",
      "L'algèbre linéaire",
      "La géométrie différentielle"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-calcul-stochastique",
    "sectionTitle": "Introduction au Calcul Stochastique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les étapes clés de l'évolution historique de la finance stochastique.",
      "Évaluer l'impact des contributions majeures (ex: Bachelier, Black-Scholes, Itô) sur la modélisation financière.",
      "Synthétiser une chronologie critique des paradigmes fondateurs de la finance stochastique."
    ],
    "skills": [
      "Analyser les hypothèses sous-jacentes aux premiers modèles stochastiques en finance.",
      "Évaluer la pertinence des approches historiques de modélisation stochastique face aux défis financiers contemporains.",
      "Concevoir une présentation structurée retraçant l'interconnexion entre les avancées mathématiques et les innovations financières."
    ],
    "attitudes": [
      "Développer une approche critique face aux simplifications historiques des modèles financiers.",
      "Évaluer l'importance de la rigueur historique dans la compréhension des fondements de la finance quantitative.",
      "Cultiver une curiosité intellectuelle pour les racines épistémologiques de la modélisation financière stochastique."
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