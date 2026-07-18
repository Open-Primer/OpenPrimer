You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Modèles macroéconomiques fondamentaux",
        "slug": "modeles-macroeconomiques-fondamentaux",
        "level": "Licence 3ème Année",
        "subject": "Macroéconomie"
      },
      {
        "title": "Théories de la croissance économique",
        "slug": "theories-croissance-economique",
        "level": "Licence 3ème Année",
        "subject": "Macroéconomie"
      },
      {
        "title": "Histoire de la pensée économique",
        "slug": "histoire-pensee-economique",
        "level": "Licence 2ème Année",
        "subject": "Histoire de la pensée économique"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle école de pensée macroéconomique a principalement remis en question les fondements du modèle keynésien traditionnel dans les années 1970, en insistant sur les anticipations rationnelles et la neutralité de la monnaie à long terme?",
    "options": [
      "La Nouvelle Économie Keynésienne",
      "Le Monétarisme",
      "La Nouvelle Macroéconomie Classique",
      "L'École Autrichienne"
    ],
    "correctIndex": 2,
    "targetSectionId": "introduction-ruptures-paradigmatiques",
    "sectionTitle": "Introduction aux paradigmes macroéconomiques"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques et les limites des principaux courants macroéconomiques (keynésianisme, monétarisme, nouvelle macroéconomie classique, nouvelle économie keynésienne).",
      "Distinguer les contributions majeures des économistes clés ayant initié des ruptures paradigmatiques.",
      "Évaluer l'impact des chocs économiques (ex: stagflation des années 70) sur l'évolution de la pensée macroéconomique."
    ],
    "skills": [
      "Évaluer de manière critique les hypothèses sous-jacentes aux différents modèles macroéconomiques.",
      "Appliquer les cadres d'analyse des différentes écoles pour interpréter des phénomènes économiques contemporains.",
      "Synthétiser les arguments et contre-arguments des débats majeurs en macroéconomie contemporaine."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle pour les débats et les évolutions de la pensée économique.",
      "Adopter une approche rigoureuse et nuancée dans l'analyse des politiques économiques.",
      "Reconnaître la complexité et l'interdépendance des facteurs influençant les décisions de politique macroéconomique."
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