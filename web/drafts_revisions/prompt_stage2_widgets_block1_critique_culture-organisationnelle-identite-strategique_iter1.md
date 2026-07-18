You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à la Sociologie des Organisations",
        "slug": "intro-sociologie-organisations",
        "level": "Licence 3",
        "subject": "Sociologie"
      },
      {
        "title": "Fondamentaux du Management Stratégique",
        "slug": "fondamentaux-management-strategique",
        "level": "Master 1",
        "subject": "Management"
      },
      {
        "title": "Théories de la Culture d'Entreprise",
        "slug": "theories-culture-entreprise",
        "level": "Licence 3",
        "subject": "Gestion"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est le rôle principal de la culture organisationnelle dans la mise en œuvre d'une stratégie d'entreprise?",
    "options": [
      "Définir les structures hiérarchiques et les processus opérationnels.",
      "Influencer les comportements des employés et l'alignement avec les objectifs stratégiques.",
      "Gérer les budgets financiers et les investissements à long terme.",
      "Établir les normes de conformité réglementaire et juridique."
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-1",
    "sectionTitle": "Introduction à la Culture Organisationnelle"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les théories et modèles fondamentaux de la culture organisationnelle.",
      "Évaluer l'interdépendance entre la culture organisationnelle et l'identité stratégique.",
      "Distinguer les différentes typologies de cultures d'entreprise et leurs implications managériales."
    ],
    "skills": [
      "Développer des outils d'analyse pour diagnostiquer la culture d'une organisation.",
      "Élaborer des stratégies d'alignement culturel pour soutenir les objectifs stratégiques.",
      "Concevoir des interventions pour transformer ou renforcer la culture organisationnelle."
    ],
    "attitudes": [
      "Adopter une approche critique face aux défis de la gestion du changement culturel.",
      "Valoriser l'importance de la diversité culturelle comme levier stratégique.",
      "Faire preuve de leadership pour promouvoir une culture organisationnelle éthique et performante."
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