You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à l'histoire",
        "slug": "introduction-histoire",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Histoire"
      },
      {
        "title": "Les grandes périodes de l'histoire",
        "slug": "grandes-periodes-histoire",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Histoire"
      },
      {
        "title": "Méthodologie de l'analyse historique",
        "slug": "methodologie-analyse-historique",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale caractéristique qui distingue l'Histoire contemporaine des autres périodes historiques?",
    "options": [
      "Son étude exclusive des civilisations antiques.",
      "Sa dépendance unique aux sources archéologiques.",
      "Sa proximité avec le présent et l'abondance de sources diverses.",
      "Son focus uniquement sur les événements politiques majeurs."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-histoire-contemporaine",
    "sectionTitle": "Introduction à l'Histoire Contemporaine"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les enjeux méthodologiques de l'étude de l'Histoire contemporaine.",
      "Évaluer les différentes approches historiographiques de la période contemporaine.",
      "Formuler une définition argumentée de l'Histoire contemporaine en tenant compte de ses spécificités."
    ],
    "skills": [
      "Analyser des documents historiques primaires et secondaires relatifs à la période contemporaine.",
      "Évaluer la validité et la fiabilité des sources historiques contemporaines.",
      "Construire une problématique de recherche pertinente sur un sujet d'Histoire contemporaine."
    ],
    "attitudes": [
      "Développer une approche critique face aux récits historiques du temps présent.",
      "Évaluer l'importance de la contextualisation dans l'interprétation des événements contemporains.",
      "Adopter une posture réflexive sur la place de l'historien dans la construction du savoir sur le temps présent."
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