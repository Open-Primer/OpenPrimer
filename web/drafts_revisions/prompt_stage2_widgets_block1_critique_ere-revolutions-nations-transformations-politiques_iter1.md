You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Les Lumières et leurs idées politiques",
        "slug": "lumieres-idees-politiques",
        "level": "Universitaire L1",
        "subject": "Histoire"
      },
      {
        "title": "L'Ancien Régime et la société d'ordres",
        "slug": "ancien-regime-societe-ordres",
        "level": "Universitaire L1",
        "subject": "Histoire"
      },
      {
        "title": "Les fondements de la monarchie absolue en France",
        "slug": "fondements-monarchie-absolue-france",
        "level": "Universitaire L1",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel mouvement intellectuel majeur du XVIIIe siècle a le plus fortement remis en question les fondements de la monarchie absolue et de la société d'ordres en Europe?",
    "options": [
      "La Renaissance",
      "La Réforme protestante",
      "Les Lumières",
      "Le Romantisme"
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-causes-revolutions",
    "sectionTitle": "Introduction aux causes des révolutions"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les causes profondes et les déclencheurs des révolutions atlantiques (américaine, française).",
      "Évaluer l'impact des idées des Lumières sur les transformations politiques et sociales de la fin du XVIIIe siècle.",
      "Synthétiser les caractéristiques principales de la naissance des nations et des États-nations modernes."
    ],
    "skills": [
      "Analyser des documents historiques (textes, images, cartes) relatifs à l'ère des révolutions.",
      "Évaluer la pertinence de différentes interprétations historiographiques des événements révolutionnaires.",
      "Construire une argumentation cohérente sur les continuités et ruptures entre l'Ancien Régime et l'ère post-révolutionnaire."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle pour les processus de transformation politique et sociale.",
      "Adopter une approche critique face aux récits simplifiés des révolutions.",
      "Valoriser la complexité et la multiplicité des acteurs et des motivations historiques."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).

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