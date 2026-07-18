You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Calcul stochastique",
        "slug": "calcul-stochastique",
        "level": "Master 1",
        "subject": "Mathématiques Financières"
      },
      {
        "title": "Théorie des probabilités avancée",
        "slug": "theorie-probabilites-avancee",
        "level": "Master 1",
        "subject": "Statistiques et Probabilités"
      },
      {
        "title": "Produits dérivés financiers",
        "slug": "produits-derives-financiers",
        "level": "Master 1",
        "subject": "Finance de Marché"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est l'utilité principale du Lemme d'Itô dans le contexte de la modélisation financière stochastique ?",
    "options": [
      "Calculer la valeur actuelle nette d'un projet.",
      "Dériver la dynamique d'une fonction d'un processus stochastique.",
      "Estimer la volatilité historique d'un actif.",
      "Déterminer le prix d'équilibre d'une obligation."
    ],
    "correctIndex": 1,
    "targetSectionId": "calcul-stochastique-rappel",
    "sectionTitle": "Rappel sur le Calcul Stochastique et le Lemme d'Itô"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les hypothèses fondamentales du modèle de Black-Scholes-Merton.",
      "Expliquer la dérivation de l'équation différentielle partielle de Black-Scholes.",
      "Identifier les limites et les extensions du modèle de Black-Scholes-Merton."
    ],
    "skills": [
      "Appliquer la formule de Black-Scholes pour évaluer des options européennes.",
      "Développer des stratégies de couverture delta-neutre en utilisant les Grecs de Black-Scholes.",
      "Évaluer l'impact des paramètres (volatilité, taux d'intérêt) sur le prix des options."
    ],
    "attitudes": [
      "Adopter une approche critique face aux modèles financiers et à leurs hypothèses.",
      "Valoriser la rigueur mathématique dans la modélisation des marchés financiers.",
      "Développer une curiosité pour les applications pratiques et les extensions du modèle de Black-Scholes."
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