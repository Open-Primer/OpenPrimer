You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
{
  "prerequisites": {
    "items": [
      {
        "title": "Théorie des Probabilités Avancée",
        "slug": "theorie-probabilites-avancee",
        "level": "Licence 3 / Master 1",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Introduction aux Processus Stochastiques",
        "slug": "introduction-processus-stochastiques",
        "level": "Licence 3 / Master 1",
        "subject": "Mathématiques Appliquées"
      },
      {
        "title": "Calcul Différentiel et Intégral",
        "slug": "calcul-differentiel-integral",
        "level": "Licence 2 / Licence 3",
        "subject": "Mathématiques"
      }
    ]
  },
  "diagnosticQuiz": {
    "question": "Quelle est la propriété fondamentale qui distingue le mouvement brownien standard d'un processus de Lévy général ?",
    "options": [
      "Il a des accroissements stationnaires et indépendants.",
      "Ses trajectoires sont continues presque sûrement.",
      "Sa variance est proportionnelle au temps.",
      "Il est un processus de Markov."
    ],
    "correctIndex": 1,
    "targetSectionId": "introduction-mouvement-brownien",
    "sectionTitle": "Introduction au Mouvement Brownien"
  },
  "learningObjectives": {
    "knowledge": [
      "Analyser les propriétés fondamentales des équations différentielles stochastiques (EDS) et leur lien avec les processus de diffusion.",
      "Évaluer les conditions d'existence et d'unicité des solutions d'EDS, notamment le théorème de Picard-Lindelöf stochastique.",
      "Créer des modèles stochastiques simples pour représenter des phénomènes financiers ou physiques en utilisant des EDS."
    ],
    "skills": [
      "Appliquer le calcul d'Itô pour dériver des EDS et transformer des processus stochastiques.",
      "Résoudre des EDS linéaires et certaines classes d'EDS non linéaires par des méthodes analytiques ou numériques.",
      "Évaluer la stabilité et le comportement asymptotique des solutions d'EDS."
    ],
    "attitudes": [
      "Développer une approche critique envers la modélisation stochastique en reconnaissant ses limites et ses hypothèses.",
      "Adopter une rigueur mathématique dans la formulation et la résolution des problèmes impliquant des EDS.",
      "Collaborer efficacement pour interpréter les résultats des simulations d'EDS dans des contextes appliqués."
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