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
        "title": "Les cités-États grecques : Athènes et Sparte",
        "slug": "cites-etats-grecques-athenes-sparte",
        "level": "secondary_1",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelles étaient les deux cités-États grecques les plus puissantes, souvent en rivalité ou en alliance, qui ont dominé la scène politique de la Grèce antique?",
    "options": [
      "Rome et Carthage",
      "Athènes et Sparte",
      "Thèbes et Corinthe",
      "Babylone et Ninive"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-conflits-grecs",
    "sectionTitle": "Introduction aux conflits grecs"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les causes et les conséquences majeures des guerres médiques et du Péloponnèse.",
      "Identifier les principaux acteurs et les événements clés qui ont marqué les périodes de conflit en Grèce antique.",
      "Expliquer l'impact des guerres sur l'évolution politique, sociale et culturelle des cités grecques."
    ],
    "skills": [
      "Analyser les stratégies militaires et diplomatiques employées par les cités-États grecques lors des conflits.",
      "Comparer les motivations et les résultats des différentes hégémonies grecques (athénienne, spartiate, thébaine).",
      "Évaluer la fiabilité des sources historiques concernant les guerres et les figures emblématiques de cette période."
    ],
    "attitudes": [
      "Apprécier la complexité des relations inter-cités et les dynamiques de pouvoir dans la Grèce antique.",
      "Développer un esprit critique face aux récits historiques des conflits et à leurs interprétations.",
      "Respecter la diversité des perspectives et des cultures des peuples impliqués dans les guerres de la Grèce antique."
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