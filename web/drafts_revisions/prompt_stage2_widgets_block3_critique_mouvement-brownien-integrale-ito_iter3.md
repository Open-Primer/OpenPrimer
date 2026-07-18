You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_objectives_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme des objectifs du cours et de son positionnement en M1",
      "props": {
        "code": "graph TD\n    A[M1 Finance Quantitative] --> B(Module: Calcul Stochastique)\n    B --> C{Objectifs du Cours}\n    C --> D[Comprendre le Mouvement Brownien]\n    C --> E[Maîtriser l'Intégrale d'Itô]\n    C --> F[Appliquer le Lemme d'Itô]\n    C --> G[Résoudre les Équations Différentielles Stochastiques (EDS)]\n    D --> H[Fondations des Modèles Stochastiques]\n    E --> H\n    F --> H\n    G --> H\n    H --> I[Applications en Finance Quantitative]\n    I --> J(Modèles de Prix d'Actifs)\n    I --> K(Gestion des Risques)\n    I --> L(Valorisation d'Options)"
      }
    },
    {
      "id": "simulated_brownian_path",
      "componentType": "Image",
      "sectionAnchor": "## Exemple de trajectoire simulée d'un mouvement brownien standard",
      "props": {
        "description": "Cette image représente une trajectoire unique simulée d'un mouvement brownien standard sur un intervalle de temps donné. Le graphique montre l'évolution aléatoire de la position au fil du temps, caractérisée par des mouvements continus mais non différentiables, illustrant la nature imprévisible et la volatilité inhérente aux processus stochastiques. L'axe des abscisses représente le temps, tandis que l'axe des ordonnées représente la valeur du processus brownien.",
        "title": "Trajectoire d'un Mouvement Brownien",
        "year": "2008"
      }
    },
    {
      "id": "ito_vs_riemann",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Illustration schématique de la différence entre les sommes d'Itô et de Riemann-Stieltjes pour un processus stochastique",
      "props": {
        "description": "Cette figure schématique illustre la distinction fondamentale entre les sommes de Riemann-Stieltjes et les sommes d'Itô dans le contexte de l'intégration de processus stochastiques. Elle met en évidence comment le choix du point d'évaluation de l'intégrande dans chaque sous-intervalle (début pour Itô, n'importe où pour Riemann-Stieltjes) conduit à des propriétés et des résultats différents, notamment en raison de la non-différentiabilité des trajectoires browniennes. La figure montre des rectangles d'approximation pour les deux types d'intégrales superposés sur une trajectoire stochastique.",
        "title": "Comparaison Itô vs Riemann-Stieltjes",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Brownian_motion_simulation.svg/1024px-Brownian_motion_simulation.svg.png",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Int%C3%A9grale_d%27It%C3%B4",
        "year": "2010"
      }
    },
    {
      "id": "ito_integral_concept",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme conceptuel de l'intégrale d'Itô et ses propriétés clés",
      "props": {
        "code": "graph TD\n    A[Intégrale d'Itô] --> B{Définition}\n    B --> C[Intégrale par rapport au Mouvement Brownien]\n    C --> D[Processus Adapté (Non-anticipatif)]\n    D --> E[Sommes d'Itô (Point d'évaluation gauche)]\n    A --> F{Propriétés Clés}\n    F --> G[Isométrie d'Itô]\n    G --> H[E[∫ H_t dB_t] = 0]\n    F --> I[Martingale]\n    I --> J[∫ H_t dB_t est une Martingale]\n    F --> K[Calcul Stochastique]\n    K --> L[Lemme d'Itô (Règle de Chaîne Stochastique)]"
      }
    },
    {
      "id": "ito_lemma_gbm",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Démonstration de l'application du Lemme d'Itô au mouvement brownien géométrique pour obtenir $d(\\ln S_t)$",
      "props": {
        "title": "Application du Lemme d'Itô au Mouvement Brownien Géométrique",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
        "year": "2020"
      }
    },
    {
      "id": "concept_map_stochastic_finance",
      "componentType": "Mermaid",
      "sectionAnchor": "## Carte conceptuelle des liens entre Mouvement Brownien, Intégrale d'Itô, Lemme d'Itô et les EDS en finance stochastique",
      "props": {
        "code": "graph LR\n    A[Mouvement Brownien (MB)] --> B(Processus Stochastique Fondamental)\n    B --> C{Non-différentiable}\n    B --> D{Incréments Gaussiens Indépendants}\n    A --> E[Intégrale d'Itô]\n    E --> F(Intégration par rapport au MB)\n    F --> G{Calcul Stochastique}\n    G --> H[Lemme d'Itô]\n    H --> I(Règle de Chaîne Stochastique)\n    I --> J[Équations Différentielles Stochastiques (EDS)]\n    J --> K(Modélisation de Processus Aléatoires)\n    K --> L[Applications en Finance]\n    L --> M(Modèles de Prix d'Actifs: Black-Scholes)\n    L --> N(Valorisation d'Options Exotiques)\n    L --> O(Gestion des Risques)\n    J --> P(Simulations de Monte Carlo)\n    P --> L"
      }
    },
    {
      "id": "sde_simulation",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Exemple de simulation de trajectoires d'une Équation Différentielle Stochastique",
      "props": {
        "description": "Cette figure présente un ensemble de trajectoires simulées pour une Équation Différentielle Stochastique (EDS) donnée, illustrant la divergence des chemins possibles à partir d'une même condition initiale due à la composante aléatoire. Chaque ligne représente une réalisation différente du processus stochastique au fil du temps, mettant en évidence la nature probabiliste des solutions des EDS. L'image montre comment les méthodes numériques, telles que le schéma d'Euler-Maruyama, sont utilisées pour approximer ces trajectoires.",
        "title": "Simulation de Trajectoires d'EDS",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Brownian_motion_simulation.svg/1024px-Brownian_motion_simulation.svg.png",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_diff%C3%A9rentielle_stochastique",
        "year": "2015"
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