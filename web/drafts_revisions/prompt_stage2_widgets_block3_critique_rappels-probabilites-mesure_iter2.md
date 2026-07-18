You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "prob_finance_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction à la finance quantitative",
      "props": {
        "code": "graph TD\n    A[Phénomènes Aléatoires en Finance] --> B{Modélisation Mathématique};\n    B --> C[Théorie des Probabilités];\n    C --> D[Mesure et Intégration];\n    D --> E[Processus Stochastiques];\n    E --> F[Calcul Stochastique];\n    F --> G[Valorisation d'Actifs];\n    F --> H[Gestion des Risques];\n    G & H --> I[Finance Quantitative Avancée];\n    C --> J[Statistiques et Économétrie];\n    J --> H;\n    D --> K[Théorie de la Mesure en Finance];\n    K --> G;\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style C fill:#bbf,stroke:#333,stroke-width:2px\n    style D fill:#bbf,stroke:#333,stroke-width:2px\n    style E fill:#bbf,stroke:#333,stroke-width:2px\n    style F fill:#bbf,stroke:#333,stroke-width:2px\n    style G fill:#ccf,stroke:#333,stroke-width:2px\n    style H fill:#ccf,stroke:#333,stroke-width:2px\n    style I fill:#afa,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "prob_space_elements",
      "componentType": "Image",
      "sectionAnchor": "## Les fondements mathématiques: Espace de probabilité",
      "props": {
        "description": "Ce diagramme illustre les trois éléments fondamentaux qui constituent un espace de probabilité mathématique. Il s'agit de l'ensemble fondamental des résultats possibles (Ω), de la tribu ou sigma-algèbre des événements (F), et de la mesure de probabilité (P) qui attribue une probabilité à chaque événement mesurable. Ces trois composantes sont essentielles pour définir rigoureusement un cadre probabiliste.",
        "title": "Les trois éléments d'un espace de probabilité",
        "year": "2023"
      }
    },
    {
      "id": "types_variables_aleatoires",
      "componentType": "Image",
      "sectionAnchor": "## Variables aléatoires et leurs distributions",
      "props": {
        "description": "Ce diagramme conceptuel classifie les variables aléatoires en deux catégories principales: discrètes et continues. Pour chaque type, il met en évidence leurs caractéristiques distinctives, telles que la fonction de masse de probabilité (FMP) pour les variables discrètes et la fonction de densité de probabilité (FDP) pour les variables continues, ainsi que la fonction de répartition (FDR) commune aux deux. Il illustre également des exemples typiques pour chaque catégorie.",
        "title": "Classification des variables aléatoires",
        "year": "2023"
      }
    },
    {
      "id": "lebesgue_integral_concept",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'espérance mathématique et l'intégrale de Lebesgue",
      "props": {
        "code": "graph TD\n    A[Variable Aléatoire X] --> B{Fonction Mesurable};\n    B --> C[Décomposition en Fonctions Étages Simples];\n    C --> D[Intégrale de Lebesgue pour Fonctions Étages];\n    D --> E[Passage à la Limite];\n    E --> F[Intégrale de Lebesgue Générale];\n    F --> G[Espérance E[X]];\n    G --> H[Valorisation d'Actifs en Finance];\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style C fill:#bbf,stroke:#333,stroke-width:2px\n    style D fill:#bbf,stroke:#333,stroke-width:2px\n    style E fill:#bbf,stroke:#333,stroke-width:2px\n    style F fill:#bbf,stroke:#333,stroke-width:2px\n    style G fill:#ccf,stroke:#333,stroke-width:2px\n    style H fill:#afa,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "conditional_expectation_info",
      "componentType": "Image",
      "sectionAnchor": "## Espérance conditionnelle et filtration",
      "props": {
        "description": "Cette figure illustre le concept de l'espérance conditionnelle comme une mise à jour de l'information disponible. Elle montre comment l'information initiale (représentée par une sigma-algèbre plus petite) est enrichie pour former une nouvelle sigma-algèbre, permettant de raffiner l'estimation de l'espérance d'une variable aléatoire. L'espérance conditionnelle E[X|F] est présentée comme la meilleure estimation de X étant donné l'information contenue dans F.",
        "title": "Espérance conditionnelle et mise à jour de l'information",
        "year": "2023"
      }
    },
    {
      "id": "conditional_expectation_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Espérance conditionnelle et filtration",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle est la propriété fondamentale de l'espérance conditionnelle E[X|F] ?",
            "options": [
              {
                "text": "E[X|F] est une constante.",
                "correct": false
              },
              {
                "text": "E[X|F] est une variable aléatoire mesurable par rapport à F.",
                "correct": true
              },
              {
                "text": "E[X|F] est toujours égale à E[X].",
                "correct": false
              },
              {
                "text": "E[X|F] est indépendante de F.",
                "correct": false
              }
            ],
            "explanation": "L'espérance conditionnelle est une variable aléatoire qui dépend de l'information contenue dans la sigma-algèbre F."
          },
          {
            "q": "Si F est la sigma-algèbre triviale {∅, Ω}, que vaut E[X|F] ?",
            "options": [
              {
                "text": "X",
                "correct": false
              },
              {
                "text": "E[X]",
                "correct": true
              },
              {
                "text": "0",
                "correct": false
              },
              {
                "text": "Indéfinie",
                "correct": false
              }
            ],
            "explanation": "Si F ne contient aucune information utile, l'espérance conditionnelle est simplement l'espérance inconditionnelle E[X]."
          },
          {
            "q": "Dans le contexte de la finance, à quoi correspond souvent la filtration F_t ?",
            "options": [
              {
                "text": "Le prix d'un actif à l'instant t.",
                "correct": false
              },
              {
                "text": "L'ensemble de toutes les informations disponibles jusqu'à l'instant t.",
                "correct": true
              },
              {
                "text": "La valeur future d'une option.",
                "correct": false
              },
              {
                "text": "Le taux d'intérêt sans risque.",
                "correct": false
              }
            ],
            "explanation": "La filtration F_t représente l'ensemble de toutes les informations observables et disponibles sur le marché jusqu'à l'instant t."
          }
        ]
      }
    },
    {
      "id": "quant_finance_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Applications en finance quantitative",
      "props": {
        "code": "graph TD\n    A[Concepts Fondamentaux] --> B[Espace de Probabilité];\n    B --> C[Variables Aléatoires];\n    C --> D[Espérance Mathématique];\n    D --> E[Espérance Conditionnelle];\n    E --> F[Processus Stochastiques];\n    F --> G[Calcul Stochastique (Itô)];\n    G --> H[Modèles de Marché (Black-Scholes)];\n    H --> I[Valorisation d'Options];\n    H --> J[Gestion des Risques];\n    I & J --> K[Finance Quantitative Avancée];\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:2px\n    style C fill:#bbf,stroke:#333,stroke-width:2px\n    style D fill:#bbf,stroke:#333,stroke-width:2px\n    style E fill:#bbf,stroke:#333,stroke-width:2px\n    style F fill:#bbf,stroke:#333,stroke-width:2px\n    style G fill:#bbf,stroke:#333,stroke-width:2px\n    style H fill:#ccf,stroke:#333,stroke-width:2px\n    style I fill:#ccf,stroke:#333,stroke-width:2px\n    style J fill:#ccf,stroke:#333,stroke-width:2px\n    style K fill:#afa,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "option_pricing_conceptual",
      "componentType": "Image",
      "sectionAnchor": "## Applications en finance quantitative",
      "props": {
        "description": "Cette figure représente conceptuellement le rôle central des probabilités et de l'espérance conditionnelle dans la valorisation des options financières. Elle illustre comment les informations disponibles jusqu'à un certain temps (filtration) sont utilisées pour calculer l'espérance des flux de trésorerie futurs de l'option, sous une mesure de probabilité risque-neutre, afin de déterminer son prix actuel. Le diagramme met en évidence l'interconnexion entre la modélisation stochastique des prix d'actifs et les techniques d'évaluation.",
        "title": "Valorisation d'options: rôle des probabilités et de l'espérance conditionnelle",
        "year": "2023"
      }
    },
    {
      "id": "shreve_math_finance",
      "componentType": "Quote",
      "sectionAnchor": "## Conclusion",
      "props": {
        "quote": "La finance quantitative est l'art d'utiliser les mathématiques pour comprendre et gérer les marchés financiers. Sans une base solide en probabilités et en calcul stochastique, il est impossible de saisir les nuances des modèles modernes de valorisation et de gestion des risques.",
        "source": "Steven Shreve"
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