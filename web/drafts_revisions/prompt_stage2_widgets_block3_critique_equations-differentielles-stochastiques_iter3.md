You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "brownian_motion_path",
      "componentType": "Image",
      "sectionAnchor": "## Introduction aux Équations Différentielles Stochastiques (EDS)",
      "props": {
        "alt": "Trajectoire simulée d'un mouvement brownien aléatoire.",
        "caption": "_Exemple visuel d'une trajectoire de mouvement brownien, illustrant la nature imprévisible et continue des processus stochastiques fondamentaux aux EDS._",
        "description": "Cette image représente une simulation numérique d'une trajectoire de mouvement brownien standard en deux dimensions. On observe le caractère aléatoire et non-différentiable de la trajectoire, typique des processus stochastiques. Chaque pas est indépendant et suit une distribution normale, résultant en un chemin erratique qui ne revient jamais sur lui-même de manière prévisible.",
        "searchQuery": "Mouvement Brownien Trajectoire Simulation",
        "title": "Trajectoire de Mouvement Brownien"
      }
    },
    {
      "id": "eds_components",
      "componentType": "Mermaid",
      "sectionAnchor": "## Structure Générale d'une EDS",
      "props": {
        "code": "graph TD\n    A[Équation Différentielle Stochastique (EDS)] --> B{Composantes Clés}\n    B --> C[Terme de Dérive (Drift)]\n    B --> D[Terme de Diffusion (Diffusion)]\n    B --> E[Mouvement Brownien (Bruit)]\n\n    C -- f(t, X_t) --> F[Détermine la tendance déterministe]\n    D -- g(t, X_t) --> G[Détermine l'amplitude du bruit]\n    E -- dW_t --> H[Source d'aléatoire]\n\n    F & G & H --> I[Modélise l'évolution stochastique de X_t]"
      }
    },
    {
      "id": "eds_existence_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Existence et Unicité des Solutions",
      "props": {
        "code": "graph TD\n    A[Conditions d'Existence et d'Unicité des Solutions d'EDS] --> B{Coefficients f et g}\n    B --> C{Condition de Lipschitz}\n    B --> D{Condition de Croissance Linéaire}\n\n    C -- \"Localement Lipschitz en x\" --> E[Existence et Unicité Locale]\n    D -- \"Globalement bornée en x\" --> F[Existence et Unicité Globale]\n\n    E & F --> G[Théorème de Picard-Lindelöf Stochastique]\n    G --> H[Solution X_t unique et continue]"
      }
    },
    {
      "id": "eds_linear_example",
      "componentType": "Image",
      "sectionAnchor": "## Exemples d'EDS et Leurs Solutions",
      "props": {
        "alt": "Exemple de trajectoire d'une EDS linéaire avec bruit.",
        "caption": "_Visualisation d'une solution d'EDS linéaire, mettant en évidence l'interaction entre la composante déterministe et le bruit stochastique._",
        "description": "Cette figure illustre une trajectoire simulée d'une Équation Différentielle Stochastique (EDS) linéaire. Contrairement aux trajectoires déterministes, celle-ci présente des fluctuations aléatoires autour d'une tendance moyenne, reflétant l'influence du terme de bruit stochastique. La solution d'une EDS linéaire est souvent un processus de Gauss-Markov, dont les propriétés statistiques peuvent être analysées.",
        "searchQuery": "EDS Linéaire Trajectoire Simulation",
        "title": "Trajectoire d'une EDS Linéaire"
      }
    },
    {
      "id": "jump_diffusion_vs_gbm",
      "componentType": "Image",
      "sectionAnchor": "## EDS avec Sauts et Applications",
      "props": {
        "alt": "Comparaison entre mouvement brownien géométrique et processus de diffusion avec sauts.",
        "caption": "_Comparaison visuelle entre un mouvement brownien géométrique (trajectoire lisse) et un processus de diffusion avec sauts (trajectoire avec discontinuités), soulignant la capacité des EDS à modéliser des phénomènes complexes._",
        "description": "Cette figure compare deux types de trajectoires de processus stochastiques: un mouvement brownien géométrique (GBM) et un processus de diffusion avec sauts. Le GBM montre une évolution continue et exponentielle, typique des modèles de prix d'actifs sans chocs. Le processus avec sauts, en revanche, présente des discontinuités abruptes, modélisant des événements soudains ou des chocs de marché, offrant une représentation plus réaliste de certains phénomènes financiers.",
        "searchQuery": "Jump Diffusion Geometric Brownian Motion",
        "title": "Diffusion avec Sauts vs. GBM"
      }
    },
    {
      "id": "eds_advanced_topics",
      "componentType": "Mermaid",
      "sectionAnchor": "## Applications des EDS en Finance",
      "props": {
        "code": "graph TD\n    A[Applications Avancées des EDS en Finance] --> B{Modélisation des Actifs}\n    A --> C{Valorisation d'Options}\n    A --> D{Gestion des Risques}\n    A --> E{Optimisation de Portefeuille}\n\n    B --> B1[Modèles de taux d'intérêt (Vasicek, CIR)]\n    B --> B2[Modèles de prix d'actions (Black-Scholes stochastique)]\n    B --> B3[Modèles de volatilité stochastique (Heston)]\n\n    C --> C1[Formules de Black-Scholes avec volatilité stochastique]\n    C --> C2[Options exotiques (barrière, asiatiques)]\n\n    D --> D1[Value at Risk (VaR) et Conditional VaR (CVaR)]\n    D --> D2[Couverture dynamique]\n\n    E --> E1[Contrôle stochastique]\n    E --> E2[Problèmes de consommation-investissement]"
      }
    },
    {
      "id": "eds_conclusion_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Conclusion et Perspectives",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle est la principale différence entre une Équation Différentielle Ordinaire (EDO) et une Équation Différentielle Stochastique (EDS)?",
            "options": [
              {
                "text": "Les EDO décrivent des systèmes déterministes, tandis que les EDS incluent un terme de bruit aléatoire.",
                "correct": true
              },
              {
                "text": "Les EDO sont toujours linéaires, alors que les EDS sont toujours non-linéaires.",
                "correct": false
              },
              {
                "text": "Les EDS ont toujours des solutions analytiques, contrairement aux EDO.",
                "correct": false
              },
              {
                "text": "Les EDO modélisent des phénomènes continus, les EDS des phénomènes discrets.",
                "correct": false
              }
            ],
            "explanation": "Les EDS se distinguent des EDO par l'ajout d'un terme stochastique, généralement lié à un mouvement brownien, qui introduit de l'aléatoire dans l'évolution du système."
          },
          {
            "q": "Quel composant d'une EDS est responsable de l'introduction de l'aléatoire dans le système?",
            "options": [
              {
                "text": "Le terme de dérive (drift).",
                "correct": false
              },
              {
                "text": "Le terme de diffusion (diffusion).",
                "correct": false
              },
              {
                "text": "Le mouvement brownien (ou processus de Wiener).",
                "correct": true
              },
              {
                "text": "Les conditions initiales.",
                "correct": false
              }
            ],
            "explanation": "Le mouvement brownien (ou processus de Wiener) est le terme stochastique fondamental qui introduit l'aléatoire et les fluctuations dans une EDS."
          },
          {
            "q": "Parmi les domaines suivants, lesquels sont des applications courantes des EDS en finance quantitative?",
            "options": [
              {
                "text": "Modélisation des prix d'actifs (actions, taux d'intérêt).",
                "correct": true
              },
              {
                "text": "Valorisation d'options et de produits dérivés.",
                "correct": true
              },
              {
                "text": "Gestion des risques et couverture de portefeuille.",
                "correct": true
              },
              {
                "text": "Conception de bases de données relationnelles.",
                "correct": false
              }
            ],
            "explanation": "Les EDS sont largement utilisées en finance pour modéliser l'évolution des actifs, valoriser les produits dérivés et gérer les risques grâce à leur capacité à capturer l'incertitude des marchés. La conception de bases de données n'est pas un domaine d'application des EDS."
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