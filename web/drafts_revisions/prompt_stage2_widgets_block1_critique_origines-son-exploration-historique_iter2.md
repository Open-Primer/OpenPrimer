You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la physique des ondes",
        "slug": "introduction-physique-ondes",
        "level": "L1",
        "subject": "Physique"
      },
      {
        "title": "Concepts fondamentaux de la physique",
        "slug": "concepts-fondamentaux-physique",
        "level": "L1",
        "subject": "Physique"
      },
      {
        "title": "Histoire des sciences et techniques",
        "slug": "histoire-sciences-techniques",
        "level": "L1",
        "subject": "Histoire des sciences"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est l'une des premières théories majeures concernant la nature du son, souvent attribuée aux philosophes grecs antiques?",
    "options": [
      "Le son est une vibration de l'air.",
      "Le son est une particule émise par la source.",
      "Le son est une forme d'énergie lumineuse.",
      "Le son est une manifestation de l'harmonie cosmique sans support matériel."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-historique-son",
    "sectionTitle": "Introduction historique au concept de son"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les différentes théories historiques sur la nature du son, de l'Antiquité à la période classique.",
      "Évaluer l'impact des découvertes scientifiques majeures sur la compréhension du phénomène sonore.",
      "Distinguer les contributions des figures clés (philosophes, scientifiques) à l'élaboration du concept de son."
    ],
    "skills": [
      "Établir des liens critiques entre les avancées conceptuelles en acoustique et le contexte socio-historique de leur émergence.",
      "Synthétiser les informations provenant de diverses sources historiques pour construire une chronologie cohérente de la pensée acoustique.",
      "Formuler des arguments étayés sur l'évolution des modèles explicatifs du son."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle pour les racines historiques des concepts scientifiques actuels.",
      "Adopter une démarche réflexive face à l'évolution des connaissances et des paradigmes scientifiques.",
      "Apprécier la complexité et la richesse de l'histoire des sciences à travers l'exemple de l'acoustique."
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