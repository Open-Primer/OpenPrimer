You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la climatologie",
        "slug": "introduction-climatologie",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géographie physique"
      },
      {
        "title": "Principes de la physique de l'atmosphère",
        "slug": "principes-physique-atmosphere",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Physique"
      },
      {
        "title": "Transferts d'énergie et rayonnement",
        "slug": "transferts-energie-rayonnement",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Physique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est le principal mécanisme par lequel la Terre perd de l'énergie vers l'espace, contribuant ainsi à l'équilibre thermique global?",
    "options": [
      "Absorption du rayonnement solaire par l'atmosphère",
      "Réflexion du rayonnement solaire par les nuages et la surface (albédo)",
      "Émission de rayonnement infrarouge par la surface terrestre et l'atmosphère",
      "Convection de chaleur de la surface vers l'atmosphère supérieure"
    ],
    "correctIndex": 2,
    "targetSectionId": "bilans-energetiques-terrestres",
    "sectionTitle": "Les bilans énergétiques de la Terre"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les mécanismes complexes des bilans énergétiques terrestres.",
      "Évaluer l'impact des variations de la composition atmosphérique sur le climat global.",
      "Concevoir des schémas conceptuels représentant les interactions entre les sous-systèmes climatiques."
    ],
    "skills": [
      "Analyser des données climatiques complexes pour identifier les contributions des différents gaz à effet de serre.",
      "Évaluer la pertinence des modèles climatiques actuels pour prédire les changements futurs des bilans énergétiques.",
      "Élaborer des stratégies de modélisation simplifiées pour simuler des processus atmosphériques clés."
    ],
    "attitudes": [
      "Évaluer de manière critique les sources d'information concernant le changement climatique et ses causes.",
      "Analyser l'importance de la collaboration interdisciplinaire pour aborder les défis climatiques.",
      "Développer une approche proactive face aux enjeux environnementaux liés au système climatique."
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