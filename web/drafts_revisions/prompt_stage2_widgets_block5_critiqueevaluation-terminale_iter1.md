You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est la principale caractéristique du Mouvement Brownien Géométrique (MBG) utilisé pour modéliser le prix des actifs financiers?",
          "explanation": "Le MBG est souvent utilisé car il garantit que le prix de l'actif reste positif, ce qui est une propriété essentielle pour les actifs financiers. Les rendements sont log-normalement distribués, pas normalement.",
          "options": [
            {
              "text": "Il a des rendements normalement distribués.",
              "correct": false
            },
            {
              "text": "Son espérance est constante.",
              "correct": false
            },
            {
              "text": "Il ne peut pas prendre de valeurs négatives.",
              "correct": true
            },
            {
              "text": "Sa variance est déterministe.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "À quoi sert principalement le Lemme d'Itô en finance quantitative?",
          "explanation": "Le Lemme d'Itô est un outil fondamental du calcul stochastique qui permet de trouver la différentielle d'une fonction d'un processus stochastique, comme le prix d'une option qui dépend du prix de l'actif sous-jacent.",
          "options": [
            {
              "text": "À calculer la valeur actuelle nette d'un projet.",
              "correct": false
            },
            {
              "text": "À dériver la dynamique d'une fonction d'un processus stochastique.",
              "correct": true
            },
            {
              "text": "À estimer la volatilité implicite d'une option.",
              "correct": false
            },
            {
              "text": "À modéliser les taux d'intérêt sans risque.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle hypothèse n'est PAS une hypothèse fondamentale du modèle de Black-Scholes pour l'évaluation des options européennes?",
          "explanation": "Le modèle de Black-Scholes est spécifiquement conçu pour les options européennes, qui ne peuvent être exercées qu'à l'échéance. Les options américaines peuvent être exercées à tout moment.",
          "options": [
            {
              "text": "Le prix de l'actif sous-jacent suit un Mouvement Brownien Géométrique.",
              "correct": false
            },
            {
              "text": "Il n'y a pas de coûts de transaction ni de taxes.",
              "correct": false
            },
            {
              "text": "La volatilité de l'actif sous-jacent est constante.",
              "correct": false
            },
            {
              "text": "L'option peut être exercée à tout moment avant l'échéance.",
              "correct": true
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans le cadre de la valorisation neutre au risque, quel est le taux d'actualisation utilisé pour les flux de trésorerie futurs?",
          "explanation": "La valorisation neutre au risque implique que tous les actifs, y compris les dérivés, sont actualisés au taux sans risque, car le risque est déjà pris en compte dans la probabilité neutre au risque.",
          "options": [
            {
              "text": "Le taux de rendement espéré de l'actif risqué.",
              "correct": false
            },
            {
              "text": "Le taux sans risque.",
              "correct": true
            },
            {
              "text": "Le coût moyen pondéré du capital.",
              "correct": false
            },
            {
              "text": "Le taux de rendement requis par les investisseurs.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "La parité Put-Call relie le prix d'une option d'achat européenne, d'une option de vente européenne, du prix de l'actif sous-jacent et du prix d'exercice. Quelle est la formule correcte (sans dividendes)?",
          "explanation": "La parité Put-Call est C - P = S - K * e^(-rT), où C est le prix du call, P le prix du put, S le prix de l'actif, K le prix d'exercice, r le taux sans risque et T l'échéance.",
          "options": [
            {
              "text": "C + K * e^(-rT) = P + S",
              "correct": false
            },
            {
              "text": "C + S = P + K * e^(-rT)",
              "correct": false
            },
            {
              "text": "C - P = S - K * e^(-rT)",
              "correct": true
            },
            {
              "text": "C + P = S + K * e^(-rT)",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel est l'avantage principal des méthodes de Monte Carlo pour l'évaluation des options complexes?",
          "explanation": "Les méthodes de Monte Carlo sont particulièrement utiles pour les options dont la valeur dépend de la trajectoire du sous-jacent ou pour les options multi-actifs, où les solutions analytiques sont rares ou inexistantes.",
          "options": [
            {
              "text": "Elles sont toujours plus rapides que les méthodes analytiques.",
              "correct": false
            },
            {
              "text": "Elles peuvent gérer des chemins de dépendance complexes et des options multi-actifs.",
              "correct": true
            },
            {
              "text": "Elles fournissent une solution exacte sans erreur d'échantillonnage.",
              "correct": false
            },
            {
              "text": "Elles sont faciles à implémenter pour les options américaines.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans un modèle binomial à une période, si le prix de l'actif peut monter à S_u ou descendre à S_d, et le taux sans risque est r, quelle est la probabilité neutre au risque de monter (p*)?",
          "explanation": "La probabilité neutre au risque p* est calculée de manière à ce que l'espérance du prix futur actualisé de l'actif sous-jacent soit égale à son prix actuel, sous la mesure neutre au risque.",
          "options": [
            {
              "text": "p* = (e^(rT) - d) / (u - d)",
              "correct": true
            },
            {
              "text": "p* = (u - e^(rT)) / (u - d)",
              "correct": false
            },
            {
              "text": "p* = (e^(rT) - u) / (d - u)",
              "correct": false
            },
            {
              "text": "p* = (d - e^(rT)) / (u - d)",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce que la volatilité implicite d'une option?",
          "explanation": "La volatilité implicite est la valeur de la volatilité qui rend le prix théorique du modèle de Black-Scholes égal au prix observé sur le marché.",
          "options": [
            {
              "text": "La volatilité historique de l'actif sous-jacent.",
              "correct": false
            },
            {
              "text": "La volatilité future attendue de l'actif sous-jacent.",
              "correct": false
            },
            {
              "text": "La volatilité qui, une fois insérée dans le modèle de Black-Scholes, donne le prix de marché de l'option.",
              "correct": true
            },
            {
              "text": "La volatilité calculée à partir des rendements quotidiens de l'actif.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Lequel des énoncés suivants décrit le mieux la Value at Risk (VaR)?",
          "explanation": "La VaR est une mesure de risque qui estime la perte maximale qu'un portefeuille pourrait subir sur une période donnée avec une probabilité spécifiée (niveau de confiance).",
          "options": [
            {
              "text": "La perte maximale potentielle d'un portefeuille sur une période donnée avec un certain niveau de confiance.",
              "correct": true
            },
            {
              "text": "La perte moyenne attendue au-delà d'un certain seuil de confiance.",
              "correct": false
            },
            {
              "text": "La perte minimale potentielle d'un portefeuille sur une période donnée.",
              "correct": false
            },
            {
              "text": "La volatilité quotidienne d'un portefeuille.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Le modèle de Vasicek est un modèle de taux d'intérêt. Quelle est sa principale caractéristique concernant le comportement des taux?",
          "explanation": "Le modèle de Vasicek est un modèle de retour à la moyenne, mais il a l'inconvénient de permettre aux taux d'intérêt de devenir négatifs, ce qui n'est pas toujours réaliste.",
          "options": [
            {
              "text": "Il permet aux taux d'intérêt de devenir négatifs.",
              "correct": true
            },
            {
              "text": "Il garantit que les taux d'intérêt restent positifs.",
              "correct": false
            },
            {
              "text": "Il modélise les taux d'intérêt comme un processus de Poisson.",
              "correct": false
            },
            {
              "text": "Il suppose que la volatilité des taux d'intérêt est proportionnelle au niveau des taux.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans le contexte de la finance quantitative, qu'est-ce qu'une martingale?",
          "explanation": "Une martingale est un processus stochastique où, étant donné l'information présente, la meilleure prédiction de la valeur future du processus est sa valeur actuelle. C'est un concept clé en valorisation neutre au risque.",
          "options": [
            {
              "text": "Un processus stochastique dont l'espérance conditionnelle future est égale à sa valeur actuelle.",
              "correct": true
            },
            {
              "text": "Un processus stochastique dont la variance est constante.",
              "correct": false
            },
            {
              "text": "Un processus stochastique qui ne peut pas prendre de valeurs négatives.",
              "correct": false
            },
            {
              "text": "Un processus stochastique qui suit une distribution normale.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Parmi les options suivantes, laquelle est un exemple d'option exotique?",
          "explanation": "Les options barrières sont des options exotiques dont l'existence ou le paiement dépendent du fait que le prix de l'actif sous-jacent atteigne ou franchisse un certain niveau (barrière) pendant la durée de vie de l'option.",
          "options": [
            {
              "text": "Option d'achat européenne.",
              "correct": false
            },
            {
              "text": "Option de vente américaine.",
              "correct": false
            },
            {
              "text": "Option barrière.",
              "correct": true
            },
            {
              "text": "Option d'achat standard.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la principale caractéristique du modèle HJM (Heath-Jarrow-Morton) par rapport aux modèles de taux courts comme Vasicek ou CIR?",
          "explanation": "Contrairement aux modèles de taux courts qui modélisent un seul taux (le taux instantané), le modèle HJM modélise l'évolution de l'ensemble de la courbe des taux à terme, ce qui est un avantage majeur.",
          "options": [
            {
              "text": "Il modélise directement le taux court.",
              "correct": false
            },
            {
              "text": "Il modélise la dynamique de l'ensemble de la courbe des taux à terme.",
              "correct": true
            },
            {
              "text": "Il ne permet pas l'arbitrage.",
              "correct": false
            },
            {
              "text": "Il suppose une volatilité constante pour tous les taux.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce que la couverture Delta (Delta Hedging) pour une option?",
          "explanation": "La couverture Delta est une technique de gestion des risques qui consiste à ajuster la position dans l'actif sous-jacent pour compenser les variations de la valeur de l'option dues aux changements du prix de l'actif sous-jacent.",
          "options": [
            {
              "text": "Une stratégie visant à éliminer tout risque de marché.",
              "correct": false
            },
            {
              "text": "Une stratégie visant à maintenir le portefeuille neutre au risque par rapport aux petites variations du prix de l'actif sous-jacent.",
              "correct": true
            },
            {
              "text": "Une stratégie visant à profiter des mouvements de volatilité.",
              "correct": false
            },
            {
              "text": "Une stratégie qui consiste à acheter et vendre l'option à l'échéance.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans quel contexte les processus de Poisson sont-ils souvent utilisés en finance quantitative?",
          "explanation": "Les processus de Poisson sont utilisés pour modéliser des événements discrets et aléatoires qui se produisent à des intervalles de temps aléatoires, tels que les sauts de prix dans les modèles de diffusion-saut ou les défauts de crédit.",
          "options": [
            {
              "text": "Pour modéliser les mouvements continus des prix des actions.",
              "correct": false
            },
            {
              "text": "Pour modéliser les arrivées d'événements discrets et imprévisibles, comme les sauts de prix ou les défauts de crédit.",
              "correct": true
            },
            {
              "text": "Pour modéliser la volatilité stochastique.",
              "correct": false
            },
            {
              "text": "Pour modéliser les taux d'intérêt sans risque.",
              "correct": false
            }
          ],
          "multiple": false
        }
      ],
      "durationLimit": 1800
    }
  },
  "references": []
}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.
4. Absolutely ZERO placeholders or generic filler text (like "Option A", "Option B", "Option", etc.) are allowed in the quiz questions or options. All questions and options must contain actual high-quality academic content in the target language. Reject if any question has dummy options.
5. If this is a terminal evaluation (isTerminalEvaluation is true), the "references" array must be strictly empty ([]).
6. If this is a terminal evaluation, no media (images, video, audio) or Mermaid diagrams are allowed in the quiz questions/explanations unless they are absolutely functional to the assessment itself (e.g. diagram-based logic puzzles). Decorative images or non-essential diagrams must be rejected.
7. If this is a terminal evaluation, no hover cards (RealPerson, ConceptLink, Glossary) are allowed in the quiz questions/explanations.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'finalEvaluation' or 'references')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.