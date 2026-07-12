You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Chimie générale et inorganique",
        "slug": "chimie-generale-inorganique",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Chimie"
      },
      {
        "title": "Bases de la physique quantique",
        "slug": "bases-physique-quantique",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Physique"
      },
      {
        "title": "Introduction à la science des matériaux",
        "slug": "introduction-science-materiaux",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Science des Matériaux"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale raison pour laquelle les matériaux à l'échelle nanométrique présentent souvent des propriétés radicalement différentes de celles de leurs homologues macroscopiques?",
    "options": [
      "Leur masse atomique est significativement réduite.",
      "Leur structure cristalline est toujours amorphe.",
      "Le rapport surface/volume est extrêmement élevé et les effets quantiques deviennent prédominants.",
      "Ils sont uniquement composés d'éléments légers."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-aux-effets-de-taille",
    "sectionTitle": "Introduction aux effets de taille et aux propriétés émergentes"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principes fondamentaux qui régissent le comportement de la matière à l'échelle nanométrique.",
      "Évaluer l'impact des effets quantiques et des forces intermoléculaires sur les propriétés des nanomatériaux.",
      "Concevoir des schémas conceptuels pour illustrer les mécanismes d'auto-assemblage moléculaire."
    ],
    "skills": [
      "Analyser des données expérimentales issues de techniques de caractérisation nanométrique.",
      "Évaluer la pertinence et les limites des différentes approches de fabrication de nanostructures.",
      "Développer des stratégies pour la conception de systèmes moléculaires fonctionnels."
    ],
    "attitudes": [
      "Apprécier la complexité et l'interdisciplinarité des défis en nanotechnologie et ingénierie moléculaire.",
      "Évaluer de manière critique les implications éthiques et sociétales des avancées nanotechnologiques.",
      "Adopter une posture proactive dans l'exploration de nouvelles applications et recherches en nanosciences."
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