You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Grèce antique",
        "slug": "introduction-grece-antique",
        "level": "secondary_1",
        "subject": "Histoire"
      },
      {
        "title": "Les fondements de la société grecque",
        "slug": "fondements-societe-grecque",
        "level": "secondary_1",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle forme d'expression artistique et de rassemblement public était centrale dans la Grèce antique, impliquant souvent des pièces de théâtre et des performances dramatiques?",
    "options": [
      "Les Jeux Olympiques",
      "Le théâtre",
      "Les pyramides",
      "Les aqueducs"
    ],
    "correctIndex": 1,
    "targetSectionId": "section_1_introduction",
    "sectionTitle": "Introduction aux arts et à la pensée grecque"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les principales formes d'art et de pensée en Grèce antique.",
      "Identifier les figures majeures du théâtre, de l'architecture et de la philosophie grecque.",
      "Expliquer l'impact de l'héritage grec sur le monde occidental."
    ],
    "skills": [
      "Distinguer les caractéristiques du théâtre et de l'architecture grecs.",
      "Situer chronologiquement les grandes périodes de l'art et de la pensée grecque.",
      "Formuler des questions sur l'influence de la culture grecque."
    ],
    "attitudes": [
      "Apprécier la valeur universelle des œuvres d'art et des idées grecques.",
      "Développer un intérêt pour l'étude des civilisations anciennes.",
      "Reconnaître l'importance de la pensée critique héritée des philosophes grecs."
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