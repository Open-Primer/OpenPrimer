You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Sociologie des Organisations",
        "slug": "intro-socio-organisations",
        "level": "Licence 3 / Master 1",
        "subject": "Sociologie"
      },
      {
        "title": "Fondamentaux du Management",
        "slug": "fondamentaux-management",
        "level": "Licence 3 / Master 1",
        "subject": "Management"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel théoricien est principalement associé au concept de la 'bureaucratie' comme forme d'organisation rationnelle et légale-rationnelle, caractérisée par des règles impersonnelles et une hiérarchie claire ?",
    "options": [
      "Henri Fayol",
      "Frederick Taylor",
      "Max Weber",
      "Elton Mayo"
    ],
    "correctIndex": 2,
    "targetSectionId": "section-1-theories-classiques",
    "sectionTitle": "Les Théories Classiques des Organisations"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements épistémologiques et les postulats des grandes écoles de pensée organisationnelle.",
      "Évaluer la pertinence des théories classiques et contemporaines face aux défis organisationnels actuels.",
      "Distinguer les contributions spécifiques des auteurs majeurs à la sociologie des organisations."
    ],
    "skills": [
      "Appliquer les grilles d'analyse issues des différentes théories pour diagnostiquer des situations organisationnelles concrètes.",
      "Critiquer les modèles organisationnels en identifiant leurs forces, leurs faiblesses et leurs limites contextuelles.",
      "Concevoir des argumentaires étayés pour justifier le choix d'une approche théorique pertinente face à un problème managérial."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle pour l'évolution des idées en management et sociologie des organisations.",
      "Adopter une posture réflexive sur l'influence des théories sur les pratiques managériales et leurs conséquences sociales.",
      "Manifester une ouverture d'esprit face à la pluralité des perspectives théoriques pour aborder la complexité des organisations."
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