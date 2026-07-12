You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Principes fondamentaux des nanotechnologies",
        "slug": "principes-fondamentaux-nanotechnologies",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Nanotechnologies"
      },
      {
        "title": "Introduction à l'ingénierie moléculaire",
        "slug": "introduction-ingenierie-moleculaire",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Ingénierie moléculaire"
      },
      {
        "title": "Concepts de base en biomédecine",
        "slug": "concepts-base-biomedecine",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Biologie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est l'avantage principal de l'utilisation des nanomatériaux dans les systèmes de délivrance de médicaments par rapport aux méthodes conventionnelles ?",
    "options": [
      "Augmentation de la solubilité du médicament",
      "Délivrance ciblée et réduction des effets secondaires",
      "Coûts de production réduits",
      "Absorption plus rapide dans l'estomac"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-nanomedecine",
    "sectionTitle": "Introduction aux concepts de la nanomédecine"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principes de fonctionnement des nanorobots médicaux et leurs applications potentielles.",
      "Évaluer les différentes approches des nanotechnologies en diagnostic et thérapie.",
      "Évaluer les implications éthiques et sociétales de la nanorobotique et de l'ingénierie moléculaire."
    ],
    "skills": [
      "Concevoir des stratégies de délivrance de médicaments basées sur les nanotechnologies pour des pathologies spécifiques.",
      "Évaluer la faisabilité et les risques associés aux nouvelles applications nanorobotiques.",
      "Proposer des solutions pour atténuer les dilemmes éthiques posés par les avancées en nanotechnologie médicale."
    ],
    "attitudes": [
      "Développer une approche critique face aux promesses et aux limites des nanotechnologies médicales.",
      "Adopter une posture responsable concernant les implications éthiques de l'ingénierie moléculaire.",
      "Valoriser la collaboration interdisciplinaire pour aborder les défis complexes de la nanomédecine."
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