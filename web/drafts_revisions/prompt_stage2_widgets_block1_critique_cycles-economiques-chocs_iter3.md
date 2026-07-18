You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Macroéconomie intermédiaire",
        "slug": "macroeconomie-intermediaire",
        "level": "Licence 3 (L3)",
        "subject": "Économie"
      },
      {
        "title": "Modèles de croissance endogène",
        "slug": "modeles-croissance-endogene",
        "level": "Master 1 (M1)",
        "subject": "Économie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel concept est fondamental pour comprendre la dynamique des cycles économiques réels (RBC) et les modèles d'équilibre général dynamique?",
    "options": [
      "La rigidité des prix et des salaires",
      "Les anticipations adaptatives",
      "L'optimisation intertemporelle des agents",
      "La politique monétaire discrétionnaire"
    ],
    "correctIndex": 2,
    "targetSectionId": "fondements-eg-dynamique",
    "sectionTitle": "Fondements des modèles d'équilibre général dynamique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques des modèles de cycles économiques réels (RBC).",
      "Synthétiser les mécanismes de propagation des chocs stochastiques dans les modèles RBC.",
      "Évaluer les contributions et les limites des modèles RBC par rapport à d'autres théories des cycles."
    ],
    "skills": [
      "Modéliser des économies dynamiques simples sous l'hypothèse de chocs stochastiques.",
      "Interpréter les résultats de simulations numériques issues de modèles RBC.",
      "Appliquer les outils d'analyse des séries temporelles pour caractériser les cycles économiques."
    ],
    "attitudes": [
      "Justifier la pertinence de l'approche d'équilibre général dynamique pour l'analyse macroéconomique.",
      "Démontrer une pensée critique face aux hypothèses et conclusions des modèles macroéconomiques.",
      "Adopter une démarche rigoureuse dans l'interprétation des données économiques et des résultats de modélisation."
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