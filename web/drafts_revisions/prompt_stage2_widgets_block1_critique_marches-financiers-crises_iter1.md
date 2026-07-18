You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Macroéconomie Intermédiaire",
        "slug": "macroeconomie-intermediaire",
        "level": "Licence 3ème Année (L3)",
        "subject": "Macroéconomie"
      },
      {
        "title": "Théorie Monétaire et Financière",
        "slug": "theorie-monetaire-financiere",
        "level": "Licence 3ème Année (L3)",
        "subject": "Économie Monétaire"
      },
      {
        "title": "Modèles d'Équilibre Général Dynamique Stochastique (DSGE)",
        "slug": "modeles-dsge",
        "level": "Master 1ère Année (M1)",
        "subject": "Modélisation Économique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est le mécanisme principal par lequel l'éclatement d'une bulle spéculative sur les marchés financiers peut déclencher une crise macroéconomique généralisée?",
    "options": [
      "Une augmentation soudaine des dépenses publiques.",
      "Un effondrement des prix des actifs entraînant une destruction de richesse et une contraction du crédit.",
      "Une diminution significative du commerce international.",
      "Une rigidité accrue du marché du travail."
    ],
    "correctIndex": 1,
    "targetSectionId": "mecanismes-transmission-crises",
    "sectionTitle": "Mécanismes de Transmission des Crises Financières"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les mécanismes de formation et d'éclatement des bulles spéculatives sur les marchés financiers.",
      "Évaluer les différentes théories des crises financières et leurs implications macroéconomiques.",
      "Distinguer les instruments de politique monétaire et budgétaire utilisés pour stabiliser les marchés financiers."
    ],
    "skills": [
      "Analyser des données macroéconomiques et financières pour identifier les signes précurseurs de déséquilibres.",
      "Évaluer l'efficacité des politiques macroprudentielles et contracycliques en réponse aux chocs financiers.",
      "Créer des modèles simplifiés pour illustrer les interactions entre les marchés financiers et l'économie réelle."
    ],
    "attitudes": [
      "Développer une pensée critique face aux discours sur la stabilité financière et les risques systémiques.",
      "Adopter une approche rigoureuse dans l'évaluation des vulnérabilités des marchés financiers.",
      "Reconnaître l'importance de la coopération internationale dans la gestion et la prévention des crises financières."
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