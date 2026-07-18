You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Modèle IS-LM et ses extensions",
        "slug": "modele-is-lm-extensions",
        "level": "Licence 3ème Année (L3)",
        "subject": "Macroéconomie"
      },
      {
        "title": "Inflation, chômage et courbe de Phillips",
        "slug": "inflation-chomage-phillips",
        "level": "Licence 3ème Année (L3)",
        "subject": "Macroéconomie"
      },
      {
        "title": "Outils et objectifs de la politique monétaire",
        "slug": "outils-objectifs-politique-monetaire",
        "level": "Licence 3ème Année (L3)",
        "subject": "Macroéconomie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon la règle de Taylor standard, comment la banque centrale devrait-elle ajuster son taux directeur nominal en réponse à une augmentation de l'inflation au-dessus de sa cible et un écart de production positif ?",
    "options": [
      "Augmenter le taux directeur nominal de manière plus que proportionnelle à l'inflation.",
      "Diminuer le taux directeur nominal pour stimuler l'économie.",
      "Maintenir le taux directeur nominal inchangé pour éviter la volatilité.",
      "Augmenter le taux directeur nominal uniquement si l'inflation est très élevée."
    ],
    "correctIndex": 0,
    "targetSectionId": "introduction-regles-politique-monetaire",
    "sectionTitle": "Introduction aux règles de politique monétaire"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les composantes fondamentales et les objectifs de la règle de Taylor.",
      "Expliquer les fondements théoriques des règles de politique monétaire dans un cadre macroéconomique.",
      "Identifier les différentes variantes et extensions de la règle de Taylor et leurs implications."
    ],
    "skills": [
      "Analyser l'impact des règles de Taylor sur la stabilité macroéconomique et la crédibilité de la banque centrale.",
      "Évaluer la performance des banques centrales à l'aune des règles de politique monétaire dans des contextes historiques et contemporains.",
      "Formuler des recommandations de politique monétaire basées sur l'application et l'ajustement des règles de Taylor."
    ],
    "attitudes": [
      "Développer une approche critique face aux défis et aux limites de la mise en œuvre des règles de politique monétaire.",
      "Adopter une perspective nuancée sur le débat entre règles et discrétion en politique monétaire.",
      "Reconnaître l'importance de la cohérence, de la transparence et de la crédibilité dans la conduite de la politique monétaire."
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