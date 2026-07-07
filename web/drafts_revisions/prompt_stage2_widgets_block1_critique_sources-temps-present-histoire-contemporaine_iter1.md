You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Introduction à l'histoire générale",
        "slug": "introduction-histoire-generale",
        "level": "Lycée / Baccalauréat",
        "subject": "Histoire"
      },
      {
        "title": "Méthodologie de l'histoire",
        "slug": "methodologie-histoire",
        "level": "Lycée / Baccalauréat",
        "subject": "Histoire"
      },
      {
        "title": "Les grandes périodes de l'histoire",
        "slug": "grandes-periodes-histoire",
        "level": "Lycée / Baccalauréat",
        "subject": "Histoire"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la principale caractéristique qui distingue l'Histoire contemporaine des périodes historiques précédentes, selon la plupart des historiens?",
    "options": [
      "L'absence de sources écrites fiables.",
      "La prédominance des récits oraux comme unique source.",
      "La proximité temporelle avec le présent et l'abondance des sources variées.",
      "L'étude exclusive des civilisations antiques et médiévales."
    ],
    "correctIndex": 2,
    "targetSectionId": "definition-histoire-contemporaine",
    "sectionTitle": "Définition de l'Histoire contemporaine"
  },
  "learningObjectives": {
    "knowledge": [
      "Expliquer les différentes approches de la périodisation de l'Histoire contemporaine.",
      "Décrire les enjeux épistémologiques liés à la définition de l'Histoire contemporaine.",
      "Identifier les principales sources et méthodes spécifiques à l'étude de l'Histoire contemporaine."
    ],
    "skills": [
      "Analyser les débats historiographiques concernant les débuts et les limites de l'Histoire contemporaine.",
      "Évaluer la pertinence de différentes définitions de l'Histoire contemporaine au regard de contextes historiques variés.",
      "Formuler une problématique de recherche pertinente sur un sujet d'Histoire contemporaine."
    ],
    "attitudes": [
      "Développer une curiosité intellectuelle pour les enjeux mémoriels et les interprétations du passé récent.",
      "Adopter une posture critique face aux discours sur l'actualité et leur historicisation.",
      "Valoriser la complexité des processus historiques et la pluralité des perspectives."
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