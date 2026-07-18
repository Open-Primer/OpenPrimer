You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théories des organisations",
        "slug": "theories-organisations",
        "level": "Licence 3rd Year",
        "subject": "Sociologie"
      },
      {
        "title": "Concepts fondamentaux de la sociologie des organisations",
        "slug": "concepts-fondamentaux-sociologie-organisations",
        "level": "Licence 3rd Year",
        "subject": "Sociologie"
      },
      {
        "title": "Notion de pouvoir et d'acteur dans les organisations",
        "slug": "notion-pouvoir-acteur-organisations",
        "level": "Licence 3rd Year",
        "subject": "Management"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon l'approche de Crozier et Friedberg, quel concept est central pour comprendre le fonctionnement des organisations?",
    "options": [
      "La structure hiérarchique formelle",
      "La culture d'entreprise et ses valeurs partagées",
      "Le système d'acteurs et les zones d'incertitude",
      "La rationalisation des processus de production"
    ],
    "correctIndex": 2,
    "targetSectionId": "core_concepts_crozier_friedberg",
    "sectionTitle": "Concepts clés de Crozier et Friedberg"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les fondements théoriques de l'analyse stratégique des organisations selon Crozier et Friedberg.",
      "Évaluer la pertinence des concepts de système d'acteurs et de zones d'incertitude dans l'étude des organisations contemporaines.",
      "Distinguer l'approche de Crozier et Friedberg des autres courants de pensée en sociologie des organisations."
    ],
    "skills": [
      "Appliquer la grille d'analyse de Crozier et Friedberg pour décrypter les jeux de pouvoir et les stratégies d'acteurs au sein d'une organisation donnée.",
      "Évaluer l'impact des zones d'incertitude sur la capacité d'une organisation à atteindre ses objectifs.",
      "Concevoir des scénarios d'intervention managériale prenant en compte la rationalité limitée des acteurs et les dynamiques de pouvoir."
    ],
    "attitudes": [
      "Développer une posture réflexive face aux enjeux de pouvoir et aux stratégies individuelles et collectives dans les organisations.",
      "Adopter une approche critique et nuancée des phénomènes organisationnels, au-delà des explications purement rationnelles.",
      "Valoriser la complexité des interactions humaines comme facteur clé de compréhension et de transformation des organisations."
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