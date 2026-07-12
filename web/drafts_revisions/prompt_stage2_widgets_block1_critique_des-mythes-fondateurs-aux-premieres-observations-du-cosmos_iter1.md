You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux de la physique classique",
        "slug": "principes-physique-classique",
        "level": "University Year 1",
        "subject": "Physics"
      },
      {
        "title": "Introduction à l'astronomie observationnelle",
        "slug": "intro-astronomie-observationnelle",
        "level": "University Year 1",
        "subject": "Astronomy"
      },
      {
        "title": "Histoire des sciences et de la pensée",
        "slug": "histoire-sciences-pensee",
        "level": "University Year 1",
        "subject": "History"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle avancée majeure a marqué le passage d'une compréhension mythologique du cosmos à une approche basée sur l'observation et la raison dans l'Antiquité ?",
    "options": [
      "L'élaboration de cosmologies géocentriques complexes par les Grecs.",
      "La découverte de la loi de la gravitation universelle.",
      "L'invention du télescope par Galilée.",
      "La croyance en des divinités astrales."
    ],
    "correctIndex": 0,
    "targetSectionId": "section-1-myths-observations",
    "sectionTitle": "Des mythes aux premières observations"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principales cosmogonies mythologiques et leurs fonctions sociales.",
      "Évaluer l'impact des premières observations astronomiques sur la transition de la pensée mythique à la pensée rationnelle.",
      "Distinguer les contributions majeures des civilisations antiques (Égyptiens, Babyloniens, Grecs) à l'astronomie pré-scientifique."
    ],
    "skills": [
      "Comparer et contraster les modèles cosmologiques antiques avec les conceptions modernes.",
      "Évaluer la validité des sources historiques concernant les premières observations célestes.",
      "Construire une chronologie des découvertes astronomiques clés de l'Antiquité."
    ],
    "attitudes": [
      "Apprécier la démarche scientifique comme une évolution progressive de la compréhension du monde.",
      "Développer un esprit critique face aux récits historiques et aux interprétations des phénomènes naturels.",
      "Valoriser l'interconnexion entre l'histoire des sciences, la philosophie et la culture dans la formation de la pensée cosmologique."
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