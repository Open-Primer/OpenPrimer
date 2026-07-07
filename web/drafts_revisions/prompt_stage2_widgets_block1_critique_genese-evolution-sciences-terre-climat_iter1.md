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
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle théorie scientifique majeure a révolutionné notre compréhension de la dynamique terrestre au 20e siècle, influençant profondément les études géologiques et climatiques?",
    "options": [
      "La théorie de la relativité générale",
      "La théorie de la tectonique des plaques",
      "La théorie de l'évolution par sélection naturelle",
      "La théorie du Big Bang"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-historique",
    "sectionTitle": "Introduction historique aux sciences de la Terre et du climat"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principales étapes et les figures marquantes de l'évolution des sciences de la Terre et du climat.",
      "Évaluer l'influence des contextes socio-historiques sur le développement des théories géoscientifiques et climatiques.",
      "Distinguer les contributions fondamentales des différentes disciplines (géologie, océanographie, météorologie) à la compréhension globale du système Terre."
    ],
    "skills": [
      "Développer une pensée critique face aux récits historiques des découvertes scientifiques en géosciences.",
      "Appliquer des cadres d'analyse historique pour comprendre la genèse des concepts actuels en climatologie et géologie.",
      "Concevoir des schémas illustrant les interrelations entre les grandes théories des sciences de la Terre et du climat."
    ],
    "attitudes": [
      "Apprécier la démarche scientifique et son évolution dans le temps pour aborder les défis environnementaux contemporains.",
      "Développer une ouverture d'esprit face aux changements de paradigmes scientifiques et à l'incertitude inhérente à la recherche.",
      "Reconnaître l'importance de la collaboration interdisciplinaire dans l'avancement des connaissances sur le système Terre."
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