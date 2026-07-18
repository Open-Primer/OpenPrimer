You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Macroéconomie Avancée I",
        "slug": "macroeconomie-avancee-i",
        "level": "Master 1",
        "subject": "Économie"
      },
      {
        "title": "Politique Monétaire et Budgétaire",
        "slug": "politique-monetaire-et-budgetaire",
        "level": "Master 1",
        "subject": "Économie"
      },
      {
        "title": "Économie de l'Environnement: Fondamentaux",
        "slug": "economie-environnement-fondamentaux",
        "level": "Licence 3",
        "subject": "Économie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale difficulté pour une banque centrale lorsqu'elle doit gérer simultanément une forte inflation et une croissance économique faible?",
    "options": [
      "La politique monétaire expansionniste pour stimuler la croissance aggrave l'inflation.",
      "La politique monétaire restrictive pour contrôler l'inflation freine davantage la croissance.",
      "Les deux politiques (expansionniste et restrictive) sont nécessaires simultanément, ce qui est contradictoire.",
      "La politique budgétaire est toujours plus efficace que la politique monétaire dans ce scénario."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-aux-dilemmes-de-politique-economique",
    "sectionTitle": "Introduction aux dilemmes de politique économique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les causes et les mécanismes de l'inflation contemporaine.",
      "Évaluer les modèles théoriques de croissance économique face aux contraintes environnementales.",
      "Distinguer les instruments et les objectifs des politiques macroéconomiques dans un contexte de défis multiples."
    ],
    "skills": [
      "Appliquer des cadres d'analyse macroéconomique pour diagnostiquer les défis de politique économique.",
      "Élaborer des propositions de politiques économiques intégrées tenant compte des interactions entre inflation, croissance et environnement.",
      "Interpréter des données économiques et des indicateurs environnementaux pour éclairer les décisions de politique."
    ],
    "attitudes": [
      "Développer une pensée critique face aux dilemmes et aux compromis inhérents à la politique économique.",
      "Adopter une approche interdisciplinaire pour appréhender les enjeux complexes de l'économie contemporaine.",
      "Manifester un engagement éthique dans la conception de politiques économiques durables et équitables."
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