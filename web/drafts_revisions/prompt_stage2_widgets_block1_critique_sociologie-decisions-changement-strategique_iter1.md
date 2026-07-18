You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théories des organisations",
        "slug": "theories-organisations",
        "level": "Master 1st Year (M1)",
        "subject": "Sociologie des organisations"
      },
      {
        "title": "Fondamentaux du management stratégique",
        "slug": "fondamentaux-management-strategique",
        "level": "Master 1st Year (M1)",
        "subject": "Management stratégique"
      },
      {
        "title": "Analyse sociologique des phénomènes sociaux",
        "slug": "analyse-sociologique-phenomenes-sociaux",
        "level": "Licence 3rd Year (L3)",
        "subject": "Sociologie générale"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon la perspective sociologique des organisations, quelle est la principale critique adressée aux modèles de décision purement rationnels ?",
    "options": [
      "Ils négligent l'influence des facteurs émotionnels individuels.",
      "Ils sous-estiment le rôle des jeux de pouvoir et des intérêts divergents au sein de l'organisation.",
      "Ils ne prennent pas en compte la complexité des environnements externes.",
      "Ils surestiment la capacité des dirigeants à anticiper l'avenir."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-theories-decision-organisationnelle",
    "sectionTitle": "Introduction aux théories de la décision organisationnelle"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les différentes approches sociologiques de la décision organisationnelle.",
      "Évaluer l'impact des facteurs sociaux et culturels sur les processus de changement stratégique.",
      "Distinguer les modèles de rationalité limitée et leurs implications pour la gestion."
    ],
    "skills": [
      "Appliquer les grilles d'analyse sociologique pour décrypter des situations de décision complexes.",
      "Concevoir des stratégies d'accompagnement du changement en tenant compte des dynamiques de pouvoir.",
      "Critiquer les approches managériales classiques à la lumière des théories sociologiques."
    ],
    "attitudes": [
      "Développer une posture réflexive face aux processus de décision et de changement.",
      "Adopter une approche critique et nuancée des discours managériaux dominants.",
      "Valoriser la diversité des perspectives et des intérêts dans l'analyse des organisations."
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