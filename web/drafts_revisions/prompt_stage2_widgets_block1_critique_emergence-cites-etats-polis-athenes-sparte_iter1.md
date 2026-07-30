You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction aux civilisations antiques",
        "slug": "introduction-civilisations-antiques",
        "level": "secondary_1",
        "subject": "Histoire"
      },
      {
        "title": "Géographie de la Grèce antique",
        "slug": "geographie-grece-antique",
        "level": "secondary_1",
        "subject": "Géographie"
      },
      {
        "title": "Qu'est-ce qu'une cité ?",
        "slug": "quest-ce-quune-cite",
        "level": "secondary_1",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle caractéristique principale définissait une 'polis' dans la Grèce antique ?",
    "options": [
      "Un grand empire dirigé par un empereur.",
      "Une ville-État indépendante avec son propre gouvernement.",
      "Un petit village agricole sans organisation politique.",
      "Une colonie lointaine sans lien avec la Grèce continentale."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-polis",
    "sectionTitle": "Qu'est-ce qu'une Polis ?"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les caractéristiques fondamentales d'une cité-État (polis) dans la Grèce antique.",
      "Identifier les principales différences entre l'organisation politique et sociale d'Athènes et de Sparte.",
      "Expliquer les facteurs qui ont conduit à l'émergence des cités-États en Grèce."
    ],
    "skills": [
      "Comparer les systèmes de gouvernement d'Athènes et de Sparte en utilisant des critères spécifiques.",
      "Analyser l'impact de la géographie sur le développement des cités-États grecques.",
      "Distinguer les rôles des citoyens, des femmes et des esclaves dans les sociétés athénienne et spartiate."
    ],
    "attitudes": [
      "Apprécier la diversité des formes d'organisation politique dans l'Antiquité.",
      "Développer un esprit critique face aux sources historiques décrivant les sociétés antiques.",
      "Respecter l'importance des institutions civiques dans le fonctionnement d'une société."
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