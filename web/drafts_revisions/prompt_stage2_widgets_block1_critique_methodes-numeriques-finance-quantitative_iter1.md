You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Calcul Stochastique",
        "slug": "calcul-stochastique",
        "level": "Licence 3 / M1",
        "subject": "Mathématiques Financières"
      },
      {
        "title": "Programmation Python pour la Finance",
        "slug": "programmation-python-finance",
        "level": "Licence 3 / M1",
        "subject": "Informatique Appliquée"
      },
      {
        "title": "Fondamentaux d'Analyse Numérique",
        "slug": "fondamentaux-analyse-numerique",
        "level": "Licence 3 / M1",
        "subject": "Mathématiques Appliquées"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle méthode numérique est couramment utilisée pour approximer la solution d'une Équation Différentielle Stochastique (EDS) en finance quantitative?",
    "options": [
      "Méthode de Newton-Raphson",
      "Schéma d'Euler-Maruyama",
      "Méthode des moindres carrés",
      "Algorithme de Levenberg-Marquardt"
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-eds-numeriques",
    "sectionTitle": "Introduction aux EDS Numériques"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les principes fondamentaux des méthodes numériques appliquées à la valorisation d'actifs financiers.",
      "Évaluer la pertinence de différentes schémas numériques pour la résolution d'équations différentielles stochastiques.",
      "Distinguer les avantages et inconvénients des méthodes de Monte Carlo et des méthodes aux différences finies pour les problèmes financiers."
    ],
    "skills": [
      "Développer des algorithmes de simulation Monte Carlo pour valoriser des produits dérivés complexes.",
      "Implémenter des schémas aux différences finies pour résoudre des équations aux dérivées partielles (EDP) en finance.",
      "Calibrer des modèles stochastiques en utilisant des techniques d'optimisation numérique."
    ],
    "attitudes": [
      "Adopter une approche critique face aux résultats numériques et comprendre leurs limites et hypothèses.",
      "Valoriser la rigueur mathématique et la précision algorithmique dans la modélisation financière.",
      "Développer une curiosité intellectuelle pour les avancées récentes en méthodes numériques appliquées à la finance."
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