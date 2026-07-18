You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Microéconomie avancée: Théorie du consommateur",
        "slug": "microeconomie-avancee-theorie-consommateur",
        "level": "Licence 3",
        "subject": "Économie"
      },
      {
        "title": "Modèles de croissance macroéconomique",
        "slug": "modeles-croissance-macroeconomique",
        "level": "Master 1",
        "subject": "Économie"
      },
      {
        "title": "Optimisation sous contrainte en économie",
        "slug": "optimisation-contrainte-economie",
        "level": "Licence 3",
        "subject": "Mathématiques pour l'économie"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est l'hypothèse fondamentale concernant le comportement des ménages dans le modèle de consommation intertemporelle?",
    "options": [
      "Les ménages maximisent leur utilité présente uniquement.",
      "Les ménages maximisent leur utilité sur toute leur durée de vie.",
      "Les ménages épargnent uniquement pour des motifs de précaution.",
      "Les ménages consomment tout leur revenu à chaque période."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-modeles-intertemporels",
    "sectionTitle": "Introduction aux modèles de choix intertemporels"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques du modèle de consommation intertemporelle.",
      "Distinguer les différents motifs d'épargne des ménages.",
      "Expliquer l'impact des variations de taux d'intérêt sur les décisions de consommation et d'épargne."
    ],
    "skills": [
      "Évaluer l'efficacité des politiques économiques visant à influencer la consommation intertemporelle.",
      "Construire des modèles simples de choix intertemporel sous contrainte budgétaire.",
      "Interpréter les résultats des modèles de consommation intertemporelle pour prédire le comportement des ménages."
    ],
    "attitudes": [
      "Développer une approche critique face aux hypothèses des modèles de consommation intertemporelle.",
      "Apprécier la complexité des décisions économiques des ménages sur le long terme.",
      "Adopter une perspective rigoureuse dans l'analyse des implications des politiques macroéconomiques sur le bien-être intergénérationnel."
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