You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Fondements de la sociologie des organisations",
        "slug": "fondements-sociologie-organisations",
        "level": "Licence 3",
        "subject": "Sociologie"
      },
      {
        "title": "Principes du management stratégique",
        "slug": "principes-management-strategique",
        "level": "Licence 3",
        "subject": "Management"
      },
      {
        "title": "Théories des organisations",
        "slug": "theories-organisations",
        "level": "Licence 3",
        "subject": "Sociologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon les principes fondamentaux de la sociologie des organisations, quel est le rôle principal de l'apprentissage organisationnel dans le processus d'innovation continue?",
    "options": [
      "Réduire les coûts de production par l'optimisation des ressources existantes.",
      "Assurer la conformité réglementaire et la stabilité des processus internes.",
      "Intégrer de nouvelles connaissances et adapter les routines organisationnelles pour favoriser l'amélioration et la création de valeur.",
      "Centraliser la prise de décision pour une meilleure réactivité face aux changements du marché."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-innovation-apprentissage",
    "sectionTitle": "Introduction à l'innovation et à l'apprentissage organisationnel"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les différentes formes d'innovation et leurs implications pour la structure organisationnelle.",
      "Évaluer l'impact des systèmes de gestion des connaissances sur les dynamiques d'apprentissage organisationnel.",
      "Synthétiser les théories de l'apprentissage organisationnel pour expliquer l'adaptation stratégique des entreprises."
    ],
    "skills": [
      "Développer des approches pour stimuler une culture d'innovation au sein d'une organisation.",
      "Évaluer de manière critique des études de cas d'échecs et de succès en matière d'apprentissage organisationnel.",
      "Concevoir des initiatives de partage des connaissances adaptées aux besoins spécifiques d'une organisation."
    ],
    "attitudes": [
      "Apprécier la complexité de la gestion de l'innovation et des connaissances dans des environnements dynamiques.",
      "Valoriser l'importance de l'apprentissage continu et de l'adaptation pour la résilience organisationnelle.",
      "S'engager à considérer les dimensions éthiques dans l'implémentation de nouvelles technologies et pratiques de gestion des connaissances."
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