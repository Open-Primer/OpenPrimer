You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux de la géologie",
        "slug": "principes-fondamentaux-geologie",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géologie"
      },
      {
        "title": "Introduction à la climatologie",
        "slug": "introduction-climatologie",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Climatologie"
      },
      {
        "title": "Épistémologie des sciences",
        "slug": "epistemologie-sciences",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Philosophie des sciences"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle théorie majeure a unifié la compréhension de la dynamique terrestre au 20e siècle, expliquant des phénomènes comme la dérive des continents et l'expansion des fonds océaniques?",
    "options": [
      "La théorie de la dérive des continents",
      "La théorie de la tectonique des plaques",
      "La théorie des cycles de Milankovitch",
      "La théorie de l'isostasie"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-historique",
    "sectionTitle": "Introduction historique aux sciences de la Terre"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les étapes clés de l'évolution des théories géoscientifiques et climatologiques.",
      "Évaluer l'impact des découvertes majeures sur la compréhension actuelle des systèmes Terre-climat.",
      "Formuler une chronologie des paradigmes dominants en sciences de la Terre et du climat."
    ],
    "skills": [
      "Interpréter des documents historiques et scientifiques relatifs au développement des sciences de la Terre et du climat.",
      "Structurer une argumentation sur l'interdépendance entre les avancées technologiques et les découvertes scientifiques en géosciences.",
      "Communiquer oralement et par écrit les concepts fondamentaux et les figures marquantes de l'histoire des sciences de la Terre et du climat."
    ],
    "attitudes": [
      "Apprécier la démarche scientifique et son rôle dans la construction des connaissances en géosciences.",
      "Développer un esprit critique face aux informations scientifiques et historiques concernant l'évolution des sciences.",
      "Adopter une perspective interdisciplinaire pour comprendre la complexité des systèmes Terre-climat."
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