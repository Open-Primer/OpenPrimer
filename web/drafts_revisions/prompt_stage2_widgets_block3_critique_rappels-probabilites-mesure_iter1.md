You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "prob_finance_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme conceptuel de l'importance des probabilités et de la mesure en finance quantitative",
      "props": {
        "code": "graph TD\n    A[Théorie des Probabilités] --> B(Mesure et Intégration);\n    B --> C{Espaces de Probabilité};\n    C --> D[Variables Aléatoires];\n    D --> E(Espérance Conditionnelle);\n    E --> F[Processus Stochastiques];\n    F --> G(Modélisation Financière);\n    G --> H[Valorisation d'Options];\n    G --> I[Gestion des Risques];\n    H & I --> J(Finance Quantitative);"
      }
    },
    {
      "id": "prob_space_elements",
      "componentType": "Image",
      "sectionAnchor": "Les trois éléments constitutifs d'un espace de probabilité",
      "props": {
        "description": "Ce diagramme illustre les trois éléments fondamentaux qui constituent un espace de probabilité: l'ensemble fondamental (Ω), la tribu ou sigma-algèbre (F), et la mesure de probabilité (P). L'ensemble fondamental représente tous les résultats possibles d'une expérience aléatoire. La tribu est une collection d'événements (sous-ensembles de Ω) pour lesquels une probabilité peut être définie. La mesure de probabilité est une fonction qui attribue une probabilité à chaque événement de la tribu, respectant les axiomes de Kolmogorov.",
        "title": "Éléments d'un Espace de Probabilité",
        "year": "2023"
      }
    },
    {
      "id": "types_variables_aleatoires",
      "componentType": "Image",
      "sectionAnchor": "Classification des variables aléatoires et leurs caractéristiques principales",
      "props": {
        "description": "Ce schéma conceptuel catégorise les variables aléatoires en types discrets et continus, en soulignant leurs caractéristiques distinctives. Les variables aléatoires discrètes prennent un nombre fini ou dénombrable de valeurs, souvent représentées par des fonctions de masse de probabilité (FMP) et des fonctions de répartition (FR). Les variables aléatoires continues peuvent prendre n'importe quelle valeur dans un intervalle, caractérisées par des fonctions de densité de probabilité (FDP) et des fonctions de répartition (FR). Le diagramme met en évidence les propriétés clés de chaque type, telles que la somme des probabilités égale à un pour les discrètes et l'intégrale de la densité égale à un pour les continues, ainsi que leur rôle dans la modélisation des phénomènes aléatoires.",
        "title": "Classification des Variables Aléatoires",
        "year": "2023"
      }
    },
    {
      "id": "lebesgue_integral_concept",
      "componentType": "Mermaid",
      "sectionAnchor": "Représentation conceptuelle de l'intégrale de Lebesgue pour le calcul de l'espérance",
      "props": {
        "code": "graph TD\n    A[Fonction f(x)] --> B{Découpage de l'axe Y};\n    B --> C[Intervalles de Valeurs];\n    C --> D[Mesure de l'Ensemble {x | f(x) ∈ Intervalle}];\n    D --> E[Somme des (Valeur * Mesure)];\n    E --> F(Intégrale de Lebesgue);\n    F --> G[Calcul de l'Espérance E[X]];\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#ccf,stroke:#333,stroke-width:2px\n    style C fill:#ccf,stroke:#333,stroke-width:2px\n    style D fill:#ccf,stroke:#333,stroke-width:2px\n    style E fill:#ccf,stroke:#333,stroke-width:2px\n    style F fill:#9cf,stroke:#333,stroke-width:2px\n    style G fill:#f9f,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "conditional_expectation_info",
      "componentType": "Image",
      "sectionAnchor": "Interprétation de l'espérance conditionnelle comme une mise à jour de l'information disponible",
      "props": {
        "description": "Ce diagramme illustre l'interprétation de l'espérance conditionnelle comme un processus de mise à jour de l'information. Initialement, nous avons une espérance inconditionnelle basée sur toutes les informations possibles. Lorsqu'une nouvelle information (représentée par une sigma-algèbre ou un événement) devient disponible, l'espérance conditionnelle ajuste cette prédiction en intégrant la nouvelle connaissance. Cela réduit l'incertitude et affine l'estimation de la variable aléatoire, reflétant une meilleure compréhension du système après l'observation de nouvelles données.",
        "title": "Espérance Conditionnelle et Mise à Jour de l'Information",
        "year": "2023"
      }
    },
    {
      "id": "conditional_expectation_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Quiz sur l'Espérance Conditionnelle",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle est l'interprétation fondamentale de l'espérance conditionnelle E[X|Y] ?",
            "options": [
              {
                "text": "La valeur moyenne de X, sans tenir compte de Y.",
                "correct": false
              },
              {
                "text": "La meilleure prédiction de X, connaissant la valeur de Y.",
                "correct": true
              },
              {
                "text": "La probabilité que X soit égale à Y.",
                "correct": false
              },
              {
                "text": "La variance de X, étant donné Y.",
                "correct": false
              }
            ],
            "explanation": "L'espérance conditionnelle est la meilleure estimation de la valeur d'une variable aléatoire X, une fois que l'on connaît la valeur d'une autre variable aléatoire Y."
          },
          {
            "q": "Parmi les propriétés suivantes de l'espérance conditionnelle, lesquelles sont vraies ? (Sélectionnez toutes les réponses correctes)",
            "options": [
              {
                "text": "E[c|Y] = c pour toute constante c.",
                "correct": true
              },
              {
                "text": "E[X+Z|Y] = E[X|Y] + E[Z|Y].",
                "correct": true
              },
              {
                "text": "E[X|Y] est toujours une constante numérique.",
                "correct": false
              },
              {
                "text": "Si X et Y sont indépendantes, alors E[X|Y] = E[X].",
                "correct": true
              }
            ],
            "explanation": "L'espérance conditionnelle est linéaire, l'espérance conditionnelle d'une constante est la constante elle-même, et si les variables sont indépendantes, l'information sur Y n'apporte rien sur X."
          },
          {
            "q": "Dans le contexte de la finance quantitative, pourquoi l'espérance conditionnelle est-elle cruciale pour la valorisation d'options ?",
            "options": [
              {
                "text": "Elle permet de calculer la volatilité historique d'un actif.",
                "correct": false
              },
              {
                "text": "Elle modélise la valeur future d'un actif en tenant compte des informations disponibles jusqu'à un certain temps.",
                "correct": true
              },
              {
                "text": "Elle est utilisée pour déterminer le prix d'exercice d'une option.",
                "correct": false
              },
              {
                "text": "Elle simplifie le calcul des probabilités de défaut.",
                "correct": false
              }
            ],
            "explanation": "L'espérance conditionnelle est fondamentale pour la valorisation d'options car elle permet d'estimer la valeur future attendue des flux de trésorerie de l'option, en intégrant toutes les informations pertinentes disponibles jusqu'au moment de l'évaluation."
          }
        ]
      }
    },
    {
      "id": "quant_finance_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux des concepts fondamentaux vers la finance quantitative avancée",
      "props": {
        "code": "graph TD\n    A[Probabilités Fondamentales] --> B(Théorie de la Mesure);\n    B --> C[Espaces de Probabilité];\n    C --> D[Variables Aléatoires];\n    D --> E[Espérance Conditionnelle];\n    E --> F[Martingales];\n    F --> G[Calcul Stochastique];\n    G --> H[Équations Différentielles Stochastiques (EDS)];\n    H --> I[Modèles de Marché (Black-Scholes, Heston)];\n    I --> J[Valorisation d'Instruments Dérivés];\n    J --> K[Gestion de Portefeuille et Risque];\n    K --> L(Finance Quantitative Avancée);"
      }
    },
    {
      "id": "option_pricing_conceptual",
      "componentType": "Image",
      "sectionAnchor": "Représentation conceptuelle du rôle des probabilités et de l'espérance conditionnelle dans la valorisation d'options",
      "props": {
        "description": "Ce diagramme conceptuel illustre comment les probabilités et l'espérance conditionnelle sont intégrées dans le processus de valorisation d'options. Il commence par la modélisation du mouvement du prix de l'actif sous-jacent à l'aide de processus stochastiques, souvent dans un cadre de probabilité risque-neutre. L'espérance conditionnelle est ensuite appliquée pour calculer la valeur future attendue des flux de trésorerie de l'option, en tenant compte de l'information disponible à chaque étape. Enfin, cette valeur future est actualisée au présent pour obtenir le prix de l'option, reflétant ainsi l'incertitude et les informations du marché.",
        "title": "Probabilités et Espérance Conditionnelle en Valorisation d'Options",
        "year": "2023"
      }
    },
    {
      "id": "shreve_math_finance",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Steven Shreve sur l'importance des mathématiques en finance quantitative",
      "props": {
        "quote": "La finance quantitative est l'art d'utiliser les mathématiques pour comprendre et gérer les marchés financiers. Sans une base solide en théorie des probabilités et en calcul stochastique, il est impossible de saisir les nuances des modèles modernes.",
        "source": "Steven E. Shreve, Stochastic Calculus for Finance II: Continuous-Time Models",
        "text": "La finance quantitative est l'art d'utiliser les mathématiques pour comprendre et gérer les marchés financiers. Sans une base solide en théorie des probabilités et en calcul stochastique, il est impossible de saisir les nuances des modèles modernes.",
        "title": "L'importance des mathématiques en finance quantitative",
        "year": "2004"
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