You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Modèles d'équilibre général dynamique stochastique (DSGE)",
        "slug": "modeles-dsge",
        "level": "Master 1st Year (M1)",
        "subject": "Macroéconomie"
      },
      {
        "title": "Théories de la croissance économique",
        "slug": "theories-croissance-economique",
        "level": "Master 1st Year (M1)",
        "subject": "Macroéconomie"
      },
      {
        "title": "Modèles macroéconomiques dynamiques",
        "slug": "modeles-macroeconomiques-dynamiques",
        "level": "Master 1st Year (M1)",
        "subject": "Macroéconomie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la caractéristique principale des modèles de cycles économiques réels (RBC) concernant l'origine des fluctuations macroéconomiques?",
    "options": [
      "Ils mettent l'accent sur les chocs de demande agrégée.",
      "Ils attribuent les fluctuations principalement aux changements de politique monétaire.",
      "Ils expliquent les fluctuations comme des réponses optimales à des chocs technologiques réels.",
      "Ils se concentrent sur la rigidité des prix et des salaires."
    ],
    "correctIndex": 2,
    "targetSectionId": "recap_dsge_rbc",
    "sectionTitle": "Rappel sur les fondements des modèles DSGE et RBC"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques et les hypothèses clés des modèles de cycles économiques réels (RBC).",
      "Évaluer le rôle et l'impact des chocs stochastiques (notamment technologiques) sur les variables macroéconomiques.",
      "Créer une compréhension approfondie des mécanismes de propagation des chocs dans un cadre d'équilibre général dynamique."
    ],
    "skills": [
      "Analyser des données macroéconomiques pour identifier les caractéristiques stylisées des cycles économiques.",
      "Évaluer la capacité des modèles RBC à reproduire les faits stylisés des cycles économiques observés.",
      "Créer des représentations simplifiées (graphiques ou mathématiques) des effets des chocs réels sur l'économie."
    ],
    "attitudes": [
      "Analyser de manière critique les limites et les extensions possibles des modèles RBC face aux observations empiriques.",
      "Évaluer l'importance d'une approche micro-fondée et d'anticipations rationnelles dans l'étude des fluctuations économiques.",
      "Créer une curiosité pour l'application des modèles de cycles réels à l'analyse des politiques macroéconomiques."
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