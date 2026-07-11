You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction au Droit Civil",
        "slug": "introduction-droit-civil",
        "level": "University Year 1",
        "subject": "Droit"
      },
      {
        "title": "Les Sources du Droit",
        "slug": "sources-du-droit",
        "level": "University Year 1",
        "subject": "Droit"
      },
      {
        "title": "Les Personnes et les Biens",
        "slug": "personnes-biens",
        "level": "University Year 1",
        "subject": "Droit"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la caractéristique essentielle qui distingue un contrat d'un simple fait juridique en droit français ?",
    "options": [
      "La présence d'un dommage causé à autrui.",
      "La volonté concordante de deux ou plusieurs parties de produire des effets de droit.",
      "L'intervention systématique d'une autorité publique pour sa formation.",
      "L'existence d'une loi spécifique qui en détermine impérativement toutes les clauses."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-au-contrat",
    "sectionTitle": "Introduction au Contrat"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les conditions de validité et de formation d'un contrat en droit français.",
      "Distinguer les différentes classifications des contrats et leurs régimes juridiques spécifiques.",
      "Expliquer les effets juridiques du contrat entre les parties et à l'égard des tiers."
    ],
    "skills": [
      "Évaluer la validité d'une clause contractuelle au regard des principes fondamentaux du droit des contrats.",
      "Rédiger des clauses contractuelles simples respectant les exigences légales et jurisprudentielles.",
      "Appliquer les règles d'interprétation des contrats pour résoudre des cas pratiques."
    ],
    "attitudes": [
      "Développer une rigueur intellectuelle dans l'analyse des situations contractuelles complexes.",
      "Adopter une approche critique face aux évolutions législatives et jurisprudentielles en matière contractuelle.",
      "Manifester un sens de la responsabilité dans la rédaction et l'exécution des engagements contractuels."
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