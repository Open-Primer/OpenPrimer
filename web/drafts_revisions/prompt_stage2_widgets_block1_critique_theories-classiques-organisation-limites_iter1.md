You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Sociologie des Organisations",
        "slug": "introduction-sociologie-organisations",
        "level": "Licence 3ème Année",
        "subject": "Sociologie"
      },
      {
        "title": "Fondements du Management",
        "slug": "fondements-management",
        "level": "Licence 2ème Année",
        "subject": "Management"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle théorie classique de l'organisation met l'accent sur la division du travail, la hiérarchie et la rationalisation des tâches pour maximiser l'efficacité ?",
    "options": [
      "La Théorie des Relations Humaines",
      "La Théorie de la Contingence",
      "Le Taylorisme (Organisation Scientifique du Travail)",
      "La Théorie des Systèmes"
    ],
    "correctIndex": 2,
    "targetSectionId": "section-theories-classiques-taylorisme",
    "sectionTitle": "Le Taylorisme et l'Organisation Scientifique du Travail"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principes fondamentaux des théories classiques de l'organisation (Taylor, Fayol, Weber).",
      "Distinguer les contributions spécifiques de chaque auteur majeur aux théories classiques.",
      "Évaluer l'impact historique et contemporain des théories classiques sur la gestion des organisations."
    ],
    "skills": [
      "Appliquer les concepts des théories classiques pour diagnostiquer des situations organisationnelles simples.",
      "Critiquer les limites et les critiques adressées aux modèles organisationnels classiques.",
      "Concevoir des arguments pour ou contre l'application de principes classiques dans des contextes managériaux actuels."
    ],
    "attitudes": [
      "Développer une approche critique envers les modèles organisationnels préétablis.",
      "Valoriser la rigueur intellectuelle dans l'analyse des phénomènes organisationnels.",
      "Adopter une perspective historique pour comprendre l'évolution des pratiques managériales."
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