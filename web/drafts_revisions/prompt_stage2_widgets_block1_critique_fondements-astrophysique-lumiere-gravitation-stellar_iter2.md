You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Physique générale: Mécanique classique",
        "slug": "physique-mecanique-classique",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Physique"
      },
      {
        "title": "Physique générale: Optique et Ondes",
        "slug": "physique-optique-ondes",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Physique"
      },
      {
        "title": "Mathématiques: Calcul différentiel et intégral",
        "slug": "math-calcul-diff-int",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Mathématiques"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle propriété de la lumière est principalement utilisée par les astronomes pour déterminer la composition chimique d'une étoile lointaine?",
    "options": [
      "Sa vitesse de propagation dans le vide.",
      "Son spectre d'émission ou d'absorption.",
      "Sa polarisation.",
      "Son intensité lumineuse."
    ],
    "correctIndex": 1,
    "targetSectionId": "section_lumiere_spectres",
    "sectionTitle": "La lumière comme messager cosmique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principes fondamentaux de la propagation de la lumière et de l'interaction lumière-matière dans les environnements astrophysiques.",
      "Évaluer l'importance du spectre électromagnétique pour l'étude des corps célestes.",
      "Distinguer les différents types de spectres (émission, absorption, continu) et leur origine physique."
    ],
    "skills": [
      "Appliquer les lois de la physique (ex: lois de Kirchhoff, loi de Wien, loi de Stefan-Boltzmann) pour interpréter les données spectrales des étoiles.",
      "Interpréter des diagrammes Hertzsprung-Russell simplifiés basés sur les propriétés spectrales des étoiles.",
      "Calculer des propriétés stellaires de base (température, rayon) à partir de données photométriques et spectrales."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle pour les méthodes d'observation et d'analyse en astrophysique.",
      "Adopter une approche critique face aux informations scientifiques concernant l'univers observable.",
      "Apprécier la complexité et l'interconnexion des phénomènes physiques régissant les objets célestes."
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