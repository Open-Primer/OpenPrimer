You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Macroéconomie intermédiaire",
        "slug": "macroeconomie-intermediaire",
        "level": "Master 1st Year (M1)",
        "subject": "Économie"
      },
      {
        "title": "Modèles dynamiques en économie",
        "slug": "modeles-dynamiques-economie",
        "level": "Master 1st Year (M1)",
        "subject": "Économie"
      },
      {
        "title": "Économétrie des séries temporelles",
        "slug": "econometrie-series-temporelles",
        "level": "Master 1st Year (M1)",
        "subject": "Économétrie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale caractéristique des modèles de cycles économiques réels (RBC) par rapport aux modèles keynésiens traditionnels?",
    "options": [
      "Ils mettent l'accent sur la rigidité des prix et des salaires.",
      "Ils expliquent les fluctuations économiques par des chocs de demande agrégée.",
      "Ils attribuent les fluctuations aux chocs de productivité réels et supposent des marchés parfaitement concurrentiels.",
      "Ils se concentrent sur le rôle de la politique monétaire dans la stabilisation de l'économie."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-rbc",
    "sectionTitle": "Introduction aux modèles de cycles économiques réels"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques des modèles de cycles économiques réels (RBC).",
      "Évaluer l'impact des chocs stochastiques sur les variables macroéconomiques.",
      "Développer une compréhension approfondie des mécanismes de propagation des chocs dans les modèles dynamiques."
    ],
    "skills": [
      "Analyser des données macroéconomiques pour identifier les caractéristiques des cycles réels.",
      "Évaluer la pertinence des modèles RBC pour expliquer les fluctuations économiques observées.",
      "Construire des modèles simples de cycles économiques réels pour simuler des chocs."
    ],
    "attitudes": [
      "Manifester un esprit critique face aux hypothèses des modèles macroéconomiques.",
      "Évaluer l'importance de l'intégration des chocs stochastiques dans l'analyse des politiques économiques.",
      "Développer une approche rigoureuse dans l'interprétation des résultats des simulations de modèles."
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