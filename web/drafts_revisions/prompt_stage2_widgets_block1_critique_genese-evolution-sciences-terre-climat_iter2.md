You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Géologie",
        "slug": "intro-geologie",
        "level": "L1",
        "subject": "Géosciences"
      },
      {
        "title": "Fondamentaux de la Climatologie",
        "slug": "fondamentaux-climatologie",
        "level": "L2",
        "subject": "Climatologie"
      },
      {
        "title": "Épistémologie des Sciences",
        "slug": "epistemologie-sciences",
        "level": "L2",
        "subject": "Philosophie des Sciences"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle période géologique est caractérisée par l'émergence des premières formes de vie complexes et une diversification rapide des espèces, souvent associée à une augmentation significative de l'oxygène atmosphérique?",
    "options": [
      "Précambrien",
      "Paléozoïque",
      "Mésozoïque",
      "Cénozoïque"
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-contexte-historique",
    "sectionTitle": "Contexte historique et géologique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les grandes étapes de la formation et de l'évolution de la Terre et de son atmosphère.",
      "Évaluer les théories majeures qui ont marqué l'histoire des sciences de la Terre et du climat.",
      "Distinguer les contributions des figures clés dans le développement de la géologie et de la climatologie."
    ],
    "skills": [
      "Évaluer la validité et la pertinence des données historiques et paléoclimatiques.",
      "Analyser l'interdépendance entre les processus géologiques et les changements climatiques à travers les âges.",
      "Créer une chronologie critique des découvertes scientifiques ayant façonné notre compréhension du système Terre."
    ],
    "attitudes": [
      "Évaluer de manière critique les paradigmes scientifiques passés et présents en géosciences et climatologie.",
      "Analyser l'évolution des méthodes scientifiques et leur impact sur la compréhension des phénomènes terrestres.",
      "Formuler une perspective éclairée sur les défis épistémologiques rencontrés par les sciences de la Terre et du climat."
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