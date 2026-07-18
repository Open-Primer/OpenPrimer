You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités de Base",
        "slug": "theorie-probabilites-base",
        "level": "Licence 3ème Année",
        "subject": "Mathématiques"
      },
      {
        "title": "Analyse Réelle et Intégration de Lebesgue",
        "slug": "analyse-reelle-integration-lebesgue",
        "level": "Licence 3ème Année",
        "subject": "Mathématiques"
      },
      {
        "title": "Calcul Différentiel et Intégral",
        "slug": "calcul-differentiel-integral",
        "level": "Licence 2ème Année",
        "subject": "Mathématiques"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Soit (Ω, F, P) un espace de probabilité. Laquelle des affirmations suivantes est FAUSSE concernant la mesure de probabilité P?",
    "options": [
      "P(Ω) = 1",
      "P(A) ≥ 0 pour tout A ∈ F",
      "Si A, B ∈ F et A ∩ B = ∅, alors P(A ∪ B) = P(A) + P(B)",
      "P(∅) > 0"
    ],
    "correctIndex": 3,
    "targetSectionId": "introduction-espaces-probabilite",
    "sectionTitle": "Introduction aux Espaces de Probabilité"
  },
  "learningObjectives": {
    "knowledge": [
      "Décrire les axiomes fondamentaux de la théorie de la mesure et de la probabilité.",
      "Expliquer les concepts de tribu (σ-algèbre), fonction mesurable et intégrale de Lebesgue.",
      "Identifier les propriétés des espaces de probabilité et des variables aléatoires."
    ],
    "skills": [
      "Appliquer les théorèmes de convergence (e.g., convergence dominée, monotone) pour calculer des espérances.",
      "Analyser la mesurabilité de fonctions et d'ensembles dans différents contextes probabilistes.",
      "Évaluer la validité d'un espace de probabilité ou d'une mesure donnée."
    ],
    "attitudes": [
      "Apprécier la rigueur mathématique nécessaire à la modélisation stochastique en finance.",
      "Développer une approche critique face aux hypothèses sous-jacentes aux modèles probabilistes.",
      "Manifester de la persévérance dans la résolution de problèmes complexes impliquant la théorie de la mesure."
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