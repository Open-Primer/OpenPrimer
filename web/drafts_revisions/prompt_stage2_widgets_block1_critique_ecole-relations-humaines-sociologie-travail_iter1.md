You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Les Théories Classiques des Organisations",
        "slug": "theories-classiques-organisations",
        "level": "Licence 3ème Année",
        "subject": "Sociologie des Organisations"
      },
      {
        "title": "Introduction à la Sociologie des Organisations",
        "slug": "intro-sociologie-organisations",
        "level": "Licence 3ème Année",
        "subject": "Sociologie"
      },
      {
        "title": "Les Fondements de la Psychologie du Travail",
        "slug": "fondements-psychologie-travail",
        "level": "Licence 3ème Année",
        "subject": "Psychologie du Travail"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel auteur est considéré comme le pionnier de l'École des Relations Humaines, mettant en évidence l'importance des facteurs sociaux et psychologiques au travail?",
    "options": [
      "Frederick Taylor",
      "Henri Fayol",
      "Elton Mayo",
      "Max Weber"
    ],
    "correctIndex": 2,
    "targetSectionId": "section_1_1",
    "sectionTitle": "Les origines et les principes de l'École des Relations Humaines"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques et les contributions majeures de l'École des Relations Humaines.",
      "Évaluer l'impact des expériences de Hawthorne sur la compréhension du comportement organisationnel.",
      "Distinguer les apports de la sociologie du travail aux théories des organisations."
    ],
    "skills": [
      "Appliquer les concepts de l'École des Relations Humaines pour analyser des situations de gestion contemporaines.",
      "Évaluer de manière critique les limites et les critiques adressées à l'École des Relations Humaines.",
      "Créer des argumentaires pour justifier l'intégration des dimensions humaines et sociales dans les stratégies managériales."
    ],
    "attitudes": [
      "Développer une approche réflexive sur l'importance des facteurs humains et sociaux dans la performance organisationnelle.",
      "Adopter une posture critique face aux différentes approches de la gestion des ressources humaines.",
      "Valoriser la diversité des perspectives théoriques pour une compréhension holistique des organisations."
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