You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Microéconomie Avancée",
        "slug": "microeconomie-avancee",
        "level": "Licence 3ème Année (L3)",
        "subject": "Économie"
      },
      {
        "title": "Macroéconomie Dynamique",
        "slug": "macroeconomie-dynamique",
        "level": "Master 1st Year (M1)",
        "subject": "Économie"
      },
      {
        "title": "Économétrie des Séries Temporelles",
        "slug": "econometrie-series-temporelles",
        "level": "Master 1st Year (M1)",
        "subject": "Économétrie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel concept est fondamental pour la construction des modèles DSGE et permet de dériver le comportement des agents économiques à partir de principes d'optimisation?",
    "options": [
      "L'hypothèse des anticipations adaptatives",
      "La microfondation des comportements",
      "La théorie quantitative de la monnaie",
      "Le multiplicateur keynésien"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-microfondations",
    "sectionTitle": "Introduction aux Microfondations des Modèles DSGE"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les composantes essentielles et la structure générale d'un modèle DSGE.",
      "Évaluer les implications des hypothèses d'anticipations rationnelles et d'optimisation intertemporelle sur le comportement des agents.",
      "Distinguer les différentes approches de modélisation des chocs stochastiques dans les modèles DSGE."
    ],
    "skills": [
      "Appliquer les techniques de résolution d'optimisation dynamique (e.g., lagrangien, programmation dynamique) aux problèmes des ménages et des firmes.",
      "Interpréter les équations d'équilibre général d'un modèle DSGE simple.",
      "Construire un cadre conceptuel pour l'intégration de nouvelles caractéristiques (e.g., rigidités nominales) dans un modèle DSGE de base."
    ],
    "attitudes": [
      "Valoriser la démarche scientifique et la rigueur mathématique inhérentes à la construction des modèles DSGE.",
      "S'engager dans une réflexion critique sur la capacité des modèles DSGE à représenter fidèlement la réalité économique.",
      "Apprécier la contribution des modèles DSGE à l'élaboration et à l'évaluation des politiques macroéconomiques."
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