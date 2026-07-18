You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "market_volatility",
      "componentType": "Image",
      "sectionAnchor": "## Introduction au Calcul Stochastique",
      "props": {
        "alt": "Graphique stylisé montrant des fluctuations irrégulières et imprévisibles, représentant la volatilité des marchés financiers.",
        "caption": "*Représentation stylisée de la volatilité des marchés financiers, illustrant les mouvements imprévisibles des prix des actifs qui nécessitent des outils mathématiques stochastiques pour leur modélisation.*",
        "description": "Cette image représente de manière stylisée la volatilité des marchés financiers. On y voit une série temporelle fluctuante, symbolisant les variations imprévisibles des prix des actifs. Les pics et les creux abrupts illustrent les périodes de forte volatilité, tandis que les phases plus lisses représentent des marchés plus calmes. Cette visualisation aide à comprendre la nature non déterministe des mouvements de marché, qui est au cœur de l'étude du calcul stochastique en finance.",
        "searchQuery": "market volatility stylized graph",
        "title": "Volatilité des Marchés Financiers"
      }
    },
    {
      "id": "classical_vs_stochastic_calculus",
      "componentType": "Mermaid",
      "sectionAnchor": "## Calcul Classique vs. Calcul Stochastique",
      "props": {
        "code": "graph TD\n    A[Calcul Classique] --> B{Variables Déterministes};\n    B --> C[Fonctions Lisses];\n    C --> D[Dérivées Uniques];\n    D --> E[Règle de la Chaîne Standard];\n    E --> F[Applications: Physique, Ingénierie];\n\n    G[Calcul Stochastique] --> H{Variables Aléatoires};\n    H --> I[Processus Stochastiques];\n    I --> J[Différentielles Stochastiques];\n    J --> K[Formule d'Itô (avec terme de correction)];\n    K --> L[Applications: Finance Quantitative, Biologie];\n\n    B -- \"Absence de Bruit\" --> H;\n    C -- \"Présence de Bruit\" --> I;\n    D -- \"Non-différentiabilité\" --> J;\n    E -- \"Terme de Correction\" --> K;"
      }
    },
    {
      "id": "brownian_path",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Le Mouvement Brownien",
      "props": {
        "alt": "Graphique montrant une ligne irrégulière et fluctuante représentant une trajectoire de mouvement brownien.",
        "caption": "*Exemple d'une trajectoire simulée d'un mouvement brownien standard, illustrant la nature aléatoire et continue des processus stochastiques fondamentaux en finance.*",
        "description": "Une illustration graphique d'une trajectoire simulée d'un mouvement brownien standard, montrant les fluctuations aléatoires et continues au fil du temps. L'axe des abscisses représente le temps, et l'axe des ordonnées représente la position de la particule. La trajectoire est caractérisée par sa continuité mais non-différentiabilité, reflétant la nature imprévisible des processus stochastiques.",
        "title": "Trajectoire d'un Mouvement Brownien"
      }
    },
    {
      "id": "ito_vs_classical_chain_rule",
      "componentType": "Mermaid",
      "sectionAnchor": "## La Formule d'Itô: Le Cœur du Calcul Stochastique",
      "props": {
        "code": "graph TD\n    subgraph Règle de la Chaîne Classique\n        A[Fonction f(t, x)] --> B{dx = g(t)dt};\n        B --> C[df = (∂f/∂t)dt + (∂f/∂x)dx];\n        C --> D[df = (∂f/∂t)dt + (∂f/∂x)g(t)dt];\n        D --> E[Pas de Terme de Correction];\n    end\n\n    subgraph Formule d'Itô\n        F[Fonction f(t, X_t)] --> G{dX_t = μ(t, X_t)dt + σ(t, X_t)dW_t};\n        G --> H[df = (∂f/∂t)dt + (∂f/∂X)dX_t + (1/2)(∂²f/∂X²)(dX_t)²];\n        H --> I[Substituer dX_t et (dX_t)² = σ²dt];\n        I --> J[df = (∂f/∂t + μ(∂f/∂X) + (1/2)σ²(∂²f/∂X²))dt + σ(∂f/∂X)dW_t];\n        J --> K[Terme de Correction: (1/2)σ²(∂²f/∂X²)];\n    end\n\n    E -- \"Différence Clé\" --> K;"
      }
    },
    {
      "id": "ito_intuition_variance",
      "componentType": "CustomFigure",
      "sectionAnchor": "## La Formule d'Itô: Le Cœur du Calcul Stochastique",
      "props": {
        "alt": "Diagramme conceptuel illustrant comment les fluctuations aléatoires (variance) dans un processus stochastique mènent à un terme de correction dans la formule d'Itô.",
        "caption": "*Illustration intuitive du rôle crucial de la variance dans la formule d'Itô, expliquant pourquoi un terme de correction est nécessaire pour les fonctions de processus stochastiques.*",
        "description": "Une illustration conceptuelle montrant comment les fluctuations aléatoires, caractérisées par la variance du processus stochastique sous-jacent, génèrent un terme de correction non nul dans la formule d'Itô. Le diagramme pourrait représenter des petits incréments de temps et les contributions de la dérive et de la diffusion, soulignant que la contribution de la diffusion au carré (variance) ne s'annule pas à la limite comme dans le calcul classique.",
        "title": "Rôle de la Variance dans la Formule d'Itô"
      }
    },
    {
      "id": "gbm_derivation",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Applications de la Formule d'Itô en Finance Quantitative",
      "props": {
        "title": "Dérivation du Mouvement Brownien Géométrique (MBG) via la formule d'Itô",
        "year": "2023-10-27T10:00:00Z"
      }
    },
    {
      "id": "black_scholes_framework",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Applications de la Formule d'Itô en Finance Quantitative",
      "props": {
        "alt": "Diagramme de flux montrant les intrants et l'extrant du modèle de Black-Scholes pour l'évaluation des options.",
        "caption": "*Schéma conceptuel du modèle de Black-Scholes, détaillant les intrants nécessaires et l'extrant (prix de l'option) pour une compréhension claire de son fonctionnement.*",
        "description": "Un schéma conceptuel du modèle de Black-Scholes pour l'évaluation des options, illustrant les principaux intrants (prix de l'actif sous-jacent, prix d'exercice, temps jusqu'à l'échéance, volatilité, taux d'intérêt sans risque) et l'extrant (prix de l'option). Le diagramme met en évidence la relation entre ces variables et la formule, soulignant le rôle central de la volatilité et du temps.",
        "title": "Schéma du Modèle de Black-Scholes"
      }
    },
    {
      "id": "ito_applications_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Applications de la Formule d'Itô en Finance Quantitative",
      "props": {
        "code": "graph TD\n    A[Formule d'Itô] --> B{Modélisation des Actifs Financiers};\n    B --> C[Mouvement Brownien Géométrique (MBG)];\n    C --> D[Évaluation des Options (Black-Scholes)];\n    D --> E[Gestion des Risques (VaR, ES)];\n    E --> F[Optimisation de Portefeuille];\n\n    A --> G{Calcul Stochastique en Général};\n    G --> H[Processus de Diffusion];\n    H --> I[Équations Différentielles Stochastiques (EDS)];\n    I --> J[Modèles de Taux d'Intérêt (Vasicek, CIR)];\n    J --> K[Modèles de Crédit (Merton)];\n\n    B --> L[Dérivés Exotiques];\n    L --> M[Options Asiatiques, Barrière];\n    M --> N[Calibration des Modèles];"
      }
    },
    {
      "id": "hull_ito_importance",
      "componentType": "Quote",
      "sectionAnchor": "## Conclusion et Perspectives",
      "props": {
        "author": "John C. Hull",
        "quote": "The mathematics of stochastic processes, particularly Itô's Lemma, is fundamental to understanding and modeling financial markets. Without it, much of modern quantitative finance would not exist.",
        "source": "Options, Futures, and Other Derivatives"
      }
    },
    {
      "id": "ito_multidim_example",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Exercices Pratiques",
      "props": {
        "title": "Application du Lemme d'Itô Multidimensionnel",
        "year": "2023-10-27T10:00:00Z"
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