You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction au Droit des Obligations",
        "slug": "introduction-droit-obligations",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Droit Civil"
      },
      {
        "title": "La Responsabilité Contractuelle",
        "slug": "responsabilite-contractuelle",
        "level": "University Year 2 / Bachelor 2nd Year (L2)",
        "subject": "Droit des Obligations"
      },
      {
        "title": "Concepts Fondamentaux du Droit Civil",
        "slug": "concepts-fondamentaux-droit-civil",
        "level": "University Year 1 / Bachelor 1st Year (L1)",
        "subject": "Droit Civil"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la condition essentielle pour qu'une personne puisse engager la responsabilité civile extracontractuelle d'une autre personne en droit français?",
    "options": [
      "L'existence d'un contrat non exécuté entre les parties.",
      "La preuve d'un dommage, d'une faute et d'un lien de causalité entre eux.",
      "Une intention de nuire de la part de l'auteur du dommage.",
      "Une décision de justice préalable reconnaissant la faute."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-elements-responsabilite",
    "sectionTitle": "Les éléments constitutifs de la responsabilité civile extracontractuelle"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les éléments constitutifs de la responsabilité civile extracontractuelle (faute, dommage, lien de causalité).",
      "Distinguer les différents types de dommages (matériel, moral, corporel) et leurs modalités de réparation.",
      "Évaluer les faits générateurs de responsabilité (fait personnel, fait d'autrui, fait des choses)."
    ],
    "skills": [
      "Appliquer les principes juridiques de la responsabilité extracontractuelle à des cas pratiques.",
      "Formuler une argumentation juridique relative aux conditions d'indemnisation d'un préjudice.",
      "Critiquer des décisions de jurisprudence concernant l'étendue et les limites de la responsabilité civile."
    ],
    "attitudes": [
      "Adopter une approche rigoureuse et critique dans l'interprétation des textes et de la jurisprudence en matière de responsabilité civile.",
      "Démontrer une curiosité intellectuelle face à l'évolution du droit de la responsabilité extracontractuelle.",
      "Cultiver un sens de la justice et de l'équité dans l'appréciation de la réparation des victimes."
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