You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théories Classiques des Organisations",
        "slug": "theories-classiques-organisations",
        "level": "Licence 3ème Année",
        "subject": "Sociologie des Organisations"
      },
      {
        "title": "Introduction à la Rationalité en Sciences Sociales",
        "slug": "introduction-rationalite-sciences-sociales",
        "level": "Licence 3ème Année",
        "subject": "Épistémologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale limite des théories classiques des organisations (ex: Taylor, Fayol) que l'approche contingente et la rationalité limitée cherchent à dépasser?",
    "options": [
      "Leur focalisation exclusive sur la motivation financière des employés.",
      "Leur postulat d'une organisation universellement optimale et d'une rationalité parfaite des acteurs.",
      "Leur incapacité à structurer efficacement les grandes entreprises.",
      "Leur manque de considération pour la hiérarchie et l'autorité."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-contingence-rationalite",
    "sectionTitle": "Introduction à l'approche contingente et à la rationalité limitée"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques de l'approche contingente et de la rationalité limitée.",
      "Distinguer les principales contributions des auteurs clés (ex: Mintzberg, Simon, March) à ces approches.",
      "Expliquer l'impact de l'environnement et des facteurs internes sur la structure organisationnelle selon la théorie de la contingence."
    ],
    "skills": [
      "Évaluer la pertinence de l'approche contingente pour diagnostiquer les problèmes organisationnels dans des contextes variés.",
      "Appliquer le concept de rationalité limitée pour interpréter les processus de décision au sein des organisations.",
      "Concevoir des recommandations stratégiques tenant compte des contraintes de rationalité et des facteurs de contingence."
    ],
    "attitudes": [
      "Développer une pensée critique face aux modèles organisationnels universels.",
      "Valoriser la complexité et la diversité des contextes organisationnels dans l'analyse managériale.",
      "Adopter une posture réflexive sur les limites de la rationalité humaine dans la prise de décision stratégique."
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