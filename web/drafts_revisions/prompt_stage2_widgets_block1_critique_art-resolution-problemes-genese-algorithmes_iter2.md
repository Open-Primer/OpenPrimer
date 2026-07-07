You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Logique et Raisonnement",
        "slug": "logique-raisonnement",
        "level": "Lycée / Baccalauréat",
        "subject": "Mathématiques"
      },
      {
        "title": "Bases de l'Algèbre",
        "slug": "bases-algebre",
        "level": "Lycée / Baccalauréat",
        "subject": "Mathématiques"
      },
      {
        "title": "Méthodes de Résolution de Problèmes",
        "slug": "methodes-resolution-problemes",
        "level": "Lycée / Baccalauréat",
        "subject": "Compétences Transversales"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est l'objectif principal d'un algorithme dans le contexte de la résolution de problèmes?",
    "options": [
      "Stocker des informations complexes de manière sécurisée.",
      "Décrire une séquence finie et non ambiguë d'instructions pour résoudre un problème.",
      "Optimiser les performances matérielles d'un ordinateur.",
      "Générer des interfaces utilisateur interactives et esthétiques."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-algorithmes",
    "sectionTitle": "Introduction aux Algorithmes"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les origines historiques et l'évolution du concept d'algorithme.",
      "Identifier les caractéristiques fondamentales d'un algorithme (finitude, déterminisme, etc.).",
      "Expliquer le rôle central des algorithmes dans la résolution de problèmes informatiques et quotidiens."
    ],
    "skills": [
      "Appliquer une démarche structurée pour analyser un problème simple.",
      "Élaborer les étapes initiales d'une solution algorithmique pour un problème donné.",
      "Proposer des représentations simples d'algorithmes (pseudo-code, organigramme)."
    ],
    "attitudes": [
      "Développer une approche logique et systématique face à la résolution de problèmes.",
      "Valoriser la précision et la rigueur dans la formulation des étapes d'une solution.",
      "Adopter une curiosité intellectuelle envers les applications des algorithmes dans divers domaines."
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