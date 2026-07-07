You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux de la physique de l'atmosphère",
        "slug": "principes-physique-atmosphere",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géographie physique"
      },
      {
        "title": "Composition et structure de l'atmosphère",
        "slug": "composition-structure-atmosphere",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Climatologie"
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
    "question": "Quel est le principal gaz à effet de serre d'origine anthropique responsable de l'absorption du rayonnement infrarouge terrestre dans l'atmosphère?",
    "options": [
      "Vapeur d'eau (H2O)",
      "Méthane (CH4)",
      "Dioxyde de carbone (CO2)",
      "Protoxyde d'azote (N2O)"
    ],
    "correctIndex": 2,
    "targetSectionId": "composition-atmospherique-gaz-effet-serre",
    "sectionTitle": "Composition atmosphérique et gaz à effet de serre"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les composantes et les flux du bilan énergétique terrestre.",
      "Évaluer l'impact des variations de la composition atmosphérique sur le climat.",
      "Expliquer les principes physiques régissant le transfert radiatif dans l'atmosphère."
    ],
    "skills": [
      "Interpréter des diagrammes de flux énergétiques et des profils atmosphériques.",
      "Appliquer des modèles simplifiés pour estimer l'effet de serre.",
      "Évaluer la pertinence de différentes sources de données sur la composition atmosphérique."
    ],
    "attitudes": [
      "Développer une approche critique face aux informations sur le changement climatique.",
      "Reconnaître la complexité et l'interdépendance des éléments du système climatique.",
      "S'engager dans une réflexion éthique sur les responsabilités individuelles et collectives face aux enjeux climatiques."
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