You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction au Droit Civil",
        "slug": "introduction-droit-civil",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Droit"
      },
      {
        "title": "Les sources du Droit des obligations",
        "slug": "sources-droit-obligations",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Droit"
      },
      {
        "title": "La notion d'acte juridique et de fait juridique",
        "slug": "notion-acte-fait-juridique",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Droit"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la caractéristique essentielle qui distingue un acte juridique d'un fait juridique en droit français?",
    "options": [
      "L'acte juridique est toujours écrit, contrairement au fait juridique.",
      "L'acte juridique résulte d'une volonté délibérée de produire des effets de droit, tandis que le fait juridique produit des effets de droit indépendamment de la volonté.",
      "Le fait juridique est toujours illicite, alors que l'acte juridique est licite.",
      "L'acte juridique nécessite l'intervention d'un juge pour être valide."
    ],
    "correctIndex": 1,
    "targetSectionId": "section-1-1",
    "sectionTitle": "Distinction entre acte juridique et fait juridique"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les conditions de validité et de formation du contrat en droit français.",
      "Évaluer les différentes classifications des contrats et leurs régimes juridiques spécifiques.",
      "Distinguer les effets juridiques du contrat entre les parties et à l'égard des tiers."
    ],
    "skills": [
      "Appliquer les principes de la théorie générale du contrat à la résolution de cas pratiques.",
      "Rédiger des clauses contractuelles simples en respectant les exigences légales et jurisprudentielles.",
      "Analyser la jurisprudence relative à l'exécution et à l'inexécution des obligations contractuelles."
    ],
    "attitudes": [
      "Développer un esprit critique face aux enjeux éthiques et économiques du droit des contrats.",
      "Adopter une rigueur juridique dans l'interprétation des textes et des situations contractuelles.",
      "Manifester de l'autonomie dans la recherche et l'analyse des sources du droit des contrats."
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