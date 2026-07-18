You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction aux Options Financières",
        "slug": "introduction-options-financieres",
        "level": "Master 1st Year (M1)",
        "subject": "Finance Quantitative"
      },
      {
        "title": "Modèle de Black-Scholes",
        "slug": "modele-black-scholes",
        "level": "Master 1st Year (M1)",
        "subject": "Finance Quantitative"
      },
      {
        "title": "Calcul Différentiel Appliqué à la Finance",
        "slug": "calcul-differentiel-applique-finance",
        "level": "Licence 3rd Year (L3)",
        "subject": "Mathématiques Financières"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale utilité du modèle de Black-Scholes en finance?",
    "options": [
      "Calculer la valeur intrinsèque d'une action.",
      "Estimer le prix théorique des options européennes.",
      "Prévoir les mouvements futurs des taux d'intérêt.",
      "Déterminer le rendement d'un portefeuille obligataire."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-grecques",
    "sectionTitle": "Introduction aux Grecques"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les définitions et les formules des principales grecques (Delta, Gamma, Vega, Theta, Rho).",
      "Évaluer l'impact des paramètres du marché sur la valeur des options via les grecques.",
      "Comprendre les hypothèses sous-jacentes au calcul des grecques dans le modèle de Black-Scholes."
    ],
    "skills": [
      "Calculer les valeurs des grecques pour différentes options en utilisant des formules analytiques ou numériques.",
      "Interpréter la signification économique des grecques pour la gestion des risques de portefeuille.",
      "Construire des stratégies de couverture basées sur les grecques pour minimiser l'exposition au risque."
    ],
    "attitudes": [
      "Développer une approche critique face aux limites des modèles de calcul des grecques.",
      "Apprécier l'importance de la gestion dynamique des risques dans le trading d'options.",
      "Adopter une rigueur méthodologique dans l'application des concepts des grecques à des cas pratiques."
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