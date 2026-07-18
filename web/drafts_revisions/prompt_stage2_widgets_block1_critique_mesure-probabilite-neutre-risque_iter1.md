You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités Avancée",
        "slug": "theorie-probabilites-avancee",
        "level": "Master 1st Year",
        "subject": "Probabilités"
      },
      {
        "title": "Processus Stochastiques et Martingales",
        "slug": "processus-stochastiques-martingales",
        "level": "Master 1st Year",
        "subject": "Mathématiques Stochastiques"
      },
      {
        "title": "Modélisation Financière et Arbitrage",
        "slug": "modelisation-financiere-arbitrage",
        "level": "Master 1st Year",
        "subject": "Finance Quantitative"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Dans un marché financier sans opportunité d'arbitrage, quelle est la propriété fondamentale d'une mesure de probabilité équivalente utilisée pour l'évaluation des actifs?",
    "options": [
      "Elle rend tous les processus de prix des actifs des martingales actualisées.",
      "Elle minimise la variance des rendements des actifs.",
      "Elle est toujours égale à la probabilité historique.",
      "Elle garantit que les prix des actifs suivent une distribution normale."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-mesure-neutre-risque",
    "sectionTitle": "Introduction à la Mesure Neutre au Risque"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les conditions d'existence et d'unicité d'une mesure de probabilité neutre au risque dans différents modèles de marché.",
      "Évaluer la relation entre l'absence d'arbitrage et l'existence d'une mesure de probabilité équivalente de martingale.",
      "Distinguer les propriétés d'une mesure de probabilité historique et d'une mesure de probabilité neutre au risque."
    ],
    "skills": [
      "Appliquer le théorème fondamental de l'évaluation des actifs pour valoriser des produits dérivés sous la mesure neutre au risque.",
      "Construire des changements de mesure pour passer d'une probabilité historique à une probabilité neutre au risque.",
      "Développer des modèles stochastiques simples pour illustrer l'utilisation de la mesure neutre au risque dans la tarification."
    ],
    "attitudes": [
      "Apprécier la rigueur mathématique nécessaire à la construction et à l'application des mesures neutres au risque.",
      "Adopter une approche critique face aux hypothèses sous-jacentes aux modèles de tarification basés sur la mesure neutre au risque.",
      "Reconnaître l'importance de la mesure neutre au risque comme outil fondamental en finance quantitative."
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