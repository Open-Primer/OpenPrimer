You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Les Lumières et leurs idées politiques",
        "slug": "les-lumieres-idees-politiques",
        "level": "Lycée",
        "subject": "Histoire"
      },
      {
        "title": "L'Ancien Régime et ses structures sociales",
        "slug": "ancien-regime-structures-sociales",
        "level": "Lycée",
        "subject": "Histoire"
      },
      {
        "title": "Les grandes puissances européennes au XVIIIe siècle",
        "slug": "grandes-puissances-europeennes-xviiie",
        "level": "Lycée",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle était la caractéristique principale du système politique français avant la Révolution de 1789?",
    "options": [
      "Une monarchie constitutionnelle avec un parlement fort",
      "Une monarchie absolue de droit divin",
      "Une république fédérale avec une large autonomie régionale",
      "Un État socialiste basé sur la propriété collective"
    ],
    "correctIndex": 1,
    "targetSectionId": "contexte-pre-revolutionnaire",
    "sectionTitle": "Contexte des Révolutions"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les causes profondes et les déclencheurs des révolutions atlantiques (fin XVIIIe - début XIXe).",
      "Évaluer l'influence des idéologies des Lumières sur les transformations politiques et sociales de l'époque.",
      "Comparer les caractéristiques principales des processus de construction nationale émergents en Europe."
    ],
    "skills": [
      "Analyser des documents historiques primaires (déclarations, constitutions, correspondances) de l'ère révolutionnaire.",
      "Évaluer la pertinence de différentes interprétations historiographiques concernant la naissance des nations.",
      "Construire une argumentation structurée sur les continuités et ruptures politiques de cette période."
    ],
    "attitudes": [
      "Développer une approche critique face aux récits nationaux et aux mythes fondateurs de cette période.",
      "Apprécier la complexité des processus de transformation politique et sociale à l'échelle mondiale.",
      "Manifester une curiosité intellectuelle pour les débats historiographiques contemporains sur l'ère des révolutions."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).

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