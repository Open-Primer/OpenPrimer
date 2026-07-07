You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux de la physique de l'atmosphère",
        "slug": "principes-physique-atmosphere",
        "level": "L2",
        "subject": "Climatologie"
      },
      {
        "title": "Introduction à la météorologie et au climat",
        "slug": "introduction-meteorologie-climat",
        "level": "L1",
        "subject": "Climatologie"
      },
      {
        "title": "Géographie physique générale",
        "slug": "geographie-physique-generale",
        "level": "L1",
        "subject": "Géographie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est le principal mécanisme par lequel la Terre perd de l'énergie vers l'espace, contribuant ainsi à son bilan énergétique?",
    "options": [
      "Absorption du rayonnement solaire",
      "Réflexion du rayonnement solaire",
      "Émission de rayonnement infrarouge terrestre",
      "Convection atmosphérique"
    ],
    "correctIndex": 2,
    "targetSectionId": "section-bilan-energetique",
    "sectionTitle": "Le bilan énergétique terrestre"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les composantes du bilan énergétique terrestre et leurs interactions.",
      "Évaluer l'impact des gaz à effet de serre sur la composition atmosphérique et le forçage radiatif.",
      "Créer des schémas conceptuels illustrant les cycles biogéochimiques majeurs liés au système climatique."
    ],
    "skills": [
      "Analyser des données climatiques pour identifier les tendances et les anomalies du bilan énergétique.",
      "Évaluer la pertinence de différents modèles climatiques pour simuler les changements de composition atmosphérique.",
      "Créer des arguments étayés sur les mécanismes de régulation du climat basés sur les bilans énergétiques."
    ],
    "attitudes": [
      "Développer une pensée critique face aux informations sur les changements climatiques et leurs causes.",
      "Adopter une approche rigoureuse dans l'interprétation des données scientifiques relatives au système climatique.",
      "Reconnaître l'interdépendance des processus physiques et chimiques dans la dynamique du système terrestre."
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