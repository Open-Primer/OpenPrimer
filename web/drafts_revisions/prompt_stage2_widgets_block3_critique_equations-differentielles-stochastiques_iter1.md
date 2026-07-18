You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "brownian_motion_path",
      "componentType": "Image",
      "sectionAnchor": "## Mouvement Brownien et Intégrale d'Itô",
      "props": {
        "description": "Cette image représente une trajectoire simulée d'un mouvement brownien standard unidimensionnel. Elle illustre la nature aléatoire et continue du processus, caractérisée par des fluctuations imprévisibles et une absence de dérivabilité en tout point. La trajectoire ne présente pas de direction privilégiée et ses incréments sont indépendants et stationnaires.",
        "title": "Trajectoire de Mouvement Brownien",
        "year": "2007"
      }
    },
    {
      "id": "eds_components",
      "componentType": "Mermaid",
      "sectionAnchor": "## Structure Générale des EDS",
      "props": {
        "code": "graph TD\n    A[Équation Différentielle Stochastique (EDS)] --> B{Composantes Clés}\n    B --> C[Terme de Dérive (Drift)]\n    B --> D[Terme de Diffusion (Diffusion)]\n    B --> E[Mouvement Brownien (Processus de Wiener)]\n\n    C -- \"Détermine la tendance déterministe\" --> F[Fonction f(t, X_t)]\n    D -- \"Détermine l'amplitude de la volatilité stochastique\" --> G[Fonction g(t, X_t)]\n    E -- \"Source d'aléatoire, incréments gaussiens\" --> H[dW_t]\n\n    F & G & H -- \"Combinés dans l'EDS\" --> I[dX_t = f(t, X_t)dt + g(t, X_t)dW_t]"
      }
    },
    {
      "id": "eds_existence_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Existence et Unicité des Solutions d'EDS",
      "props": {
        "code": "graph TD\n    A[Conditions d'Existence et d'Unicité des Solutions d'EDS] --> B{Fonctions f et g}\n    B --> C{Condition de Lipschitz Locale}\n    B --> D{Condition de Croissance Linéaire}\n\n    C -- \"Assure l'unicité locale\" --> E[Unicité de la Solution]\n    D -- \"Assure l'existence globale\" --> F[Existence de la Solution]\n\n    E & F --> G[Solution Unique et Globale]\n    G -- \"Sous certaines hypothèses\" --> H[Théorème d'Existence et d'Unicité (par ex. Yamada-Watanabe ou Lipschitz global)]"
      }
    },
    {
      "id": "eds_linear_example",
      "componentType": "Image",
      "sectionAnchor": "## Exemples d'EDS Linéaires",
      "props": {
        "description": "Cette figure illustre une trajectoire simulée d'une Équation Différentielle Stochastique linéaire de la forme dX_t = aX_t dt + bX_t dW_t. On observe une croissance ou décroissance exponentielle modulée par des fluctuations aléatoires dues au terme de diffusion. La trajectoire est continue mais non différentiable, reflétant l'influence du mouvement brownien.",
        "title": "Trajectoire d'une EDS Linéaire",
        "year": "2007"
      }
    },
    {
      "id": "jump_diffusion_vs_gbm",
      "componentType": "Image",
      "sectionAnchor": "## EDS avec Sauts",
      "props": {
        "description": "Cette figure compare deux types de trajectoires de processus stochastiques: une trajectoire de mouvement brownien géométrique (GBM) et une trajectoire de processus de diffusion avec sauts (Jump-Diffusion). Le GBM présente une évolution continue et exponentielle avec volatilité stochastique, tandis que le processus de diffusion avec sauts montre des changements brusques et discontinus superposés à une dynamique de diffusion continue, reflétant des événements imprévus ou des chocs de marché.",
        "title": "GBM vs. Jump-Diffusion Trajectories",
        "year": "2007"
      }
    },
    {
      "id": "eds_advanced_topics",
      "componentType": "Mermaid",
      "sectionAnchor": "## Applications Avancées des EDS",
      "props": {
        "code": "graph TD\n    A[Applications Avancées des EDS en Finance] --> B{Modélisation des Actifs}\n    A --> C{Valorisation des Options}\n    A --> D{Gestion des Risques}\n    A --> E{Optimisation de Portefeuille}\n\n    B -- \"Modèles de taux d'intérêt\" --> B1[Vasicek, CIR]\n    B -- \"Modèles de prix d'actions\" --> B2[Black-Scholes (sous-jacent), Heston (volatilité stochastique)]\n\n    C -- \"Formules de Black-Scholes\" --> C1[Options Européennes]\n    C -- \"Méthodes numériques\" --> C2[Monte Carlo pour options exotiques]\n\n    D -- \"Value at Risk (VaR)\" --> D1[Calcul de la VaR stochastique]\n    D -- \"Stress Testing\" --> D2[Simulation de scénarios extrêmes]\n\n    E -- \"Allocation dynamique\" --> E1[Problème de Merton]\n    E -- \"Couverture dynamique\" --> E2[Stratégies de couverture optimales]"
      }
    },
    {
      "id": "eds_conclusion_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Conclusion et Révision",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle est la caractéristique principale qui distingue une Équation Différentielle Stochastique (EDS) d'une Équation Différentielle Ordinaire (EDO)?",
            "options": [
              {
                "text": "Les EDS impliquent des dérivées partielles.",
                "correct": false
              },
              {
                "text": "Les EDS incluent un terme aléatoire, généralement un mouvement brownien.",
                "correct": true
              },
              {
                "text": "Les EDS décrivent uniquement des processus à temps discret.",
                "correct": false
              },
              {
                "text": "Les EDS ont toujours plusieurs solutions.",
                "correct": false
              }
            ],
            "explanation": "Les EDS intègrent une composante stochastique, généralement pilotée par un processus de Wiener (mouvement brownien), qui introduit de l'aléatoire dans l'évolution du système, contrairement aux EDO déterministes."
          },
          {
            "q": "Laquelle des conditions suivantes est cruciale pour assurer l'existence et l'unicité d'une solution forte à une EDS?",
            "options": [
              {
                "text": "Le coefficient de dérive doit être constant.",
                "correct": false
              },
              {
                "text": "Le coefficient de diffusion doit être nul.",
                "correct": false
              },
              {
                "text": "Les coefficients de dérive et de diffusion doivent satisfaire les conditions de Lipschitz et de croissance linéaire.",
                "correct": true
              },
              {
                "text": "La condition initiale doit être nulle.",
                "correct": false
              }
            ],
            "explanation": "La continuité de Lipschitz assure l'unicité locale, tandis que les conditions de croissance linéaire empêchent les solutions d'exploser trop rapidement, garantissant ensemble l'existence et l'unicité selon les théorèmes standards."
          },
          {
            "q": "En modélisation financière, pourquoi les EDS sont-elles souvent préférées aux EDO pour la dynamique des prix des actifs?",
            "options": [
              {
                "text": "Les EDS sont moins intensives en calcul.",
                "correct": false
              },
              {
                "text": "Les EDS peuvent capturer l'aléatoire et la volatilité inhérents observés sur les marchés financiers.",
                "correct": true
              },
              {
                "text": "Les EDO ne peuvent pas modéliser les processus en temps continu.",
                "correct": false
              },
              {
                "text": "Les EDS fournissent des solutions analytiques exactes pour tous les instruments financiers.",
                "correct": false
              }
            ],
            "explanation": "Les marchés financiers sont intrinsèquement incertains. Les EDS, en incorporant des termes stochastiques comme le mouvement brownien, peuvent modéliser les fluctuations imprévisibles et la volatilité des prix des actifs de manière plus réaliste que les EDO déterministes."
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