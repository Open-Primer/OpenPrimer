You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Logique et raisonnement",
        "slug": "logique-raisonnement",
        "level": "Lycée / High School",
        "subject": "Mathématiques"
      },
      {
        "title": "Concepts mathématiques de base",
        "slug": "concepts-mathematiques-base",
        "level": "Lycée / High School",
        "subject": "Mathématiques"
      },
      {
        "title": "Méthodes de résolution de problèmes",
        "slug": "methodes-resolution-problemes",
        "level": "Lycée / High School",
        "subject": "Compétences transversales"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la première étape essentielle pour aborder la résolution d'un problème complexe de manière structurée?",
    "options": [
      "Écrire immédiatement le code ou la solution finale.",
      "Définir clairement le problème, ses objectifs et ses contraintes.",
      "Choisir le langage de programmation ou l'outil à utiliser.",
      "Tester différentes solutions au hasard jusqu'à en trouver une qui fonctionne."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-resolution-algorithmique",
    "sectionTitle": "Introduction à la résolution algorithmique"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les origines historiques et l'évolution du concept d'algorithme.",
      "Identifier les caractéristiques fondamentales qui définissent un algorithme.",
      "Expliquer le rôle et l'impact des algorithmes dans la société contemporaine."
    ],
    "skills": [
      "Illustrer des problèmes simples avec des séquences d'étapes logiques.",
      "Construire des représentations simples d'algorithmes (ex: pseudo-code basique, organigramme).",
      "Utiliser des exemples concrets pour différencier un algorithme d'une simple recette ou d'une instruction ambiguë."
    ],
    "attitudes": [
      "Développer une approche méthodique et rigoureuse face à la résolution de problèmes.",
      "Apprécier l'importance de la clarté, de la précision et de l'exhaustivité dans la description des étapes.",
      "Adopter une curiosité intellectuelle envers les applications et les limites des algorithmes dans divers domaines."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).

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