You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Modèle IS-LM en économie fermée",
        "slug": "modele-is-lm-economie-fermee",
        "level": "Licence 3",
        "subject": "Macroéconomie"
      },
      {
        "title": "Balance des paiements et marchés des changes",
        "slug": "balance-paiements-marches-changes",
        "level": "Licence 3",
        "subject": "Économie internationale"
      },
      {
        "title": "Théories de détermination des taux de change",
        "slug": "theories-determination-taux-change",
        "level": "Master 1",
        "subject": "Économie internationale"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Dans le modèle de Mundell-Fleming avec parfaite mobilité des capitaux et un régime de taux de change flottants, une politique monétaire expansionniste entraîne généralement :",
    "options": [
      "Une appréciation de la monnaie nationale et une baisse de la production.",
      "Une dépréciation de la monnaie nationale et une augmentation de la production.",
      "Aucun changement dans le taux de change ni dans la production.",
      "Une dépréciation de la monnaie nationale et une baisse de la production."
    ],
    "correctIndex": 1,
    "targetSectionId": "impact-politiques-taux-change-flottants",
    "sectionTitle": "Impact des politiques économiques en régime de taux de change flottants"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les déterminants fondamentaux des taux de change réels et nominaux.",
      "Évaluer l'impact des différents régimes de taux de change sur la politique monétaire et budgétaire.",
      "Distinguer les modèles théoriques majeurs de détermination des taux de change (ex: PPA, PAI, modèle monétaire)."
    ],
    "skills": [
      "Appliquer le modèle de Mundell-Fleming pour analyser les chocs macroéconomiques en économie ouverte.",
      "Évaluer la pertinence des différentes politiques de stabilisation macroéconomique dans un contexte international.",
      "Construire des arguments économiques pour ou contre l'adoption d'un régime de taux de change fixe ou flottant."
    ],
    "attitudes": [
      "Développer une pensée critique face aux débats sur la gestion des taux de change et leurs implications pour la souveraineté économique.",
      "Adopter une approche nuancée dans l'évaluation des avantages et inconvénients des différentes architectures monétaires internationales.",
      "Manifester de l'intérêt pour les actualités économiques internationales et leur lien avec les théories des taux de change."
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