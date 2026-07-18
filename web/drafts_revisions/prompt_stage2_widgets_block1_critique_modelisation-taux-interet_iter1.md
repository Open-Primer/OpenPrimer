You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Calcul Stochastique",
        "slug": "calcul-stochastique",
        "level": "Master 1",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Probabilités Avancées",
        "slug": "probabilites-avancees",
        "level": "Licence 3",
        "subject": "Mathématiques"
      },
      {
        "title": "Mathématiques Financières Fondamentales",
        "slug": "mathematiques-financieres-fondamentales",
        "level": "Licence 3",
        "subject": "Finance"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle propriété fondamentale caractérise un processus de Wiener (mouvement brownien) utilisé en modélisation stochastique des taux d'intérêt?",
    "options": [
      "Il a des accroissements indépendants et stationnaires.",
      "Sa variance est constante dans le temps.",
      "Il est toujours positif.",
      "Il est déterministe."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-modeles-stochastiques",
    "sectionTitle": "Introduction aux Modèles Stochastiques de Taux"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les hypothèses sous-jacentes aux principaux modèles stochastiques de taux d'intérêt (ex: Vasicek, CIR).",
      "Évaluer la pertinence des différents modèles de taux d'intérêt pour des contextes de marché spécifiques.",
      "Formuler les équations différentielles stochastiques (EDS) décrivant l'évolution des taux d'intérêt dans les modèles classiques."
    ],
    "skills": [
      "Appliquer les techniques de calcul stochastique pour dériver les propriétés des modèles de taux d'intérêt.",
      "Évaluer les méthodes de calibration des modèles de taux d'intérêt à partir de données de marché.",
      "Développer des simulations numériques pour projeter l'évolution future des taux d'intérêt sous différents modèles."
    ],
    "attitudes": [
      "Adopter une approche critique dans l'analyse des limites et des avantages des modèles de taux d'intérêt existants.",
      "Évaluer l'importance de la rigueur mathématique et de la validation empirique dans la modélisation financière.",
      "Développer une curiosité intellectuelle pour les avancées récentes en modélisation stochastique des taux d'intérêt."
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