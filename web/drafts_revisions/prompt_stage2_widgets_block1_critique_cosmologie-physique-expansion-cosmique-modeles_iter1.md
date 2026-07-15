You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Relativité Générale",
        "slug": "intro-relativite-generale",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Physique Théorique"
      },
      {
        "title": "Principes de la Mécanique Classique et Céleste",
        "slug": "mecanique-classique-celeste",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Physique"
      },
      {
        "title": "Bases de la Physique Statistique et Thermodynamique",
        "slug": "physique-statistique-thermodynamique",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Physique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle observation majeure a conduit à la théorie de l'expansion de l'Univers?",
    "options": [
      "La découverte des ondes gravitationnelles.",
      "Le décalage vers le rouge des galaxies lointaines (loi de Hubble).",
      "L'existence de la matière noire.",
      "La détection des trous noirs."
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-expansion",
    "sectionTitle": "L'Expansion de l'Univers"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques de la relativité générale appliqués à la cosmologie.",
      "Évaluer les preuves observationnelles de l'expansion de l'Univers et de l'existence du fond diffus cosmologique.",
      "Distinguer les différents modèles cosmologiques (ex: Univers de Friedmann-Lemaître) et leurs implications."
    ],
    "skills": [
      "Appliquer les équations de Friedmann pour décrire la dynamique de l'Univers.",
      "Interpréter les données observationnelles (ex: courbes de rotation des galaxies, supernovae) pour contraindre les paramètres cosmologiques.",
      "Modéliser l'évolution thermique et compositionnelle de l'Univers primordial."
    ],
    "attitudes": [
      "Développer une curiosité critique envers les grandes questions non résolues de la cosmologie moderne (ex: nature de la matière noire et de l'énergie noire).",
      "Apprécier la démarche scientifique et l'interconnexion entre théorie et observation en astrophysique.",
      "Adopter une perspective globale sur l'histoire et l'évolution de l'Univers."
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