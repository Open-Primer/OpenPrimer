You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "La géographie physique de l'Europe",
        "slug": "geographie-physique-europe",
        "level": "secondary_1",
        "subject": "Histoire-Géographie"
      },
      {
        "title": "Les premières civilisations",
        "slug": "premieres-civilisations",
        "level": "secondary_1",
        "subject": "Histoire"
      },
      {
        "title": "Introduction à l'histoire ancienne",
        "slug": "introduction-histoire-ancienne",
        "level": "secondary_1",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle mer est située à l'est de la Grèce continentale et est essentielle pour comprendre les civilisations égéennes?",
    "options": [
      "Mer Adriatique",
      "Mer Noire",
      "Mer Égée",
      "Mer Ionienne"
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-geographie",
    "sectionTitle": "La géographie de la Grèce antique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser l'impact de la géographie égéenne sur le développement des premières civilisations.",
      "Évaluer l'importance des échanges maritimes pour la prospérité des civilisations minoenne et mycénienne.",
      "Construire une carte conceptuelle illustrant les interconnexions entre les sites géographiques clés et les centres de pouvoir égéens."
    ],
    "skills": [
      "Analyser des documents historiques et cartographiques pour identifier les caractéristiques des civilisations égéennes.",
      "Évaluer la fiabilité de différentes sources d'information concernant les mythes et réalités des civilisations égéennes.",
      "Créer une présentation numérique synthétisant les principales découvertes archéologiques des civilisations minoenne et mycénienne."
    ],
    "attitudes": [
      "Analyser les perspectives culturelles des civilisations égéennes pour comprendre leur vision du monde.",
      "Évaluer l'héritage des civilisations égéennes dans la culture européenne contemporaine.",
      "Formuler des questions de recherche pertinentes sur les aspects méconnus des civilisations égéennes."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).
4. ZERO placeholders, draft markers (e.g. bracketed text like "[insert]"), or template values are allowed. Reject the block if any text or option contains placeholder words like "Option", "placeholder", "todo", "tbd", "tbc", "lorem", "ipsum", "N/A" (or "n/a"), "## Section Name" or empty strings. All text fields must be fully fleshed out and complete.
5. CRITICAL WIDGET CONNECTION: The diagnosticQuiz must be strongly connected to the lesson's topics, containing actual high-quality educational content with specific parameters and a clear explanation of how the question relates to the prerequisites.

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