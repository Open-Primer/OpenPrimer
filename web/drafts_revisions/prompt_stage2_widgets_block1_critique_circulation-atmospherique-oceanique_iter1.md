You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Structure et composition de l'atmosphère",
        "slug": "structure-composition-atmosphere",
        "level": "L2",
        "subject": "Climatologie"
      },
      {
        "title": "Force de Coriolis et ses effets",
        "slug": "force-coriolis-effets",
        "level": "L2",
        "subject": "Géographie physique"
      },
      {
        "title": "Principes de transfert de chaleur",
        "slug": "principes-transfert-chaleur",
        "level": "L1",
        "subject": "Physique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale cause de la déviation des vents et des courants océaniques dans l'hémisphère nord vers la droite et dans l'hémisphère sud vers la gauche?",
    "options": [
      "La force centrifuge",
      "La force de gravité",
      "La force de Coriolis",
      "La friction atmosphérique"
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-forces-fondamentales",
    "sectionTitle": "Introduction aux forces fondamentales"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les mécanismes fondamentaux de la circulation atmosphérique globale.",
      "Évaluer l'impact des interactions océan-atmosphère sur les régimes climatiques régionaux.",
      "Distinguer les différents types de courants océaniques et leurs rôles dans la redistribution de la chaleur."
    ],
    "skills": [
      "Interpréter des cartes de pression atmosphérique et de courants océaniques pour déduire les schémas de circulation.",
      "Modéliser les effets de la force de Coriolis sur les mouvements fluides à différentes latitudes.",
      "Élaborer des hypothèses sur les conséquences du changement climatique sur la circulation thermohaline."
    ],
    "attitudes": [
      "Apprécier la complexité et l'interconnexion des systèmes climatiques terrestres.",
      "Développer un esprit critique face aux informations concernant les phénomènes climatiques mondiaux.",
      "S'engager dans une démarche de veille scientifique sur les avancées en climatologie et océanographie."
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