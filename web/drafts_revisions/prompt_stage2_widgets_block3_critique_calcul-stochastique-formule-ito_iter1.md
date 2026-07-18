You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "market_volatility",
      "componentType": "Image",
      "sectionAnchor": "## Introduction au Calcul Stochastique en Finance",
      "props": {
        "description": "Cette image représente de manière stylisée la volatilité des marchés financiers. On y voit une ligne sinueuse et irrégulière, symbolisant les fluctuations imprévisibles des prix des actifs au fil du temps. Les pics et les creux abrupts illustrent les périodes de forte volatilité, tandis que les segments plus lisses indiquent des phases de relative stabilité. L'ensemble met en évidence la nature non déterministe et chaotique des mouvements de marché, nécessitant des outils mathématiques spécifiques pour leur modélisation.",
        "title": "Volatilité des Marchés Financiers",
        "year": "2023"
      }
    },
    {
      "id": "classical_vs_stochastic_calculus",
      "componentType": "Mermaid",
      "sectionAnchor": "## Calcul Classique vs. Calcul Stochastique",
      "props": {
        "code": "graph TD\n    A[Calcul Classique] --> B{Variables Déterministes}\n    B --> C[Fonctions Lisses et Prévisibles]\n    C --> D[Dérivées et Intégrales Standards]\n    D --> E[Applications: Physique, Ingénierie]\n\n    F[Calcul Stochastique] --> G{Variables Aléatoires}\n    G --> H[Processus Stochastiques (ex: Mouvement Brownien)]\n    H --> I[Dérivées et Intégrales d'Itô]\n    I --> J[Applications: Finance Quantitative, Biologie]\n\n    K[Différence Clé] --> L{Terme de Correction d'Itô}\n    L --> M[Prise en compte de la variance des fluctuations aléatoires]"
      }
    },
    {
      "id": "brownian_path",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Le Mouvement Brownien et ses Propriétés",
      "props": {
        "description": "Cette figure illustre une trajectoire simulée d'un mouvement brownien standard. La courbe montre un chemin aléatoire continu, caractérisé par des changements de direction imprévisibles et une absence de mémoire. Chaque point de la trajectoire est le résultat d'une accumulation de petits pas aléatoires, reflétant la nature stochastique du processus. La figure met en évidence la non-différentiabilité du mouvement brownien, un aspect fondamental qui le distingue des fonctions lisses du calcul classique.",
        "title": "Trajectoire d'un Mouvement Brownien",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien",
        "year": "2023"
      }
    },
    {
      "id": "ito_vs_classical_chain_rule",
      "componentType": "Mermaid",
      "sectionAnchor": "## La Formule d'Itô: Le Cœur du Calcul Stochastique",
      "props": {
        "code": "graph TD\n    subgraph Règle de la Chaîne Classique\n        A[df = f'(X)dX] --> B[Pour X déterministe]\n    end\n\n    subgraph Formule d'Itô\n        C[df = f'(X)dX + 1/2 f''(X)(dX)^2] --> D[Pour X processus stochastique]\n        D --> E[Terme de Correction d'Itô]\n        E --> F[dX = μdt + σdW]\n        F --> G[(dX)^2 = (σdW)^2 = σ^2dt]\n        G --> H[df = f'(X)(μdt + σdW) + 1/2 f''(X)σ^2dt]\n    end\n\n    B -- Comparaison --> D\n    E -- Ajout Fondamental --> A"
      }
    },
    {
      "id": "ito_intuition_variance",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Comprendre le Terme de Correction d'Itô",
      "props": {
        "description": "Cette illustration intuitive démontre le rôle crucial de la variance dans la formule d'Itô. Elle représente une fonction non linéaire (par exemple, une parabole) et superpose des fluctuations aléatoires (mouvement brownien) autour d'un point. Contrairement au calcul classique où les petites variations s'annulent en moyenne pour une fonction lisse, les fluctuations aléatoires dans un processus stochastique, lorsqu'elles sont élevées au carré (variance), ne s'annulent pas et génèrent un terme de correction non nul. Ce terme est essentiel pour capturer l'impact cumulatif de la volatilité sur la valeur de la fonction.",
        "title": "Intuition du Terme de Correction d'Itô",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
        "year": "2023"
      }
    },
    {
      "id": "gbm_derivation",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Applications de la Formule d'Itô en Finance",
      "props": {
        "title": "Dérivation du Mouvement Brownien Géométrique (MBG) via la formule d'Itô",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien_g%C3%A9om%C3%A9trique",
        "year": "2023"
      }
    },
    {
      "id": "black_scholes_framework",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Le Modèle de Black-Scholes et Itô",
      "props": {
        "description": "Ce schéma conceptuel présente le cadre du modèle de Black-Scholes pour l'évaluation des options. Il illustre les principaux intrants du modèle, tels que le prix actuel de l'actif sous-jacent, le prix d'exercice, le temps jusqu'à l'échéance, le taux d'intérêt sans risque et la volatilité. Le schéma montre comment ces intrants sont traités par l'équation de Black-Scholes, qui est elle-même dérivée en utilisant la formule d'Itô, pour produire les extrants, à savoir le prix théorique de l'option (call ou put).",
        "title": "Cadre du Modèle de Black-Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "year": "2023"
      }
    },
    {
      "id": "ito_applications_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Applications Avancées et Limites",
      "props": {
        "code": "graph TD\n    A[Formule d'Itô] --> B{Modélisation des Actifs Financiers}\n    B --> C[Mouvement Brownien Géométrique (MBG)]\n    C --> D[Évaluation d'Options (Black-Scholes)]\n    C --> E[Modèles de Taux d'Intérêt (Vasicek, CIR)]\n\n    B --> F{Gestion des Risques}\n    F --> G[Calcul du VaR Stochastique]\n    F --> H[Couverture de Portefeuille]\n\n    B --> I{Optimisation de Portefeuille}\n    I --> J[Stratégies d'Investissement Dynamiques]\n\n    D --> K[Produits Dérivés Exotiques]\n    E --> L[Obligations Convertibles]\n\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style D fill:#ccf,stroke:#333,stroke-width:2px\n    style E fill:#ccf,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "hull_ito_importance",
      "componentType": "Quote",
      "sectionAnchor": "## Conclusion: L'Héritage d'Itô",
      "props": {
        "quote": "Le calcul stochastique, et en particulier le lemme d'Itô, est la pierre angulaire de la finance quantitative moderne. Sans lui, la modélisation des prix des actifs et l'évaluation des produits dérivés seraient impossibles.",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/John_Hull_(finance)",
        "year": "2006"
      }
    },
    {
      "id": "ito_multidim_example",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Exercices Pratiques",
      "props": {
        "title": "Application du Lemme d'Itô Multidimensionnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4#G%C3%A9n%C3%A9ralisation_multidimensionnelle",
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