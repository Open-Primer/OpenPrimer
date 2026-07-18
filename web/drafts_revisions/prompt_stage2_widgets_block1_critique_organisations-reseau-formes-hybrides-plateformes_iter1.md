You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théories des organisations",
        "slug": "theories-organisations",
        "level": "Master 1",
        "subject": "Sociologie des organisations"
      },
      {
        "title": "Management stratégique",
        "slug": "management-strategique",
        "level": "Master 1",
        "subject": "Management"
      },
      {
        "title": "Économie numérique et plateformes",
        "slug": "economie-numerique-plateformes",
        "level": "Master 1",
        "subject": "Économie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale caractéristique d'une organisation en réseau par rapport à une organisation hiérarchique traditionnelle?",
    "options": [
      "Une structure de commandement rigide et centralisée.",
      "Des relations décentralisées et une coordination basée sur la collaboration.",
      "Une focalisation exclusive sur la production de biens matériels.",
      "L'absence totale de toute forme de hiérarchie."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction",
    "sectionTitle": "Introduction au cours"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les différentes formes d'organisations en réseau et leurs spécificités structurelles.",
      "Évaluer l'impact des plateformes numériques sur les modèles d'affaires et les stratégies organisationnelles.",
      "Distinguer les caractéristiques des organisations hybrides et leurs défis de gestion."
    ],
    "skills": [
      "Appliquer des cadres théoriques pour diagnostiquer la nature et le fonctionnement d'une organisation en réseau ou hybride.",
      "Concevoir des stratégies adaptées pour la gestion des partenariats au sein d'écosystèmes de plateformes.",
      "Évaluer la pertinence de différentes structures organisationnelles face aux enjeux de l'économie numérique."
    ],
    "attitudes": [
      "Développer une pensée critique face aux évolutions des formes organisationnelles contemporaines.",
      "Adopter une approche proactive pour anticiper les transformations induites par les plateformes et les réseaux.",
      "Valoriser la collaboration et la flexibilité comme leviers de performance dans les organisations modernes."
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