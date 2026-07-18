You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_evolution_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "Chronologie simplifiée de l'évolution de la finance stochastique",
      "props": {
        "code": "graph TD\n    A[1900: Louis Bachelier] --> B[Théorie de la Spéculation];\n    B --> C[Mouvement Brownien en finance];\n    C --> D[1950s-1960s: Développement des processus stochastiques];\n    D --> E[1973: Black-Scholes-Merton];\n    E --> F[Valorisation des options];\n    F --> G[1980s-1990s: Modèles de taux d'intérêt];\n    G --> H[Modèles de volatilité stochastique];\n    H --> I[2000s-Présent: Finance computationnelle];\n    I --> J[Machine Learning en finance];"
      }
    },
    {
      "id": "bachelier_thesis",
      "componentType": "Image",
      "sectionAnchor": "Page de titre de la thèse de Louis Bachelier, « Théorie de la Spéculation » (1900)",
      "props": {
        "description": "La page de titre de la thèse de doctorat de Louis Bachelier, intitulée « Théorie de la Spéculation », soutenue en 1900 à la Sorbonne. Ce document est considéré comme l'un des premiers travaux à appliquer des concepts mathématiques avancés, notamment le mouvement brownien, à l'étude des marchés financiers, jetant ainsi les bases de la finance stochastique moderne. La page présente le titre, l'auteur, l'université et la date de soutenance.",
        "title": "Thèse de Louis Bachelier (1900)",
        "year": "1900"
      }
    },
    {
      "id": "bachelier_quote",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Louis Bachelier sur l'imprévisibilité des marchés financiers",
      "props": {
        "quote": "Le passé ne donne aucune indication sur l'avenir, et le marché est un lieu où les espérances se rencontrent et se neutralisent.",
        "source": "Louis Bachelier, Théorie de la Spéculation (1900)",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Louis_Bachelier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Louis_Bachelier"
      }
    },
    {
      "id": "black_scholes_formula",
      "componentType": "Image",
      "sectionAnchor": "La formule de Black-Scholes pour la valorisation d'une option d'achat européenne",
      "props": {
        "description": "La formule de Black-Scholes est une équation mathématique utilisée pour estimer le prix théorique d'une option d'achat européenne. Elle prend en compte plusieurs variables clés : le prix actuel de l'actif sous-jacent, le prix d'exercice de l'option, le temps restant jusqu'à l'expiration, le taux d'intérêt sans risque et la volatilité de l'actif sous-jacent. Cette formule a révolutionné la valorisation des produits dérivés et la gestion des risques financiers.",
        "title": "Formule de Black-Scholes",
        "year": "1973"
      }
    },
    {
      "id": "bsm_impact",
      "componentType": "Mermaid",
      "sectionAnchor": "Impact révolutionnaire du modèle Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Modèle Black-Scholes-Merton] --> B{Révolution en finance};\n    B --> C[Valorisation des options];\n    B --> D[Gestion des risques];\n    B --> E[Développement des marchés dérivés];\n    C --> C1[Standardisation];\n    D --> D1[Couverture dynamique];\n    E --> E1[Innovation financière];\n    B --> F[Recherche académique];\n    F --> F1[Nouveaux modèles stochastiques];"
      }
    },
    {
      "id": "merton_quote",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Robert C. Merton sur l'importance du modèle Black-Scholes",
      "props": {
        "quote": "Le modèle Black-Scholes n'est pas seulement une formule, c'est une façon de penser la finance.",
        "source": "Robert C. Merton",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Robert_C._Merton",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Robert_C._Merton"
      }
    },
    {
      "id": "interest_rate_models_taxonomy",
      "componentType": "Image",
      "sectionAnchor": "Taxonomie simplifiée des principaux modèles de taux d'intérêt",
      "props": {
        "description": "Une taxonomie simplifiée des principaux modèles de taux d'intérêt utilisés en finance stochastique. Cette illustration catégorise les modèles en fonction de leurs propriétés clés, telles que le nombre de facteurs, la présence de sauts, ou la capacité à calibrer la courbe des taux. Elle met en évidence les relations entre les modèles classiques comme Vasicek, CIR, et les cadres plus avancés comme HJM ou Libor Market Models, soulignant leur évolution et leurs applications spécifiques dans la modélisation des produits de taux.",
        "title": "Taxonomie des Modèles de Taux d'Intérêt"
      }
    },
    {
      "id": "volatility_smile",
      "componentType": "Image",
      "sectionAnchor": "Illustration d'un sourire de volatilité typique sur les marchés d'options",
      "props": {
        "description": "Une illustration graphique d'un sourire de volatilité, un phénomène observé sur les marchés d'options où la volatilité implicite des options varie en fonction de leur prix d'exercice (strike) et de leur maturité, formant une courbe non plate, souvent en forme de 'sourire' ou de 'skew'. Ce graphique montre typiquement une volatilité implicite plus élevée pour les options hors de la monnaie (out-of-the-money) et dans la monnaie (in-the-money) par rapport aux options à la monnaie (at-the-money), contredisant l'hypothèse de volatilité constante du modèle Black-Scholes.",
        "title": "Sourire de Volatilité"
      }
    },
    {
      "id": "model_evolution_post_bsm",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des modèles stochastiques post-Black-Scholes et leurs applications",
      "props": {
        "code": "graph TD\n    A[Modèle Black-Scholes-Merton] --> B[Limites identifiées];\n    B --> C[Sourire de volatilité];\n    B --> D[Volatilité stochastique];\n    D --> D1[Modèles Heston, SABR];\n    C --> E[Modèles de taux d'intérêt];\n    E --> E1[Vasicek, CIR, Heath-Jarrow-Morton];\n    A --> F[Modèles de saut];\n    F --> F1[Merton, Kou];\n    A --> G[Modèles de calibration];\n    G --> G1[Calibration aux données de marché];\n    H[Applications modernes] --> I[Produits exotiques];\n    H --> J[Gestion de portefeuille];\n    H --> K[Analyse de risque];"
      }
    },
    {
      "id": "future_challenges_finance",
      "componentType": "Mermaid",
      "sectionAnchor": "Interconnexion des défis et perspectives en finance stochastique",
      "props": {
        "code": "graph TD\n    A[Finance Stochastique] --> B{Défis Actuels};\n    B --> C[Volatilité Extrême];\n    B --> D[Données Massives (Big Data)];\n    B --> E[Réglementation Complexe];\n    B --> F[Cybersécurité];\n    B --> G[IA & Machine Learning];\n    C --> C1[Modèles robustes];\n    D --> D1[Algorithmes efficaces];\n    E --> E1[Conformité];\n    F --> F1[Sécurité des transactions];\n    G --> G1[Optimisation, Prédiction];\n    B --> H{Perspectives Futures};\n    H --> I[Finance Durable];\n    H --> J[Blockchain & DeFi];\n    H --> K[Finance Comportementale];\n    H --> L[Modèles hybrides];"
      }
    },
    {
      "id": "ai_in_finance",
      "componentType": "Image",
      "sectionAnchor": "Illustration de l'intelligence artificielle et du Machine Learning dans la finance",
      "props": {
        "description": "Une illustration conceptuelle représentant l'intégration de l'intelligence artificielle (IA) et du Machine Learning (ML) dans le domaine de la finance. L'image peut montrer des éléments visuels tels que des réseaux neuronaux, des graphiques de données, des algorithmes complexes et des symboles financiers, suggérant l'application de ces technologies pour l'analyse prédictive, la gestion des risques, le trading algorithmique, la détection de fraude et la personnalisation des services financiers. Elle symbolise la convergence entre la technologie de pointe et les marchés financiers.",
        "title": "IA et Machine Learning en Finance"
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