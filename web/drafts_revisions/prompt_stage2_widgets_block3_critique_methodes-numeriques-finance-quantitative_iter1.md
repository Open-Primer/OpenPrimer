You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "intro_num_methods_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Flux de travail des méthodes numériques en finance",
      "props": {
        "code": "graph TD\n A[Définition du Problème Financier] --> B{Modélisation Mathématique};\n B --> C{Choix de la Méthode Numérique};\n C --> D[Implémentation du Modèle];\n D --> E[Calibration et Validation];\n E --> F[Analyse et Interprétation des Résultats];\n F --> G[Prise de Décision Financière];\n C -- Monte Carlo --> H[Simulation de Trajectoires];\n C -- Différences Finies --> I[Discrétisation d'EDP];\n C -- Arbres Binomiaux --> J[Construction d'Arbres];"
      }
    },
    {
      "id": "monte_carlo_paths",
      "componentType": "Image",
      "sectionAnchor": "## Exemple de trajectoires de prix d'actif simulées par Monte Carlo",
      "props": {
        "description": "Graphique illustrant plusieurs trajectoires de prix d'un actif financier simulées à l'aide de la méthode de Monte Carlo. Chaque ligne représente une évolution possible du prix de l'actif au fil du temps, partant d'un même point initial et divergeant en fonction de la volatilité et de la dérive stochastique. Ces simulations sont fondamentales pour la valorisation d'options exotiques et la gestion des risques.",
        "title": "Trajectoires de prix Monte Carlo",
        "year": "2023"
      }
    },
    {
      "id": "monte_carlo_european_call",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Valorisation d'une option call européenne par Monte Carlo",
      "props": {
        "title": "Valorisation d'une option call européenne par Monte Carlo",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Monte_Carlo_option_model",
        "year": "2023"
      }
    },
    {
      "id": "black_scholes_pde",
      "componentType": "Image",
      "sectionAnchor": "## Représentation de l'équation de Black-Scholes, une EDP parabolique fondamentale en finance quantitative.",
      "props": {
        "description": "L'image présente l'équation différentielle partielle de Black-Scholes, une formule clé pour la valorisation des options. Cette EDP parabolique décrit l'évolution du prix d'une option au fil du temps en fonction du prix de l'actif sous-jacent, du temps, du taux sans risque et de la volatilité. Elle est exprimée comme $\\frac{\\partial V}{\\partial t} + rS\\frac{\\partial V}{\\partial S} + \\frac{1}{2}\\sigma^2S^2\\frac{\\partial^2 V}{\\partial S^2} - rV = 0$, où V est le prix de l'option, S le prix de l'actif, t le temps, r le taux sans risque et σ la volatilité.",
        "title": "Équation de Black-Scholes",
        "year": "2023"
      }
    },
    {
      "id": "fdm_european_call",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Implémentation d'un schéma explicite pour une option call européenne",
      "props": {
        "title": "Implémentation d'un schéma explicite pour une option call européenne",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Finite_difference_method",
        "year": "2023"
      }
    },
    {
      "id": "mc_fdm_comparison",
      "componentType": "ComparisonSlider",
      "sectionAnchor": "## Comparaison des méthodes Monte Carlo et Différences Finies",
      "props": {
        "title": "Comparaison des méthodes Monte Carlo et Différences Finies",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Numerical_methods_for_option_pricing",
        "year": "2023"
      }
    },
    {
      "id": "mc_fdm_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Quiz sur les méthodes de Monte Carlo et les différences finies",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle méthode numérique est généralement plus adaptée pour valoriser des options dépendantes du chemin (path-dependent options) ?",
            "options": [
              {
                "text": "Méthodes de Monte Carlo",
                "correct": true
              },
              {
                "text": "Méthodes aux Différences Finies",
                "correct": false
              },
              {
                "text": "Arbres Binomiaux",
                "correct": false
              },
              {
                "text": "Formules analytiques de Black-Scholes",
                "correct": false
              }
            ],
            "explanation": "Les méthodes de Monte Carlo simulent directement les trajectoires de prix, ce qui les rend idéales pour les options dont le payoff dépend de l'historique du prix de l'actif."
          },
          {
            "q": "Quel est un avantage majeur des méthodes de Monte Carlo par rapport aux méthodes aux différences finies pour les problèmes de haute dimension ?",
            "options": [
              {
                "text": "Convergence plus rapide avec l'augmentation de la dimensionnalité",
                "correct": true
              },
              {
                "text": "Moins de complexité de mise en œuvre",
                "correct": false
              },
              {
                "text": "Garantie d'une solution exacte",
                "correct": false
              },
              {
                "text": "Nécessite moins de puissance de calcul",
                "correct": false
              }
            ],
            "explanation": "La convergence des méthodes de Monte Carlo est moins sensible à la dimensionnalité du problème (ordre de 1/sqrt(N)), contrairement aux méthodes aux différences finies dont la complexité augmente exponentiellement avec la dimension."
          },
          {
            "q": "Quel est un inconvénient principal des méthodes aux différences finies pour la valorisation d'options ?",
            "options": [
              {
                "text": "Difficulté à gérer les options dépendantes du chemin",
                "correct": true
              },
              {
                "text": "Faible précision pour les options européennes",
                "correct": false
              },
              {
                "text": "Incapacité à modéliser la volatilité stochastique",
                "correct": false
              },
              {
                "text": "Temps de calcul excessif pour les problèmes de basse dimension",
                "correct": false
              }
            ],
            "explanation": "Les méthodes aux différences finies sont moins adaptées pour les options dont le payoff dépend de l'historique complet du prix de l'actif, car elles se concentrent sur la valeur de l'option à un instant t et un prix S donnés."
          }
        ]
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