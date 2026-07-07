You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Climatologie générale",
        "slug": "climatologie-generale",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géographie physique et climatologie"
      },
      {
        "title": "Géomorphologie",
        "slug": "geomorphologie",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géographie physique et climatologie"
      },
      {
        "title": "Hydrologie et Océanographie",
        "slug": "hydrologie-oceanographie",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géographie physique et climatologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale force responsable de la déviation des courants océaniques et des vents à l'échelle planétaire?",
    "options": [
      "La force de Coriolis",
      "La force centrifuge",
      "La gravité",
      "La pression atmosphérique"
    ],
    "correctIndex": 0,
    "targetSectionId": "dynamique-atmospherique-oceanique",
    "sectionTitle": "Dynamique atmosphérique et océanique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les interactions complexes entre les systèmes atmosphériques, hydrologiques et géomorphologiques.",
      "Évaluer les théories et modèles explicatifs des phénomènes climatiques et géophysiques.",
      "Synthétiser les connaissances sur les grands enjeux environnementaux liés à la géographie physique."
    ],
    "skills": [
      "Critiquer et interpréter des données géographiques complexes (climatiques, hydrologiques, géomorphologiques).",
      "Évaluer la pertinence des méthodes d'analyse spatiale appliquées aux problématiques de géographie physique.",
      "Formuler des hypothèses de recherche et concevoir des protocoles d'étude en géographie physique."
    ],
    "attitudes": [
      "Développer une appréciation critique des défis environnementaux contemporains.",
      "Adopter une démarche rigoureuse et éthique dans l'analyse des phénomènes naturels.",
      "Manifester un engagement pour la diffusion des connaissances scientifiques en géographie physique."
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