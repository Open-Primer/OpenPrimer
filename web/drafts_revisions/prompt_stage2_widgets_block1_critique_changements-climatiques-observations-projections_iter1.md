You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux de la climatologie",
        "slug": "principes-fondamentaux-climatologie",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Géographie physique et climatologie"
      },
      {
        "title": "Cycles biogéochimiques et systèmes terrestres",
        "slug": "cycles-biogeochimiques-systemes-terrestres",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Sciences de la Terre et de l'Environnement"
      },
      {
        "title": "Méthodes d'analyse des données environnementales",
        "slug": "methodes-analyse-donnees-environnementales",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Méthodologie scientifique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est le principal gaz à effet de serre d'origine anthropique contribuant le plus au réchauffement climatique actuel?",
    "options": [
      "Méthane (CH4)",
      "Dioxyde de carbone (CO2)",
      "Protoxyde d'azote (N2O)",
      "Vapeur d'eau (H2O)"
    ],
    "correctIndex": 1,
    "targetSectionId": "rappel-bases-climatologie",
    "sectionTitle": "Rappel sur les bases de la climatologie"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les données d'observation des changements climatiques passés et présents.",
      "Évaluer les mécanismes physiques et biogéochimiques à l'origine des changements climatiques anthropiques.",
      "Distinguer les différentes méthodes de projection climatique et leurs incertitudes."
    ],
    "skills": [
      "Interpréter les modèles climatiques et leurs scénarios d'émissions pour anticiper les impacts futurs.",
      "Évaluer de manière critique les impacts des changements climatiques sur les systèmes naturels et socio-économiques.",
      "Formuler des arguments basés sur des preuves scientifiques concernant l'urgence et la complexité des défis climatiques."
    ],
    "attitudes": [
      "Développer une conscience critique des enjeux éthiques et sociaux liés aux changements climatiques.",
      "Adopter une approche interdisciplinaire pour comprendre la complexité des systèmes climatiques et leurs interactions.",
      "Reconnaître l'importance de l'action collective et individuelle face aux défis posés par les changements climatiques."
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