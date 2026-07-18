You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités (fondamentaux)",
        "slug": "theorie-probabilites-fondamentaux",
        "level": "Licence 3",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Variables Aléatoires et Distributions",
        "slug": "variables-aleatoires-distributions",
        "level": "Licence 3",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Espérance Conditionnelle",
        "slug": "esperance-conditionnelle",
        "level": "Licence 3",
        "subject": "Mathématiques Appliquées"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Soit (X_n)_{n>=0} une suite de variables aléatoires indépendantes et identiquement distribuées (i.i.d.) avec E[X_n] = mu. Quelle est la valeur de E[X_{n+1} | X_0, ..., X_n] ?",
    "options": [
      "mu",
      "X_n",
      "E[X_n]",
      "X_{n+1}"
    ],
    "correctIndex": 0,
    "targetSectionId": "section-1-rappels-esperance-conditionnelle",
    "sectionTitle": "Rappels sur l'Espérance Conditionnelle et l'Indépendance"
  },
  "learningObjectives": {
    "knowledge": [
      "Expliquer les définitions et propriétés fondamentales des processus stochastiques discrets.",
      "Décrire les conditions nécessaires et suffisantes pour qu'un processus soit une martingale, une sous-martingale ou une sur-martingale.",
      "Identifier les différents types de processus stochastiques discrets (ex: marches aléatoires, processus de Bernoulli)."
    ],
    "skills": [
      "Appliquer les théorèmes de convergence des martingales pour analyser le comportement asymptotique de processus financiers.",
      "Calculer l'espérance conditionnelle et les probabilités de transition pour des processus stochastiques discrets donnés.",
      "Analyser la propriété de non-arbitrage dans des modèles de marché discrets à l'aide des martingales."
    ],
    "attitudes": [
      "Évaluer la pertinence de l'utilisation des martingales pour modéliser des phénomènes aléatoires en finance.",
      "Développer une approche rigoureuse et critique face à l'interprétation des résultats de modèles stochastiques.",
      "Valoriser l'importance des fondements théoriques des processus stochastiques pour la compréhension des marchés financiers."
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