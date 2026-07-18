You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités Avancée",
        "slug": "theorie-des-probabilites-avancee",
        "level": "Licence 3rd Year (L3)",
        "subject": "Mathématiques"
      },
      {
        "title": "Calcul Différentiel et Intégral",
        "slug": "calcul-differentiel-et-integral",
        "level": "Licence 2nd Year (L2)",
        "subject": "Mathématiques"
      },
      {
        "title": "Introduction aux Processus Stochastiques",
        "slug": "introduction-aux-processus-stochastiques",
        "level": "Licence 3rd Year (L3)",
        "subject": "Mathématiques"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Soit W_t un processus de Wiener standard. Quelle est la distribution de l'incrément W_{t+s} - W_t pour s > 0 ?",
    "options": [
      "Normale N(0, 1)",
      "Normale N(0, s)",
      "Normale N(t, s)",
      "Exponentielle Exp(s)"
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-introduction-wiener",
    "sectionTitle": "Introduction au Processus de Wiener"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les propriétés fondamentales du mouvement brownien et des intégrales stochastiques.",
      "Évaluer la distinction entre le calcul d'Itô et le calcul classique en termes de règles de dérivation.",
      "Identifier les conditions d'application de la formule d'Itô pour des fonctions de processus stochastiques."
    ],
    "skills": [
      "Appliquer la formule d'Itô pour transformer des processus stochastiques et dériver des équations différentielles stochastiques.",
      "Analyser des problèmes de modélisation financière en utilisant les outils du calcul stochastique.",
      "Construire des solutions pour des équations différentielles stochastiques simples."
    ],
    "attitudes": [
      "Développer une appréciation critique de la puissance et des limites du calcul stochastique dans la modélisation des phénomènes aléatoires.",
      "Adopter une approche rigoureuse et méthodique dans la résolution de problèmes impliquant des processus stochastiques.",
      "Manifester de l'intérêt pour l'exploration de nouvelles applications du calcul stochastique en finance quantitative."
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