You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Microéconomie de la production et des coûts",
        "slug": "microeconomie-production-couts",
        "level": "Licence 3",
        "subject": "Économie"
      },
      {
        "title": "Modèles de croissance économique de base",
        "slug": "modeles-croissance-economique",
        "level": "Master 1",
        "subject": "Économie"
      },
      {
        "title": "Théories de l'investissement",
        "slug": "theories-investissement",
        "level": "Master 1",
        "subject": "Économie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon la théorie néoclassique de l'investissement, quel facteur est le plus déterminant pour la décision d'une firme d'investir dans du capital physique ?",
    "options": [
      "Le niveau actuel des profits de la firme.",
      "Le taux d'intérêt réel et le coût d'usage du capital.",
      "Les anticipations de demande future pour ses produits.",
      "La disponibilité de liquidités."
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-introduction",
    "sectionTitle": "Introduction au comportement des firmes"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les différentes théories de l'investissement des firmes (néoclassique, Q de Tobin, accélérateur).",
      "Évaluer l'impact des politiques économiques sur les décisions d'investissement des entreprises.",
      "Distinguer les facteurs déterminants de l'accumulation de capital dans les modèles macroéconomiques."
    ],
    "skills": [
      "Appliquer les modèles d'investissement pour prédire le comportement des firmes face aux chocs économiques.",
      "Évaluer la pertinence des différentes approches théoriques pour expliquer les cycles d'investissement.",
      "Construire des arguments critiques sur l'efficacité des incitations fiscales à l'investissement."
    ],
    "attitudes": [
      "Développer une approche critique face aux simplifications des modèles d'investissement.",
      "Valoriser la complexité des interactions entre les décisions microéconomiques des firmes et les agrégats macroéconomiques.",
      "Adopter une posture réflexive sur les implications éthiques des politiques favorisant l'accumulation de capital."
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