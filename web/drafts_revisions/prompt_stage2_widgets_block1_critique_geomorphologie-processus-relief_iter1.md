You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Géographie Physique",
        "slug": "introduction-geographie-physique",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géographie Physique"
      },
      {
        "title": "Principes de Géologie Générale",
        "slug": "principes-geologie-generale",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale distinction entre les processus géomorphologiques endogènes et exogènes?",
    "options": [
      "Les processus endogènes sont liés aux forces internes de la Terre, tandis que les processus exogènes sont liés aux forces externes.",
      "Les processus endogènes agissent uniquement sur les roches magmatiques, tandis que les processus exogènes agissent sur toutes les roches.",
      "Les processus endogènes sont toujours destructeurs du relief, tandis que les processus exogènes sont toujours constructeurs.",
      "Les processus endogènes sont rapides et violents, tandis que les processus exogènes sont lents et continus."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-processus-geom",
    "sectionTitle": "Introduction aux processus géomorphologiques"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principaux processus endogènes et exogènes qui façonnent le relief terrestre.",
      "Évaluer l'impact des facteurs climatiques et lithologiques sur la dynamique géomorphologique.",
      "Distinguer les différentes formes de relief résultant de l'interaction entre ces processus."
    ],
    "skills": [
      "Appliquer des méthodes d'analyse spatiale pour cartographier et interpréter les formes de relief.",
      "Élaborer des schémas conceptuels illustrant l'évolution des paysages géomorphologiques.",
      "Critiquer des études de cas de régions spécifiques pour identifier les processus dominants."
    ],
    "attitudes": [
      "Développer une appréciation critique de la complexité et de la dynamique des systèmes géomorphologiques.",
      "Adopter une démarche scientifique rigoureuse dans l'observation et l'interprétation des phénomènes géomorphologiques.",
      "Reconnaître l'importance de la géomorphologie dans la gestion des risques naturels et l'aménagement du territoire."
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