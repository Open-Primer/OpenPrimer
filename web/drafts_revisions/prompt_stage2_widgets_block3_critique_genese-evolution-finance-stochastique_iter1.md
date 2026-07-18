You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_evolution_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction à la finance stochastique",
      "props": {
        "code": "timeline\n    title Chronologie simplifiée de l'évolution de la finance stochastique\n    section Fondations\n        1900 : Louis Bachelier - \"Théorie de la Spéculation\" (mouvement brownien en finance)\n    section Expansion\n        1950s : Théorie moderne du portefeuille (Markowitz)\n        1960s : Modèle d'évaluation des actifs financiers (CAPM)\n    section Révolution BSM\n        1973 : Black-Scholes-Merton (valorisation des options)\n        1970s-1980s : Développement des marchés dérivés\n    section Post-BSM\n        1990s : Modèles de taux d'intérêt (Hull-White, HJM, LMM)\n        1990s : Gestion des risques (VaR)\n        2000s : Modèles de volatilité stochastique (Heston)\n        2008 : Crise financière et remise en question des modèles\n    section Tendances Actuelles\n        2010s : Machine Learning et IA en finance\n        2020s : Finance quantitative durable, Big Data"
      }
    },
    {
      "id": "bachelier_thesis",
      "componentType": "Image",
      "sectionAnchor": "## Les fondations historiques: Louis Bachelier",
      "props": {
        "description": "Cette image présente la page de titre de la thèse de doctorat de Louis Bachelier, intitulée « Théorie de la Spéculation », soutenue à la Sorbonne en 1900. Ce document est considéré comme l'acte fondateur de la finance mathématique moderne, introduisant des concepts novateurs tels que le mouvement brownien pour modéliser les prix des actifs financiers et l'idée que les marchés sont imprévisibles.",
        "title": "Thèse de Louis Bachelier (1900)",
        "year": "1900"
      }
    },
    {
      "id": "bachelier_quote",
      "componentType": "Quote",
      "sectionAnchor": "## Les fondations historiques: Louis Bachelier",
      "props": {
        "quote": "Le passé ne donne aucune indication sur l'avenir, et les prix des marchés sont imprévisibles.",
        "source": "Théorie de la Spéculation",
        "year": "1900"
      }
    },
    {
      "id": "black_scholes_formula",
      "componentType": "Image",
      "sectionAnchor": "## Le modèle Black-Scholes-Merton (BSM)",
      "props": {
        "description": "Cette image représente la célèbre formule de Black-Scholes-Merton pour la valorisation d'une option d'achat européenne. La formule relie le prix de l'option à des variables clés telles que le prix actuel de l'actif sous-jacent, le prix d'exercice, le temps jusqu'à l'expiration, le taux d'intérêt sans risque et la volatilité de l'actif. Elle est fondamentale pour la tarification des produits dérivés.",
        "title": "Formule de Black-Scholes",
        "year": "1973"
      }
    },
    {
      "id": "bsm_impact",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le modèle Black-Scholes-Merton (BSM)",
      "props": {
        "code": "graph TD\n    A[Modèle Black-Scholes-Merton (1973)] --> B{Impact Révolutionnaire}\n    B --> C[Valorisation des Options]\n    B --> D[Gestion des Risques]\n    B --> E[Développement des Marchés Dérivés]\n    B --> F[Finance Quantitative]\n    C --> C1[Standardisation des prix]\n    D --> D1[Couverture dynamique]\n    E --> E1[Liquidité accrue]\n    F --> F1[Nouvelles carrières et recherches]\n    F --> F2[Modélisation stochastique]"
      }
    },
    {
      "id": "merton_quote",
      "componentType": "Quote",
      "sectionAnchor": "## Le modèle Black-Scholes-Merton (BSM)",
      "props": {
        "quote": "Le modèle Black-Scholes n'est pas seulement une formule, c'est une nouvelle façon de penser la finance.",
        "source": "Interview ou publication académique (générique)",
        "year": "Années 1990"
      }
    },
    {
      "id": "interest_rate_models_taxonomy",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Au-delà du BSM: Modèles avancés et défis",
      "props": {
        "description": "Cette figure conceptuelle présente une taxonomie simplifiée des principaux modèles de taux d'intérêt utilisés en finance stochastique. Elle catégorise les modèles en fonction de leur approche (par exemple, modèles à un ou plusieurs facteurs, modèles de marché ou de non-arbitrage) et met en évidence des exemples clés comme Vasicek, Cox-Ingersoll-Ross (CIR), Hull-White, Heath-Jarrow-Morton (HJM) et le modèle de marché de Libor (LMM).",
        "title": "Taxonomie des Modèles de Taux d'Intérêt",
        "url": "interest_rate_models_taxonomy",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_taux_d%27int%C3%A9r%C3%AAt",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_taux_d%27int%C3%A9r%C3%AAt"
      }
    },
    {
      "id": "volatility_smile",
      "componentType": "Image",
      "sectionAnchor": "## Au-delà du BSM: Modèles avancés et défis",
      "props": {
        "description": "Cette image illustre un 'sourire de volatilité' typique observé sur les marchés d'options. Il s'agit d'une représentation graphique de la volatilité implicite des options en fonction de leur prix d'exercice (strike price) pour une même date d'expiration. Contrairement à l'hypothèse de volatilité constante du modèle Black-Scholes, le sourire de volatilité montre que les options hors de la monnaie (out-of-the-money) et dans la monnaie (in-the-money) ont souvent des volatilités implicites plus élevées que les options à la monnaie (at-the-money).",
        "title": "Sourire de Volatilité"
      }
    },
    {
      "id": "model_evolution_post_bsm",
      "componentType": "Mermaid",
      "sectionAnchor": "## Au-delà du BSM: Modèles avancés et défis",
      "props": {
        "code": "graph TD\n    A[Modèle BSM (1973)] --> B[Limites identifiées]\n    B --> C[Volatilité non constante]\n    B --> D[Taux d'intérêt stochastiques]\n    B --> E[Sauts et événements extrêmes]\n\n    C --> C1[Modèles de Volatilité Stochastique (Heston, SABR)]\n    D --> D1[Modèles de Taux d'Intérêt (Vasicek, CIR, HJM, LMM)]\n    E --> E1[Modèles à Sauts (Merton, Kou)]\n\n    C1 --> F[Applications: Options exotiques]\n    D1 --> G[Applications: Obligations, Swaps]\n    E1 --> H[Applications: Gestion des risques extrêmes]\n\n    F & G & H --> I[Finance Quantitative Avancée]"
      }
    },
    {
      "id": "future_challenges_finance",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les défis actuels et l'avenir de la finance stochastique",
      "props": {
        "code": "graph TD\n    A[Finance Stochastique] --> B[Défis Actuels]\n    B --> C[Complexité des Marchés]\n    B --> D[Réglementation Accrue]\n    B --> E[Données Massives (Big Data)]\n    B --> F[Changements Climatiques & ESG]\n\n    C --> C1[Modélisation des risques systémiques]\n    D --> D1[Capital réglementaire, Bâle III/IV]\n    E --> E1[Analyse prédictive, Machine Learning]\n    F --> F1[Valorisation des risques climatiques]\n\n    B --> G[Perspectives d'Avenir]\n    G --> G1[IA et Apprentissage Automatique]\n    G --> G2[Finance Décentralisée (DeFi)]\n    G --> G3[Modèles robustes et adaptatifs]\n    G --> G4[Intégration des facteurs ESG]\n\n    G1 --> H[Optimisation des portefeuilles, trading algorithmique]\n    G2 --> I[Nouveaux instruments, smart contracts]\n    G3 --> J[Résilience face aux crises]\n    G4 --> K[Investissement responsable]"
      }
    },
    {
      "id": "ai_in_finance",
      "componentType": "Image",
      "sectionAnchor": "## Les défis actuels et l'avenir de la finance stochastique",
      "props": {
        "description": "Cette image représente de manière conceptuelle l'intégration de l'intelligence artificielle (IA) et du Machine Learning (ML) dans le domaine de la finance. Elle illustre comment des algorithmes avancés peuvent analyser de vastes ensembles de données financières, identifier des motifs complexes, optimiser les stratégies de trading, améliorer la gestion des risques et automatiser les processus, transformant ainsi les pratiques traditionnelles de la finance quantitative.",
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