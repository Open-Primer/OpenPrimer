You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Concepts fondamentaux des ondes",
        "slug": "concepts-fondamentaux-ondes",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Physique"
      },
      {
        "title": "Introduction à la physique du son",
        "slug": "introduction-physique-son",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Physique"
      },
      {
        "title": "Histoire des sciences et techniques",
        "slug": "histoire-sciences-techniques",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Parmi les propriétés suivantes d'une onde sonore, laquelle est directement liée à la perception de la hauteur d'un son ?",
    "options": [
      "L'amplitude",
      "La fréquence",
      "La vitesse de propagation",
      "L'intensité"
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-introduction-son",
    "sectionTitle": "Introduction aux concepts fondamentaux du son"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les principales théories historiques sur la nature du son.",
      "Expliquer les concepts physiques fondamentaux qui sous-tendent la production et la propagation du son.",
      "Identifier les figures clés et leurs contributions à la compréhension du son à travers l'histoire."
    ],
    "skills": [
      "Distinguer les différentes approches conceptuelles du son selon les époques historiques.",
      "Interpréter des extraits de textes historiques ou scientifiques relatifs à la perception et à la mesure du son.",
      "Appliquer des principes physiques simples pour analyser des phénomènes sonores élémentaires."
    ],
    "attitudes": [
      "Apprécier la complexité et la richesse de l'évolution des connaissances sur le son.",
      "Développer une curiosité pour les liens entre la physique, l'histoire et la musique.",
      "Valoriser l'approche interdisciplinaire dans l'étude des phénomènes acoustiques."
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