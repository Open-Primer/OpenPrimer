You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Modèle de Black-Scholes",
        "slug": "modele-black-scholes",
        "level": "Master 1ère Année (M1)",
        "subject": "Finance Quantitative"
      },
      {
        "title": "Processus Stochastiques",
        "slug": "processus-stochastiques",
        "level": "Master 1ère Année (M1)",
        "subject": "Mathématiques Financières"
      },
      {
        "title": "Calcul Stochastique",
        "slug": "calcul-stochastique",
        "level": "Master 1ère Année (M1)",
        "subject": "Mathématiques Financières"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale limitation du modèle de Black-Scholes que les modèles de volatilité stochastique et de sauts cherchent à adresser?",
    "options": [
      "L'incapacité à valoriser les options exotiques.",
      "L'hypothèse de volatilité constante.",
      "La non-prise en compte des dividendes.",
      "La complexité de son implémentation numérique."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-limites-black-scholes",
    "sectionTitle": "Introduction aux limites du modèle de Black-Scholes"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les hypothèses fondamentales des modèles de volatilité stochastique (e.g., Heston) et de sauts (e.g., Merton).",
      "Évaluer les différences conceptuelles entre la volatilité déterministe et la volatilité stochastique.",
      "Identifier les principaux modèles de volatilité stochastique et de sauts utilisés en finance quantitative."
    ],
    "skills": [
      "Appliquer les techniques de valorisation d'options sous des modèles de volatilité stochastique.",
      "Évaluer la pertinence des modèles de sauts pour capturer les événements extrêmes sur les marchés financiers.",
      "Créer des simulations numériques pour illustrer le comportement des prix d'actifs sous des modèles de volatilité stochastique et de sauts."
    ],
    "attitudes": [
      "Développer une approche critique face aux limites des modèles financiers standards.",
      "Apprécier la complexité et la richesse des phénomènes de marché non capturés par le modèle de Black-Scholes.",
      "Adopter une rigueur méthodologique dans l'évaluation et l'application des modèles stochastiques avancés."
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