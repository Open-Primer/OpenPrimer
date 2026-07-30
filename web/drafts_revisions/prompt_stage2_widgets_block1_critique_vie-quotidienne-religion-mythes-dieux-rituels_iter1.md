You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à l'Antiquité",
        "slug": "introduction-antiquite",
        "level": "Middle School (secondary_1)",
        "subject": "Histoire"
      },
      {
        "title": "Les grandes civilisations du bassin méditerranéen",
        "slug": "civilisations-mediterraneen",
        "level": "Middle School (secondary_1)",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quel est le nom du roi des dieux dans la mythologie grecque, souvent associé à la foudre et au ciel?",
    "options": [
      "Hadès",
      "Poséidon",
      "Zeus",
      "Apollon"
    ],
    "correctIndex": 2,
    "targetSectionId": "section-1-intro-dieux",
    "sectionTitle": "Introduction aux dieux grecs"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les principales caractéristiques de la religion grecque antique.",
      "Identifier les dieux et déesses majeurs du panthéon grec et leurs attributs.",
      "Expliquer le rôle des mythes dans la société grecque antique."
    ],
    "skills": [
      "Analyser des extraits de mythes grecs pour en dégager les valeurs et les croyances.",
      "Comparer les rituels religieux grecs avec ceux d'autres civilisations antiques.",
      "Situer les lieux de culte importants sur une carte de la Grèce antique."
    ],
    "attitudes": [
      "Apprécier l'importance de la religion et des mythes dans la culture grecque antique.",
      "Développer une curiosité pour les différentes formes de spiritualité à travers l'histoire.",
      "Respecter la diversité des croyances et des pratiques religieuses."
    ]
  }
}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).
4. ZERO placeholders, draft markers (e.g. bracketed text like "[insert]"), or template values are allowed. Reject the block if any text or option contains placeholder words like "Option", "placeholder", "todo", "tbd", "tbc", "lorem", "ipsum", "N/A" (or "n/a"), "## Section Name" or empty strings. All text fields must be fully fleshed out and complete.
5. CRITICAL WIDGET CONNECTION: The diagnosticQuiz must be strongly connected to the lesson's topics, containing actual high-quality educational content with specific parameters and a clear explanation of how the question relates to the prerequisites.

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