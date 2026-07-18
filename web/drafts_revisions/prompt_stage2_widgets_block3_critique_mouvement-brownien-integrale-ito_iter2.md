You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_objectives_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction au Cours",
      "props": {
        "code": "graph TD\n    A[Objectifs du Cours M1] --> B{Comprendre les Fondamentaux};\n    B --> C1[Mouvement Brownien];\n    B --> C2[Intégrale d'Itô];\n    B --> C3[Lemme d'Itô];\n    B --> C4[Équations Différentielles Stochastiques (EDS)];\n    C1 --> D[Modélisation des Processus Stochastiques];\n    C2 --> D;\n    C3 --> D;\n    C4 --> D;\n    D --> E[Applications en Finance Stochastique];\n    E --> F[Valorisation d'Options];\n    E --> G[Gestion des Risques];\n    E --> H[Modèles de Taux d'Intérêt];\n    F --> I[Positionnement en M1];\n    G --> I;\n    H --> I;\n    I --> J[Préparation aux Carrières Quantitatives];"
      }
    },
    {
      "id": "simulated_brownian_path",
      "componentType": "Image",
      "sectionAnchor": "## Mouvement Brownien Standard",
      "props": {
        "description": "Cette image présente une trajectoire simulée d'un mouvement brownien standard unidimensionnel. Le graphique montre l'évolution de la position d'une particule au fil du temps, caractérisée par des mouvements aléatoires continus et non-différentiables. La trajectoire débute à l'origine (temps 0, position 0) et illustre la nature imprévisible mais statistiquement régulière du processus, avec des fluctuations qui augmentent en amplitude à mesure que le temps s'écoule, reflétant la variance proportionnelle au temps.",
        "title": "Trajectoire de Mouvement Brownien Simulé",
        "year": "2023"
      }
    },
    {
      "id": "ito_vs_riemann",
      "componentType": "Image",
      "sectionAnchor": "## L'Intégrale d'Itô",
      "props": {
        "description": "Cette illustration schématique compare les approches de sommation de Riemann-Stieltjes et d'Itô pour un processus stochastique. Le diagramme met en évidence la différence cruciale dans le choix du point d'évaluation de la fonction intégrée au sein de chaque intervalle de temps. Pour l'intégrale de Riemann-Stieltjes, le point est souvent choisi au milieu ou à la fin de l'intervalle, tandis que pour l'intégrale d'Itô, le point est systématiquement choisi au début de l'intervalle, ce qui est essentiel pour préserver la propriété de martingale de l'intégrale et gérer la non-différentiabilité des processus stochastiques comme le mouvement brownien.",
        "title": "Comparaison Itô et Riemann-Stieltjes",
        "year": "2023"
      }
    },
    {
      "id": "ito_integral_concept",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'Intégrale d'Itô",
      "props": {
        "code": "graph TD\n    A[Intégrale d'Itô] --> B{Définition};\n    B --> C[Intégrale par rapport à un Mouvement Brownien];\n    C --> D[Processus Stochastique Intégrable];\n    D --> E[Propriétés Clés];\n    E --> F[Isométrie d'Itô];\n    E --> G[Propriété de Martingale];\n    E --> H[Non-Commutativité];\n    F --> I[Calcul de la Variance];\n    G --> J[Absence d'Anticipation];\n    H --> K[Différence avec Calcul Ordinaire];\n    K --> L[Lemme d'Itô];\n    L --> M[Changement de Variables pour Processus Stochastiques];"
      }
    },
    {
      "id": "ito_lemma_gbm",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Le Lemme d'Itô et ses Applications",
      "props": {
        "title": "Application du Lemme d'Itô au Mouvement Brownien Géométrique",
        "year": "2023"
      }
    },
    {
      "id": "concept_map_stochastic_finance",
      "componentType": "Mermaid",
      "sectionAnchor": "## Synthèse et Applications en Finance Stochastique",
      "props": {
        "code": "graph LR\n    A[Mouvement Brownien] --> B[Processus Stochastiques];\n    B --> C[Intégrale d'Itô];\n    C --> D[Lemme d'Itô];\n    D --> E[Équations Différentielles Stochastiques (EDS)];\n    E --> F[Modélisation des Actifs Financiers];\n    F --> G[Modèle de Black-Scholes];\n    F --> H[Valorisation d'Options];\n    F --> I[Gestion des Risques];\n    A --> J[Propriétés: Martingale, Variation Quadratique];\n    C --> K[Calcul Stochastique];\n    D --> L[Changement de Variables];\n    E --> M[Simulation de Trajectoires];\n    G --> H;\n    H --> I;\n    J --> B;\n    K --> D;\n    L --> E;\n    M --> F;"
      }
    },
    {
      "id": "sde_simulation",
      "componentType": "Image",
      "sectionAnchor": "## Équations Différentielles Stochastiques (EDS)",
      "props": {
        "description": "Cette figure présente un ensemble de trajectoires simulées pour une Équation Différentielle Stochastique (EDS) typique, telle que celle modélisant le prix d'un actif financier. Chaque ligne représente une réalisation différente du processus stochastique, partant d'une même condition initiale mais divergeant en raison de la composante aléatoire (bruit brownien). Le graphique illustre la variabilité inhérente aux systèmes stochastiques et la manière dont les simulations Monte Carlo sont utilisées pour explorer l'éventail des résultats possibles.",
        "title": "Simulation de Trajectoires d'EDS",
        "year": "2023"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.