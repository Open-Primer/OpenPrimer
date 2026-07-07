You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes de base de la thermodynamique",
        "slug": "thermodynamique-base",
        "level": "L2",
        "subject": "Physique"
      },
      {
        "title": "Structure et composition de l'atmosphère",
        "slug": "structure-composition-atmosphere",
        "level": "L1",
        "subject": "Géographie physique"
      },
      {
        "title": "Rayonnement électromagnétique et interactions matière",
        "slug": "rayonnement-electromagnetique",
        "level": "L2",
        "subject": "Physique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est le principal mécanisme par lequel les gaz à effet de serre contribuent au réchauffement de l'atmosphère terrestre?",
    "options": [
      "Absorber le rayonnement solaire direct.",
      "Réfléchir le rayonnement ultraviolet.",
      "Absorber et réémettre le rayonnement infrarouge terrestre.",
      "Augmenter la vitesse des vents atmosphériques."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-bilan-energetique",
    "sectionTitle": "Introduction au bilan énergétique terrestre"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les composantes du bilan énergétique terrestre et leurs interactions.",
      "Évaluer l'impact des gaz à effet de serre sur le système climatique global.",
      "Créer des schémas conceptuels représentant les cycles biogéochimiques majeurs influençant la composition atmosphérique."
    ],
    "skills": [
      "Analyser des données climatiques complexes pour identifier les tendances du bilan radiatif et les anomalies thermiques.",
      "Évaluer la pertinence et les limites de différents modèles climatiques pour simuler les interactions atmosphériques.",
      "Créer des arguments étayés sur les mécanismes de régulation naturelle et anthropique du climat."
    ],
    "attitudes": [
      "Évaluer de manière critique les implications éthiques et sociétales des changements climatiques.",
      "Analyser la complexité des interactions entre les activités humaines et le système climatique pour formuler des jugements éclairés.",
      "Créer des propositions argumentées pour une gestion durable des ressources atmosphériques, en intégrant les dimensions scientifiques et éthiques."
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