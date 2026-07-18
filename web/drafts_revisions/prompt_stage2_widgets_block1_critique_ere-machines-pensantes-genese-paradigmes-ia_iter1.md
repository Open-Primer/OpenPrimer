You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à l'Informatique",
        "slug": "introduction-informatique",
        "level": "Licence",
        "subject": "Informatique"
      },
      {
        "title": "Logique et Raisonnement Formel",
        "slug": "logique-raisonnement-formel",
        "level": "Licence",
        "subject": "Mathématiques"
      },
      {
        "title": "Algorithmique Fondamentale",
        "slug": "algorithmique-fondamentale",
        "level": "Licence",
        "subject": "Informatique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel était l'objectif principal de l'Intelligence Artificielle à ses débuts, tel qu'envisagé par ses pionniers?",
    "options": [
      "Automatiser les tâches répétitives pour augmenter la productivité.",
      "Simuler et reproduire les capacités cognitives et le raisonnement humain.",
      "Développer des machines capables de traiter des données à très haute vitesse.",
      "Créer des systèmes experts pour la gestion de bases de données complexes."
    ],
    "correctIndex": 1,
    "targetSectionId": "genese-ia",
    "sectionTitle": "Genèse de l'IA"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les définitions et les approches historiques de l'Intelligence Artificielle.",
      "Évaluer les contributions majeures des pionniers et des écoles de pensée de l'IA.",
      "Distinguer les principaux paradigmes de l'IA (symbolique, connexionniste, etc.) et leurs fondements.",
      "Identifier les étapes clés de l'évolution de l'IA, des débuts à l'ère moderne."
    ],
    "skills": [
      "Appliquer les concepts fondamentaux de l'IA pour caractériser un système intelligent.",
      "Comparer et contraster les avantages et inconvénients des différentes approches de l'IA.",
      "Concevoir une argumentation critique sur l'évolution et les défis éthiques de l'IA.",
      "Évaluer la pertinence d'un paradigme d'IA pour résoudre un problème donné."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle envers les avancées et les limites de l'IA.",
      "Adopter une approche critique face aux discours médiatiques et aux mythes entourant l'IA.",
      "Valoriser l'interdisciplinarité nécessaire à la compréhension globale de l'IA.",
      "Manifester un intérêt pour les implications sociétales et éthiques de l'IA."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).
4. ZERO placeholders, draft markers (e.g. bracketed text like "[insert]"), or template values are allowed. Reject the block if any text or option contains placeholder words like "Option", "placeholder", "todo", "tbd", "tbc", "lorem", "ipsum" or empty strings. All text fields must be fully fleshed out and complete.

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