You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités",
        "slug": "theorie-probabilites",
        "level": "Licence 3 (L3)",
        "subject": "Mathématiques"
      },
      {
        "title": "Processus Stochastiques Discrets",
        "slug": "processus-stochastiques-discrets",
        "level": "Licence 3 (L3)",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Calcul Différentiel et Intégral",
        "slug": "calcul-differentiel-integral",
        "level": "Licence 2 (L2)",
        "subject": "Mathématiques"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle propriété fondamentale caractérise les accroissements d'un Mouvement Brownien standard sur des intervalles de temps disjoints ?",
    "options": [
      "Ils sont indépendants et suivent une loi normale centrée.",
      "Ils sont corrélés et suivent une loi de Poisson.",
      "Ils sont dépendants et ont une variance constante.",
      "Ils sont indépendants et suivent une loi exponentielle."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-mouvement-brownien",
    "sectionTitle": "Introduction au Mouvement Brownien"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les propriétés fondamentales du Mouvement Brownien standard et généralisé.",
      "Évaluer la pertinence des concepts de martingale et de semi-martingale pour l'intégrale stochastique.",
      "Distinguer les différentes interprétations de l'intégrale d'Itô et de Stratonovich."
    ],
    "skills": [
      "Appliquer le lemme d'Itô pour transformer des fonctions de processus stochastiques.",
      "Construire des intégrales stochastiques par rapport au Mouvement Brownien.",
      "Évaluer la valeur d'espérances conditionnelles dans le cadre des processus stochastiques."
    ],
    "attitudes": [
      "Développer une appréciation pour la rigueur mathématique nécessaire à la modélisation stochastique en finance.",
      "Adopter une perspective critique sur les limites et les hypothèses des modèles basés sur le Mouvement Brownien.",
      "Manifester de la curiosité pour les avancées récentes en calcul stochastique et leurs applications financières."
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