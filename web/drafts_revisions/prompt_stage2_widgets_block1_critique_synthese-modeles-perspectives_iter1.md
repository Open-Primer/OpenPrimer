You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Modèles IS-LM et Mundell-Fleming",
        "slug": "modeles-is-lm-mundell-fleming",
        "level": "Licence 3 / Master 1",
        "subject": "Macroéconomie"
      },
      {
        "title": "Théories de la croissance économique",
        "slug": "theories-croissance-economique",
        "level": "Licence 3 / Master 1",
        "subject": "Macroéconomie"
      },
      {
        "title": "Fondements microéconomiques de la macroéconomie",
        "slug": "fondements-microeconomiques-macroeconomie",
        "level": "Licence 3 / Master 1",
        "subject": "Macroéconomie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale distinction entre les modèles Nouveaux Classiques et les modèles Nouveaux Keynésiens concernant l'ajustement des prix et salaires?",
    "options": [
      "Les Nouveaux Classiques supposent des prix et salaires rigides, tandis que les Nouveaux Keynésiens supposent une flexibilité parfaite.",
      "Les Nouveaux Classiques mettent l'accent sur la flexibilité des prix et salaires, tandis que les Nouveaux Keynésiens intègrent des rigidités nominales.",
      "Les deux approches supposent une flexibilité parfaite des prix et salaires, mais diffèrent sur les anticipations.",
      "Les deux approches supposent des rigidités nominales, mais diffèrent sur le rôle de la politique monétaire."
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-1",
    "sectionTitle": "Rappel des fondements des modèles macroéconomiques"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques et les implications politiques des principaux modèles macroéconomiques (néoclassiques, keynésiens, nouveaux classiques, nouveaux keynésiens).",
      "Évaluer les hypothèses sous-jacentes et les limites des modèles macroéconomiques contemporains.",
      "Créer une compréhension intégrée des interactions entre les différents modèles macroéconomiques."
    ],
    "skills": [
      "Analyser de manière critique les débats actuels en macroéconomie à travers le prisme des modèles étudiés.",
      "Évaluer la pertinence des différents modèles pour l'analyse de situations économiques réelles et la formulation de politiques.",
      "Créer des arguments structurés pour défendre ou critiquer des approches macroéconomiques spécifiques."
    ],
    "attitudes": [
      "Développer une attitude critique et réflexive face aux simplifications et aux hypothèses des modèles économiques.",
      "Évaluer l'importance de l'intégration des différentes perspectives théoriques pour une compréhension holistique de l'économie.",
      "Créer une ouverture d'esprit face aux nouvelles approches et aux défis futurs de la macroéconomie."
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