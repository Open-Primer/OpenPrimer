You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction au Droit des Obligations",
        "slug": "introduction-droit-obligations",
        "level": "L1",
        "subject": "Droit Civil"
      },
      {
        "title": "Les Sources des Obligations",
        "slug": "sources-obligations",
        "level": "L1",
        "subject": "Droit Civil"
      },
      {
        "title": "La Responsabilité Civile Contractuelle",
        "slug": "responsabilite-civile-contractuelle",
        "level": "L2",
        "subject": "Droit des Obligations"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Selon le droit français, quelle est la condition fondamentale pour engager la responsabilité civile extracontractuelle d'une personne?",
    "options": [
      "L'existence d'un contrat valide entre les parties.",
      "La preuve d'un dommage, d'un fait générateur et d'un lien de causalité.",
      "Une intention délibérée de nuire de la part de l'auteur du dommage.",
      "Une disposition légale spécifique prévoyant expressément cette responsabilité."
    ],
    "correctIndex": 1,
    "targetSectionId": "principes-fondamentaux-responsabilite-civile",
    "sectionTitle": "Principes Fondamentaux de la Responsabilité Civile"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les conditions de mise en œuvre de la responsabilité civile extracontractuelle (faute, dommage, lien de causalité).",
      "Distinguer les différents régimes de responsabilité du fait personnel, du fait d'autrui et du fait des choses.",
      "Identifier les principaux faits générateurs de responsabilité extracontractuelle."
    ],
    "skills": [
      "Appliquer les règles de la responsabilité civile extracontractuelle à des cas pratiques.",
      "Évaluer la pertinence des arguments juridiques relatifs à l'indemnisation des préjudices.",
      "Rédiger une analyse juridique structurée sur un cas de responsabilité extracontractuelle."
    ],
    "attitudes": [
      "Développer un esprit critique face aux évolutions jurisprudentielles en matière de réparation des dommages.",
      "Adopter une approche rigoureuse dans l'analyse des faits et la qualification juridique des situations.",
      "Reconnaître l'importance de la protection des victimes dans le système de responsabilité civile."
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