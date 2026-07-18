You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_evolution_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "Chronologie simplifiée de l'évolution de la finance stochastique",
      "props": {
        "code": "timeline\n    title Chronologie simplifiée de l'évolution de la finance stochastique\n    section Fondations\n        1900 : Thèse de Bachelier\n        1905 : Travaux d'Einstein sur le mouvement brownien\n    section Développement Moderne\n        1950s : Théorie du portefeuille de Markowitz\n        1960s : Modèle CAPM\n    section Révolution Black-Scholes\n        1973 : Modèle Black-Scholes-Merton\n        1970s-1980s : Expansion des marchés d'options\n    section Au-delà de Black-Scholes\n        1990s : Modèles de volatilité stochastique (Heston)\n        2000s : Modèles de taux d'intérêt (HJM, LMM)\n    section Tendances Actuelles\n        2010s : Machine Learning et IA en finance\n        2020s : Finance quantitative et défis des données massives"
      }
    },
    {
      "id": "bachelier_thesis",
      "componentType": "Image",
      "sectionAnchor": "Page de titre de la thèse de Louis Bachelier, « Théorie de la Spéculation » (1900)",
      "props": {
        "description": "La page de titre de la thèse de doctorat de Louis Bachelier, intitulée « Théorie de la Spéculation », publiée en 1900. Ce document fondateur est considéré comme le premier travail à appliquer des concepts mathématiques avancés, notamment le mouvement brownien, à l'étude des marchés financiers. Il a jeté les bases de la finance stochastique moderne.",
        "title": "Thèse de Louis Bachelier (1900)",
        "year": "1900"
      }
    },
    {
      "id": "bachelier_quote",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Louis Bachelier sur l'imprévisibilité des marchés financiers",
      "props": {
        "quote": "Le passé ne nous renseigne pas sur l'avenir, et la prévision des cours est une chimère.",
        "source": "Louis Bachelier, Théorie de la Spéculation (1900)"
      }
    },
    {
      "id": "black_scholes_formula",
      "componentType": "Image",
      "sectionAnchor": "La formule de Black-Scholes pour la valorisation d'une option d'achat européenne",
      "props": {
        "description": "La formule mathématique de Black-Scholes pour la valorisation d'une option d'achat européenne. Cette équation différentielle partielle, développée par Fischer Black, Myron Scholes et Robert Merton, est devenue la pierre angulaire de la finance quantitative, permettant de calculer le prix théorique des options en fonction de plusieurs variables clés telles que le prix de l'actif sous-jacent, le prix d'exercice, le temps jusqu'à l'échéance, le taux d'intérêt sans risque et la volatilité.",
        "title": "Formule de Black-Scholes",
        "year": "1973"
      }
    },
    {
      "id": "bsm_impact",
      "componentType": "Mermaid",
      "sectionAnchor": "Impact révolutionnaire du modèle Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Modèle Black-Scholes-Merton (1973)] --> B{Valorisation des Options}\n    B --> C[Développement des Marchés Dérivés]\n    C --> D{Gestion des Risques}\n    C --> E{Ingénierie Financière}\n    D --> F[Couverture et Arbitrage]\n    E --> G[Nouveaux Produits Financiers]\n    A --> H[Prix Nobel d'Économie (1997)]\n    H --> I[Reconnaissance Académique et Industrielle]\n    I --> J[Influence sur la Réglementation Financière]"
      }
    },
    {
      "id": "merton_quote",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Robert C. Merton sur l'importance du modèle Black-Scholes",
      "props": {
        "quote": "Le modèle Black-Scholes a transformé la façon dont les marchés financiers fonctionnent, en fournissant un langage commun pour la valorisation des options et la gestion des risques.",
        "source": "Robert C. Merton, Prix Nobel d'Économie (1997)"
      }
    },
    {
      "id": "interest_rate_models_taxonomy",
      "componentType": "Mermaid",
      "sectionAnchor": "Taxonomie simplifiée des principaux modèles de taux d'intérêt",
      "props": {
        "code": "graph TD\n    A[Modèles de Taux d'Intérêt] --> B[Modèles à un Facteur]\n    A --> C[Modèles à Plusieurs Facteurs]\n    A --> D[Modèles de Marché]\n\n    B --> B1[Vasicek (1977)]\n    B --> B2[Cox-Ingersoll-Ross (CIR) (1985)]\n    B --> B3[Hull-White (1990)]\n\n    C --> C1[Longstaff-Schwartz (1992)]\n    C --> C2[Chen (1996)]\n\n    D --> D1[Heath-Jarrow-Morton (HJM) (1992)]\n    D --> D2[Libor Market Model (LMM) (1997)]\n\n    B1 -- Réversion à la moyenne --> B\n    B2 -- Volatilité dépendante du taux --> B\n    B3 -- Extension de Vasicek --> B\n    D1 -- Modélisation de la courbe des taux --> D\n    D2 -- Modélisation des taux forward --> D"
      }
    },
    {
      "id": "volatility_smile",
      "componentType": "Image",
      "sectionAnchor": "Illustration d'un sourire de volatilité typique sur les marchés d'options",
      "props": {
        "description": "Une illustration graphique d'un sourire de volatilité, un phénomène observé sur les marchés d'options où la volatilité implicite des options n'est pas constante pour toutes les strikes et échéances, mais tend à être plus élevée pour les options très hors-de-la-monnaie (OTM) et très dans-la-monnaie (ITM) par rapport aux options à la monnaie (ATM), formant une courbe en forme de sourire ou de 'skew'. Ce phénomène contredit l'hypothèse de volatilité constante du modèle Black-Scholes.",
        "title": "Sourire de Volatilité",
        "year": "2000"
      }
    },
    {
      "id": "model_evolution_post_bsm",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des modèles stochastiques post-Black-Scholes et leurs applications",
      "props": {
        "code": "graph TD\n    A[Modèle Black-Scholes-Merton] --> B{Limitations Observées}\n    B --> C[Sourire de Volatilité]\n    B --> D[Dépendance aux Paramètres]\n\n    C --> E[Modèles de Volatilité Stochastique]\n    E --> E1[Heston (1993)]\n    E --> E2[SABR (2002)]\n\n    D --> F[Modèles de Saut]\n    F --> F1[Merton (1976)]\n    F --> F2[Kou (2002)]\n\n    A --> G[Modèles de Taux d'Intérêt]\n    G --> G1[Vasicek, CIR]\n    G --> G2[HJM, LMM]\n\n    A --> H[Modèles de Crédit]\n    H --> H1[Modèles de Forme Réduite]\n    H --> H2[Modèles Structurels]\n\n    E --> I[Applications: Options Exotiques]\n    F --> I\n    G --> J[Applications: Obligations, Swaps]\n    H --> K[Applications: CDS, CDO]"
      }
    },
    {
      "id": "future_challenges_finance",
      "componentType": "Mermaid",
      "sectionAnchor": "Interconnexion des défis et perspectives en finance stochastique",
      "props": {
        "code": "graph TD\n    A[Finance Stochastique] --> B[Défis Actuels]\n    A --> C[Perspectives Futures]\n\n    B --> B1[Complexité des Marchés]\n    B --> B2[Volatilité Accrue]\n    B --> B3[Réglementation Évolutive]\n    B --> B4[Données Massives et Bruit]\n    B --> B5[Risques Cybernétiques]\n\n    C --> C1[Intelligence Artificielle & ML]\n    C --> C2[Blockchain & Crypto-actifs]\n    C --> C3[Finance Durable & ESG]\n    C --> C4[Modèles Hybrides]\n    C --> C5[Calcul Quantique]\n\n    B1 -- Nécessite --> C4\n    B2 -- Nécessite --> C1\n    B3 -- Influence --> C3\n    B4 -- Alimente --> C1\n    C1 -- Impacte --> B1\n    C2 -- Transforme --> B3\n    C3 -- Guide --> C4"
      }
    },
    {
      "id": "ai_in_finance",
      "componentType": "Image",
      "sectionAnchor": "Illustration de l'intelligence artificielle et du Machine Learning dans la finance",
      "props": {
        "description": "Une illustration conceptuelle représentant l'intégration de l'intelligence artificielle (IA) et du Machine Learning (ML) dans le secteur financier. L'image pourrait montrer des éléments tels que des réseaux neuronaux, des algorithmes d'apprentissage, des graphiques boursiers, des données financières et des symboles technologiques, symbolisant l'utilisation de ces technologies pour l'analyse prédictive, la détection de fraudes, le trading algorithmique et la gestion de portefeuille.",
        "title": "IA et Machine Learning en Finance",
        "year": "2020"
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