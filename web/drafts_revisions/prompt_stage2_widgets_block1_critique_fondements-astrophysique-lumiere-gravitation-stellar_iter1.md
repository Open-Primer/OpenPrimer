You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Mécanique Classique",
        "slug": "mecanique-classique",
        "level": "University Year 1",
        "subject": "Physique"
      },
      {
        "title": "Électromagnétisme Fondamental",
        "slug": "electromagnetisme-fondamental",
        "level": "University Year 1",
        "subject": "Physique"
      },
      {
        "title": "Calcul Différentiel et Intégral",
        "slug": "calcul-differentiel-integral",
        "level": "University Year 1",
        "subject": "Mathématiques"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon l'effet Doppler, comment la longueur d'onde de la lumière émise par une galaxie lointaine est-elle affectée si cette galaxie s'éloigne de nous ?",
    "options": [
      "Elle diminue (décalage vers le bleu).",
      "Elle augmente (décalage vers le rouge).",
      "Elle reste inchangée.",
      "Elle dépend de la masse de la galaxie."
    ],
    "correctIndex": 1,
    "targetSectionId": "lumiere-doppler",
    "sectionTitle": "Lumière et Effet Doppler en Astrophysique"
  },
  "learningObjectives": {
    "knowledge": [
      "Comprendre les principes fondamentaux de la mécanique céleste et de la gravitation newtonienne et relativiste.",
      "Expliquer les propriétés physiques de la lumière, son spectre électromagnétique et son interaction avec la matière cosmique.",
      "Décrire les étapes clés de l'évolution stellaire, de la formation à la mort des étoiles."
    ],
    "skills": [
      "Analyser des spectres lumineux pour déduire la composition chimique, la température et le mouvement des objets célestes.",
      "Évaluer l'impact des lois de la gravitation sur la dynamique des systèmes stellaires et galactiques.",
      "Appliquer les concepts de la physique pour résoudre des problèmes liés à la luminosité, la distance et la classification des étoiles."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle pour les phénomènes astrophysiques et les grandes questions de la cosmologie.",
      "Apprécier la démarche scientifique rigoureuse dans l'étude de l'univers et la formulation de théories.",
      "Questionner les modèles actuels de l'univers à la lumière de nouvelles observations et découvertes scientifiques."
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