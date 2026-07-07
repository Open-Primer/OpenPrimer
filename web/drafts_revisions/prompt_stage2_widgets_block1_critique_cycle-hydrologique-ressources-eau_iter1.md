You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux de la géographie physique",
        "slug": "principes-geographie-physique",
        "level": "L1/L2",
        "subject": "Géographie"
      },
      {
        "title": "Introduction à la climatologie",
        "slug": "introduction-climatologie",
        "level": "L1/L2",
        "subject": "Climatologie"
      },
      {
        "title": "Notions de base en hydrologie",
        "slug": "notions-base-hydrologie",
        "level": "L1/L2",
        "subject": "Hydrologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale source d'énergie qui alimente le cycle hydrologique sur Terre?",
    "options": [
      "L'énergie géothermique",
      "L'énergie solaire",
      "L'énergie éolienne",
      "L'énergie marémotrice"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-cycle-hydrologique",
    "sectionTitle": "Introduction au cycle hydrologique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les composantes et les processus clés du cycle hydrologique global et régional.",
      "Évaluer l'impact des activités anthropiques sur la dynamique du cycle de l'eau.",
      "Formuler des hypothèses sur les interactions entre le climat, l'hydrologie et les écosystèmes aquatiques."
    ],
    "skills": [
      "Interpréter des données hydrologiques (débits, précipitations, niveaux de nappe) pour caractériser un bassin versant.",
      "Évaluer la pertinence de différentes méthodes de gestion des ressources en eau face aux défis environnementaux et socio-économiques.",
      "Concevoir des stratégies d'adaptation aux changements climatiques affectant les ressources en eau à l'échelle locale ou régionale."
    ],
    "attitudes": [
      "Développer une conscience critique des enjeux liés à la rareté et à la qualité de l'eau dans le monde.",
      "Adopter une approche interdisciplinaire pour comprendre la complexité des systèmes hydrologiques et leurs interactions.",
      "Promouvoir des pratiques de gestion durable de l'eau et de conservation des écosystèmes aquatiques."
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