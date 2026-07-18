You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la sociologie des organisations",
        "slug": "introduction-sociologie-organisations",
        "level": "Master 1st Year",
        "subject": "Sociologie des organisations"
      },
      {
        "title": "Théories classiques des organisations",
        "slug": "theories-classiques-organisations",
        "level": "Master 1st Year",
        "subject": "Sociologie des organisations"
      },
      {
        "title": "Concepts fondamentaux du management stratégique",
        "slug": "concepts-fondamentaux-management-strategique",
        "level": "Master 1st Year",
        "subject": "Management stratégique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale différence entre les théories classiques des organisations et les approches institutionnelles concernant la prise de décision organisationnelle ?",
    "options": [
      "Les théories classiques mettent l'accent sur la rationalité économique, tandis que les approches institutionnelles soulignent l'influence des normes et des valeurs.",
      "Les théories classiques se concentrent sur la structure interne, alors que les approches institutionnelles ignorent la structure.",
      "Les théories classiques privilégient l'innovation, alors que les approches institutionnelles favorisent la tradition.",
      "Les théories classiques étudient uniquement les grandes entreprises, tandis que les approches institutionnelles se limitent aux PME."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-theories-neo-institutionnelles",
    "sectionTitle": "Introduction aux Théories Néo-Institutionnelles"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements épistémologiques et les concepts clés des différentes théories néo-institutionnelles (sociologique, économique, cognitive).",
      "Évaluer l'impact des pressions institutionnelles (coercitives, mimétiques, normatives) sur les structures et les pratiques organisationnelles.",
      "Distinguer les différentes formes de légitimité organisationnelle et leurs sources selon les perspectives néo-institutionnelles."
    ],
    "skills": [
      "Appliquer les grilles d'analyse néo-institutionnelles pour décrypter les comportements et les stratégies des organisations contemporaines.",
      "Évaluer la pertinence des stratégies de légitimation adoptées par les organisations face à leur environnement institutionnel.",
      "Concevoir des recommandations stratégiques pour les organisations souhaitant renforcer leur légitimité dans des contextes institutionnels complexes."
    ],
    "attitudes": [
      "Développer une appréciation critique de l'influence des facteurs non-rationnels et socio-culturels sur la prise de décision managériale.",
      "Adopter une perspective réflexive sur le rôle de la légitimité dans la survie et le succès à long terme des organisations.",
      "Valoriser l'intégration des dimensions institutionnelles dans l'analyse et la gestion des défis organisationnels."
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