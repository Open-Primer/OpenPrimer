You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "prob_finance_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Introduction aux concepts fondamentaux",
      "props": {
        "code": "graph TD\n    A[Théorie des Probabilités] --> B(Mesure et Intégration)\n    B --> C{Modélisation Stochastique}\n    C --> D[Finance Quantitative]\n    D --> E(Valorisation d'Actifs)\n    D --> F(Gestion des Risques)\n    D --> G(Optimisation de Portefeuille)\n    A -- Fondement --> D"
      }
    },
    {
      "id": "prob_space_elements",
      "componentType": "Image",
      "sectionAnchor": "Espace de Probabilité",
      "props": {
        "description": "Ce diagramme conceptuel illustre les trois éléments fondamentaux qui constituent un espace de probabilité formel : l'ensemble fondamental (Ω), la tribu ou sigma-algèbre (F), et la mesure de probabilité (P). L'ensemble fondamental représente tous les résultats possibles d'une expérience aléatoire. La tribu est une collection de sous-ensembles de Ω, appelés événements, qui sont mesurables. La mesure de probabilité est une fonction qui assigne une probabilité à chaque événement de la tribu, respectant les axiomes de Kolmogorov.",
        "title": "Les Éléments d'un Espace de Probabilité",
        "year": "2023"
      }
    },
    {
      "id": "types_variables_aleatoires",
      "componentType": "Image",
      "sectionAnchor": "Variables Aléatoires",
      "props": {
        "description": "Ce diagramme de classification présente les différents types de variables aléatoires, distinguant les variables discrètes des variables continues. Pour chaque type, il détaille leurs caractéristiques principales, telles que l'utilisation de fonctions de masse de probabilité (FMP) pour les variables discrètes et de fonctions de densité de probabilité (FDP) pour les variables continues, ainsi que leurs fonctions de répartition cumulatives (FRC) respectives. Il met également en évidence des exemples courants pour chaque catégorie.",
        "title": "Classification des Variables Aléatoires",
        "year": "2023"
      }
    },
    {
      "id": "lebesgue_integral_concept",
      "componentType": "Mermaid",
      "sectionAnchor": "Intégrale de Lebesgue et Espérance",
      "props": {
        "code": "graph TD\n    A[Fonction Simple] --> B(Intégrale de Riemann)\n    B -- Limites --> C[Fonction Mesurable]\n    C --> D(Décomposition en Fonctions Simples)\n    D --> E[Intégrale de Lebesgue]\n    E -- Généralisation --> F(Espérance Mathématique)\n    F -- Précision --> G(Finance Quantitative)"
      }
    },
    {
      "id": "conditional_expectation_info",
      "componentType": "Image",
      "sectionAnchor": "Espérance Conditionnelle",
      "props": {
        "description": "Cette illustration conceptuelle représente l'espérance conditionnelle comme un processus de mise à jour de l'information. Elle montre comment l'information initiale (représentée par une sigma-algèbre plus petite) est raffinée ou augmentée par de nouvelles observations ou connaissances (représentées par une sigma-algèbre plus grande), conduisant à une estimation plus précise de la valeur attendue d'une variable aléatoire. Le diagramme peut utiliser des ensembles imbriqués pour visualiser l'enrichissement de l'information.",
        "title": "Espérance Conditionnelle et Mise à Jour de l'Information",
        "year": "2023"
      }
    },
    {
      "id": "conditional_expectation_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Espérance Conditionnelle",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle est l'interprétation principale de l'espérance conditionnelle E[X|G] ?",
            "options": [
              {
                "text": "La valeur moyenne de X sans aucune information.",
                "correct": false
              },
              {
                "text": "La meilleure estimation de X étant donné l'information contenue dans la sigma-algèbre G.",
                "correct": true
              },
              {
                "text": "La variance de X étant donné G.",
                "correct": false
              },
              {
                "text": "La probabilité que X se produise.",
                "correct": false
              }
            ],
            "explanation": "L'espérance conditionnelle représente la meilleure prédiction d'une variable aléatoire X, basée sur un ensemble d'informations G."
          },
          {
            "q": "Si G est la sigma-algèbre triviale (contenant seulement l'ensemble vide et l'espace entier), alors E[X|G] est égal à :",
            "options": [
              {
                "text": "X elle-même.",
                "correct": false
              },
              {
                "text": "E[X], l'espérance inconditionnelle de X.",
                "correct": true
              },
              {
                "text": "0.",
                "correct": false
              },
              {
                "text": "La variance de X.",
                "correct": false
              }
            ],
            "explanation": "Si l'information est triviale, l'espérance conditionnelle se réduit à l'espérance inconditionnelle, car aucune nouvelle information n'est disponible pour affiner la prédiction."
          },
          {
            "q": "En finance quantitative, pourquoi l'espérance conditionnelle est-elle cruciale pour la valorisation d'options ?",
            "options": [
              {
                "text": "Elle permet de calculer la volatilité des actifs.",
                "correct": false
              },
              {
                "text": "Elle aide à déterminer le prix d'une option en actualisant son payoff futur sous une mesure risque-neutre, en tenant compte des informations disponibles jusqu'à présent.",
                "correct": true
              },
              {
                "text": "Elle est utilisée pour prédire les mouvements de marché avec certitude.",
                "correct": false
              },
              {
                "text": "Elle simplifie le calcul des intégrales de Riemann.",
                "correct": false
              }
            ],
            "explanation": "L'espérance conditionnelle est fondamentale pour la valorisation d'options car elle permet de projeter et d'actualiser les payoffs futurs en intégrant l'information actuelle du marché, sous la mesure risque-neutre."
          }
        ]
      }
    },
    {
      "id": "quant_finance_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Applications en Finance Quantitative",
      "props": {
        "code": "graph TD\n    A[Théorie des Probabilités] --> B(Théorie de la Mesure)\n    B --> C(Processus Stochastiques)\n    C --> D(Calcul Stochastique)\n    D --> E(Espérance Conditionnelle)\n    E --> F(Martingales)\n    F --> G(Changement de Mesure)\n    G --> H[Valorisation d'Options]\n    G --> I[Gestion des Risques]\n    H & I --> J(Finance Quantitative Avancée)"
      }
    },
    {
      "id": "option_pricing_conceptual",
      "componentType": "Image",
      "sectionAnchor": "Applications en Finance Quantitative",
      "props": {
        "description": "Ce diagramme conceptuel illustre le rôle central des probabilités et de l'espérance conditionnelle dans la valorisation des options. Il montre comment le prix d'une option est déterminé par l'espérance de son payoff futur, actualisé et calculé sous une mesure de probabilité risque-neutre. Le diagramme met en évidence l'interdépendance entre les concepts probabilistes, les processus stochastiques sous-jacents (comme le mouvement du prix de l'actif), et le calcul de l'espérance conditionnelle pour arriver à une valorisation juste.",
        "title": "Valorisation d'Options: Rôle des Probabilités et de l'Espérance Conditionnelle",
        "year": "2023"
      }
    },
    {
      "id": "shreve_math_finance",
      "componentType": "Quote",
      "sectionAnchor": "Conclusion",
      "props": {
        "quote": "La finance quantitative est une discipline où les mathématiques ne sont pas seulement un outil, mais le langage même à travers lequel nous comprenons et interagissons avec les marchés.",
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