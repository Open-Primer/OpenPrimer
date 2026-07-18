You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "intro_num_methods_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux de travail des méthodes numériques en finance",
      "props": {
        "code": "graph TD\n    A[Problème Financier] --> B{Modélisation Mathématique};\n    B --> C{Choix de la Méthode Numérique};\n    C --> D[Implémentation Algorithmique];\n    D --> E[Exécution et Calcul];\n    E --> F{Analyse des Résultats};\n    F --> G[Décision Financière];"
      }
    },
    {
      "id": "monte_carlo_paths",
      "componentType": "CustomFigure",
      "sectionAnchor": "Exemple de trajectoires de prix d'actif simulées par Monte Carlo",
      "props": {
        "description": "Ce graphique illustre plusieurs trajectoires de prix d'un actif financier simulées à l'aide de la méthode de Monte Carlo. Chaque ligne représente une évolution possible du prix de l'actif au fil du temps, partant d'un prix initial commun et divergeant en fonction de la volatilité et de la dérive stochastique. Ces simulations sont fondamentales pour la valorisation d'options exotiques ou la gestion des risques, car elles permettent d'explorer un large éventail de scénarios futurs.",
        "title": "Trajectoires de Prix Monte Carlo",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo_en_finance",
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
        "year": "2023"
      }
    },
    {
      "id": "black_scholes_pde",
      "componentType": "Image",
      "sectionAnchor": "Représentation de l'équation de Black-Scholes, une EDP parabolique fondamentale en finance quantitative.",
      "props": {
        "description": "Cette image présente l'équation aux dérivées partielles (EDP) de Black-Scholes, une formule fondamentale en finance quantitative pour la valorisation des options. L'équation décrit l'évolution du prix d'une option au fil du temps en fonction du prix de l'actif sous-jacent, de sa volatilité, du taux d'intérêt sans risque et du temps. C'est une EDP parabolique qui ne contient pas de termes liés aux préférences de risque des investisseurs, ce qui est une caractéristique clé de la valorisation sans arbitrage.",
        "title": "Équation de Black-Scholes",
        "year": "1973"
      }
    },
    {
      "id": "fdm_european_call",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Implémentation d'un schéma explicite pour une option call européenne",
      "props": {
        "title": "Implémentation d'un schéma explicite pour une option call européenne",
        "year": "2023"
      }
    },
    {
      "id": "mc_fdm_comparison",
      "componentType": "ComparisonSlider",
      "sectionAnchor": "Comparaison des méthodes numériques",
      "props": {
        "title": "Comparaison Monte Carlo vs. Différences Finies",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo_en_finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9thode_de_Monte-Carlo_en_finance",
        "year": "2023"
      }
    },
    {
      "id": "mc_fdm_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Quiz sur les méthodes numériques",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Sur quel principe repose principalement la méthode de Monte Carlo pour la valorisation d'options?",
            "options": [
              {
                "text": "Résolution d'équations aux dérivées partielles.",
                "correct": false
              },
              {
                "text": "Simulation de trajectoires aléatoires du prix de l'actif.",
                "correct": true
              },
              {
                "text": "Calcul de la moyenne des payoffs futurs sans actualisation.",
                "correct": false
              },
              {
                "text": "Utilisation de formules analytiques fermées.",
                "correct": false
              }
            ],
            "explanation": "La méthode de Monte Carlo simule un grand nombre de trajectoires de prix pour estimer le payoff moyen."
          },
          {
            "q": "Quelle méthode est généralement plus adaptée pour valoriser une option américaine en raison de sa capacité à gérer l'exercice anticipé?",
            "options": [
              {
                "text": "Monte Carlo.",
                "correct": false
              },
              {
                "text": "Différences Finies.",
                "correct": true
              },
              {
                "text": "Formule de Black-Scholes.",
                "correct": false
              },
              {
                "text": "Méthode des arbres binomiaux.",
                "correct": false
              }
            ],
            "explanation": "Les différences finies, comme les arbres binomiaux, permettent une rétro-propagation qui gère naturellement l'exercice anticipé."
          },
          {
            "q": "Quel est un inconvénient majeur de la méthode de Monte Carlo par rapport aux méthodes déterministes pour les options européennes simples?",
            "options": [
              {
                "text": "Sa complexité d'implémentation.",
                "correct": false
              },
              {
                "text": "Sa convergence lente (en √N).",
                "correct": true
              },
              {
                "text": "Son incapacité à gérer la volatilité.",
                "correct": false
              },
              {
                "text": "Elle ne peut pas être parallélisée.",
                "correct": false
              }
            ],
            "explanation": "La convergence de Monte Carlo est proportionnelle à 1/√N, ce qui la rend plus lente que les méthodes déterministes pour atteindre une précision donnée."
          }
        ]
      }
    },
    {
      "id": "numerical_methods_roadmap",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des méthodes numériques en finance",
      "props": {
        "code": "timeline\n    title Évolution des Méthodes Numériques en Finance\n    section Débuts\n        1973 : Black-Scholes (Formule analytique)\n        1979 : Cox-Ross-Rubinstein (Arbres Binomiaux)\n    section Expansion\n        1980s : Monte Carlo (Valorisation d'options complexes)\n        1990s : Différences Finies (EDP, options américaines)\n    section Modernisation\n        2000s : Méthodes spectrales, éléments finis\n        2010s : Machine Learning en finance quantitative\n    section Futur\n        2020s : Calcul quantique, IA avancée"
      }
    },
    {
      "id": "wilmott_future_quant",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Paul Wilmott sur l'avenir de la finance quantitative",
      "props": {
        "quote": "La finance quantitative est un domaine en constante évolution. Ceux qui ne s'adaptent pas aux nouvelles méthodes et technologies seront laissés pour compte.",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Paul_Wilmott",
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