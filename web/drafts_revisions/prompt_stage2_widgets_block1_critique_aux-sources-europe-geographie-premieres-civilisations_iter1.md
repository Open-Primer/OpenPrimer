You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Lecture de cartes géographiques",
        "slug": "lecture-cartes-geographiques",
        "level": "Middle School",
        "subject": "Géographie"
      },
      {
        "title": "Introduction aux civilisations antiques",
        "slug": "intro-civilisations-antiques",
        "level": "Middle School",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle mer est située à l'est de la Grèce continentale et est bordée par de nombreuses îles grecques?",
    "options": [
      "Mer Adriatique",
      "Mer Égée",
      "Mer Ionienne",
      "Mer Noire"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-geographie",
    "sectionTitle": "Introduction à la géographie de la Grèce"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les principales caractéristiques géographiques de la Grèce antique.",
      "Identifier les premières civilisations égéennes (Minoenne, Mycénienne).",
      "Expliquer l'importance de la mer pour le développement des civilisations égéennes."
    ],
    "skills": [
      "Localiser la Grèce et les principales îles égéennes sur une carte.",
      "Comparer les modes de vie des civilisations minoenne et mycénienne.",
      "Utiliser des sources historiques simples pour extraire des informations sur les premières civilisations."
    ],
    "attitudes": [
      "Apprécier l'influence de la géographie sur le développement des sociétés.",
      "Développer une curiosité pour les civilisations antiques.",
      "Respecter la diversité des cultures et des modes de vie anciens."
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