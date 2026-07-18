You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Fondements de la macroéconomie",
        "slug": "fondements-macroeconomie",
        "level": "Licence 3",
        "subject": "Économie"
      },
      {
        "title": "Analyse des politiques budgétaires",
        "slug": "analyse-politiques-budgetaires",
        "level": "Licence 3",
        "subject": "Économie"
      },
      {
        "title": "Principes de la finance publique",
        "slug": "principes-finance-publique",
        "level": "Licence 3",
        "subject": "Économie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la conséquence directe la plus probable d'une politique budgétaire expansionniste (augmentation des dépenses publiques ou baisse des impôts) sur la dette publique à court terme, toutes choses égales par ailleurs?",
    "options": [
      "Une diminution de la dette publique.",
      "Une augmentation de la dette publique.",
      "Aucun impact sur la dette publique.",
      "Une augmentation du PIB nominal uniquement."
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-introduction-politique-budgetaire",
    "sectionTitle": "Introduction à la politique budgétaire et à la dette publique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les mécanismes de transmission de la politique budgétaire dans différents modèles macroéconomiques.",
      "Évaluer les facteurs déterminants de la soutenabilité de la dette publique.",
      "Distinguer les différents types de politiques budgétaires et leurs objectifs."
    ],
    "skills": [
      "Appliquer des modèles économiques pour simuler les effets des politiques budgétaires sur l'économie.",
      "Évaluer de manière critique les arguments en faveur ou défaveur de différentes stratégies de gestion de la dette publique.",
      "Créer des scénarios de politique budgétaire pour atteindre des objectifs macroéconomiques spécifiques."
    ],
    "attitudes": [
      "Développer une approche critique face aux débats sur la politique budgétaire et la dette publique.",
      "Reconnaître l'importance d'une gestion prudente de la dette publique pour la stabilité économique à long terme.",
      "Adopter une perspective éthique dans l'évaluation des implications intergénérationnelles de la dette publique."
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