You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "intro_num_methods_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux de travail des méthodes numériques en finance",
      "props": {
        "code": "graph TD\n    A[Problème Financier] --> B{Modélisation Mathématique};\n    B --> C{Choix de la Méthode Numérique};\n    C --> D[Implémentation Algorithmique];\n    D --> E[Exécution et Calcul];\n    E --> F{Analyse des Résultats};\n    F --> G[Validation et Interprétation];\n    G --> H[Décision Financière];\n    C -- Monte Carlo --> C1[Simulation de Trajectoires];\n    C -- Différences Finies --> C2[Discrétisation de l'EDP];\n    C -- Éléments Finis --> C3[Approximation par Éléments];\n    C -- Arbres Binomiaux --> C4[Construction de l'Arbre];"
      }
    },
    {
      "id": "monte_carlo_paths",
      "componentType": "CustomFigure",
      "sectionAnchor": "Exemple de trajectoires de prix d'actif simulées par Monte Carlo",
      "props": {
        "title": "Trajectoires de Prix d'Actif par Monte Carlo",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo_en_finance",
        "year": "2023"
      }
    },
    {
      "id": "monte_carlo_european_call",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Valorisation d'une option call européenne par Monte Carlo",
      "props": {
        "title": "Valorisation d'une option call européenne par Monte Carlo",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo_en_finance",
        "year": "2023"
      }
    },
    {
      "id": "black_scholes_pde",
      "componentType": "Image",
      "sectionAnchor": "Représentation de l'équation de Black-Scholes, une EDP parabolique fondamentale en finance quantitative.",
      "props": {
        "description": "Cette image représente l'équation aux dérivées partielles (EDP) de Black-Scholes, un modèle mathématique fondamental pour la valorisation des options. Elle décrit l'évolution du prix d'une option au fil du temps en fonction de variables telles que le prix de l'actif sous-jacent, le temps restant jusqu'à l'expiration, la volatilité, le taux d'intérêt sans risque et le dividende. L'équation est une EDP parabolique qui ne dépend pas des préférences de risque des investisseurs, ce qui est une caractéristique clé de la valorisation sans arbitrage.",
        "title": "Équation de Black-Scholes",
        "year": "2023"
      }
    },
    {
      "id": "fdm_european_call",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Implémentation d'un schéma explicite pour une option call européenne",
      "props": {
        "title": "Implémentation d'un schéma explicite pour une option call européenne",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9thode_des_diff%C3%A9rences_finies",
        "year": "2023"
      }
    },
    {
      "id": "mc_fdm_comparison",
      "componentType": "ComparisonSlider",
      "sectionAnchor": "Comparaison des Méthodes Numériques",
      "props": {
        "title": "Comparaison Monte Carlo vs. Différences Finies",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo_en_finance",
        "year": "2023"
      }
    },
    {
      "id": "mc_fdm_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Comparaison des Méthodes Numériques",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle méthode est généralement plus efficace pour les options de style américain?",
            "options": [
              {
                "text": "Méthodes de Monte Carlo",
                "correct": false
              },
              {
                "text": "Méthodes aux Différences Finies",
                "correct": true
              },
              {
                "text": "Arbres Binomiaux",
                "correct": false
              }
            ],
            "explanation": "Les méthodes aux différences finies sont bien adaptées aux options américaines car elles peuvent gérer la décision d'exercice anticipé à chaque pas de temps."
          },
          {
            "q": "Quel est l'avantage principal des méthodes de Monte Carlo pour la valorisation d'options?",
            "options": [
              {
                "text": "Elles sont très rapides pour les options simples.",
                "correct": false
              },
              {
                "text": "Elles gèrent facilement les chemins de dépendance complexes et les dimensions élevées.",
                "correct": true
              },
              {
                "text": "Elles fournissent toujours une solution exacte.",
                "correct": false
              }
            ],
            "explanation": "Monte Carlo excelle dans la gestion des options dépendantes du chemin et des problèmes de haute dimensionnalité."
          },
          {
            "q": "Les méthodes aux différences finies sont-elles adaptées pour les modèles multi-actifs?",
            "options": [
              {
                "text": "Oui, sans aucune limitation.",
                "correct": false
              },
              {
                "text": "Non, elles sont limitées aux modèles à un seul actif.",
                "correct": false
              },
              {
                "text": "Oui, mais elles souffrent de la malédiction de la dimensionnalité.",
                "correct": true
              }
            ],
            "explanation": "Bien que possibles, les méthodes aux différences finies deviennent très coûteuses en calcul et en mémoire pour les modèles multi-actifs en raison de la malédiction de la dimensionnalité."
          }
        ]
      }
    },
    {
      "id": "numerical_methods_roadmap",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des méthodes numériques en finance",
      "props": {
        "code": "timeline\n    title Évolution des Méthodes Numériques en Finance Quantitative\n    section Débuts (Pré-1970s)\n        1900s : Premiers calculs actuariels\n        1950s : Méthodes numériques rudimentaires\n    section Ère Black-Scholes (1970s-1980s)\n        1973 : Modèle Black-Scholes (formule analytique)\n        1977 : Arbres Binomiaux (Cox, Ross, Rubinstein)\n        1980s : Début des Différences Finies pour EDP\n    section Expansion (1990s-2000s)\n        1990s : Monte Carlo pour options exotiques\n        1990s : Méthodes de Monte Carlo Quasi-aléatoires\n        2000s : Éléments Finis et méthodes spectrales\n    section Modernisation (2010s-Présent)\n        2010s : Calcul parallèle et GPU\n        2010s : Machine Learning en finance quantitative\n        2020s : Calcul Quantique (recherche)\n"
      }
    },
    {
      "id": "wilmott_future_quant",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Paul Wilmott sur l'avenir de la finance quantitative",
      "props": {
        "quote": "La finance quantitative est un domaine en constante évolution. Ceux qui s'accrochent aux vieilles méthodes seront laissés pour compte. L'avenir est à l'adaptabilité et à l'intégration de nouvelles techniques, notamment issues de l'apprentissage automatique et du calcul haute performance.",
        "source": "Paul Wilmott, 'Paul Wilmott on Quantitative Finance'",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Paul_Wilmott",
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