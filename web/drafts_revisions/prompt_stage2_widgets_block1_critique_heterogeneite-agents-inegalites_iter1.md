You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Modèles d'équilibre général dynamique stochastique (DSGE)",
        "slug": "dsge-models",
        "level": "Master 1",
        "subject": "Macroéconomie"
      },
      {
        "title": "Microfondations de la macroéconomie",
        "slug": "microfoundations-macro",
        "level": "Master 1",
        "subject": "Macroéconomie"
      },
      {
        "title": "Mesures et causes des inégalités économiques",
        "slug": "economic-inequalities",
        "level": "Licence 3 / Master 1",
        "subject": "Économie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale limitation des modèles à agent représentatif lorsqu'il s'agit d'analyser les inégalités macroéconomiques?",
    "options": [
      "Ils ne peuvent pas incorporer la politique monétaire.",
      "Ils supposent une information parfaite.",
      "Ils ne parviennent pas à capturer les effets distributifs.",
      "Ils sont trop complexes sur le plan computationnel."
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-heterogeneity",
    "sectionTitle": "Introduction à l'hétérogénéité des agents"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les limites des modèles à agent représentatif pour l'étude des inégalités.",
      "Évaluer les différentes approches de modélisation de l'hétérogénéité des agents.",
      "Distinguer les mécanismes par lesquels l'hétérogénéité des agents affecte les agrégats macroéconomiques."
    ],
    "skills": [
      "Appliquer des modèles macroéconomiques avec agents hétérogènes pour analyser des questions de politique économique.",
      "Évaluer la pertinence de différents outils statistiques pour mesurer et décomposer les inégalités.",
      "Construire des arguments critiques sur l'impact des politiques publiques sur la distribution des revenus et de la richesse."
    ],
    "attitudes": [
      "Développer une appréciation critique de la complexité des interactions entre micro-comportements et phénomènes macroéconomiques.",
      "Adopter une perspective nuancée sur les implications des inégalités pour la stabilité et la croissance économique.",
      "Manifester une rigueur intellectuelle dans l'évaluation des fondements théoriques des politiques de redistribution."
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