You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quel est l'apport majeur de Louis Bachelier à la finance stochastique?",
          "explanation": "Louis Bachelier, dans sa thèse de 1900, a été le premier à utiliser le mouvement brownien (ou marche aléatoire) pour modéliser l'évolution des prix boursiers, posant ainsi les bases de la finance stochastique.",
          "options": [
            {
              "text": "L'introduction du mouvement brownien pour modéliser les prix des actifs.",
              "correct": true
            },
            {
              "text": "La formule de valorisation des options européennes.",
              "correct": false
            },
            {
              "text": "Le concept de martingales en finance.",
              "correct": false
            },
            {
              "text": "La théorie des marchés efficients.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Parmi les hypothèses suivantes, laquelle n'est PAS une hypothèse fondamentale du modèle de Black-Scholes-Merton pour la valorisation des options?",
          "explanation": "Une hypothèse clé du modèle original de Black-Scholes-Merton est que la volatilité de l'actif sous-jacent est constante et connue, non stochastique.",
          "options": [
            {
              "text": "Le prix de l'actif sous-jacent suit un mouvement brownien géométrique.",
              "correct": false
            },
            {
              "text": "Il n'y a pas de coûts de transaction ni d'impôts.",
              "correct": false
            },
            {
              "text": "Le taux d'intérêt sans risque est constant et connu.",
              "correct": false
            },
            {
              "text": "La volatilité de l'actif sous-jacent est stochastique.",
              "correct": true
            },
            {
              "text": "Il est possible de vendre à découvert sans restriction.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel est le principe central de la valorisation en univers risque-neutre?",
          "explanation": "La valorisation en univers risque-neutre stipule que le prix d'un actif dérivé est l'espérance de ses flux futurs actualisés au taux sans risque, sous une mesure de probabilité équivalente dite 'risque-neutre'.",
          "options": [
            {
              "text": "Les investisseurs sont indifférents au risque.",
              "correct": false
            },
            {
              "text": "Les actifs dérivés sont valorisés en actualisant leurs espérances de gains sous une mesure de probabilité risque-neutre au taux sans risque.",
              "correct": true
            },
            {
              "text": "Le rendement attendu de tous les actifs est égal au taux sans risque.",
              "correct": false
            },
            {
              "text": "Le prix d'un actif est indépendant de son risque.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "À quoi sert principalement le Lemme d'Itô en finance stochastique?",
          "explanation": "Le Lemme d'Itô est un outil fondamental du calcul stochastique qui permet de trouver la différentielle d'une fonction d'un processus d'Itô, essentielle pour dériver les équations différentielles stochastiques (EDS) des prix d'options.",
          "options": [
            {
              "text": "À calculer la valeur future d'un portefeuille d'actions.",
              "correct": false
            },
            {
              "text": "À dériver la dynamique d'une fonction d'un processus stochastique.",
              "correct": true
            },
            {
              "text": "À estimer la volatilité implicite des options.",
              "correct": false
            },
            {
              "text": "À modéliser les sauts de prix sur les marchés financiers.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans le contexte de la finance stochastique, qu'est-ce qu'une martingale?",
          "explanation": "Un processus stochastique est une martingale si son espérance future, conditionnée par l'information disponible jusqu'à présent, est égale à sa valeur actuelle. Ce concept est crucial pour la valorisation sans arbitrage.",
          "options": [
            {
              "text": "Un processus stochastique dont l'espérance conditionnelle future, étant donné l'information présente, est égale à sa valeur présente.",
              "correct": true
            },
            {
              "text": "Un processus dont la variance est constante dans le temps.",
              "correct": false
            },
            {
              "text": "Un processus qui ne peut pas être répliqué par un portefeuille d'actifs sous-jacents.",
              "correct": false
            },
            {
              "text": "Un processus qui suit une distribution normale.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est une limitation bien connue du modèle de Black-Scholes-Merton?",
          "explanation": "Le modèle de Black-Scholes-Merton suppose une volatilité constante, ce qui est contredit par l'observation empirique du 'smile de volatilité' (ou 'skew de volatilité'), où la volatilité implicite varie avec le prix d'exercice et la maturité.",
          "options": [
            {
              "text": "Il ne prend pas en compte les dividendes.",
              "correct": false
            },
            {
              "text": "Il suppose que les marchés sont incomplets.",
              "correct": false
            },
            {
              "text": "Il ne peut pas valoriser les options américaines.",
              "correct": false
            },
            {
              "text": "Il ne parvient pas à expliquer le 'smile de volatilité'.",
              "correct": true
            }
          ],
          "multiple": false
        },
        {
          "q": "Le modèle binomial de Cox-Ross-Rubinstein (CRR) est souvent utilisé pour:",
          "explanation": "Le modèle CRR est un modèle discret qui permet de valoriser les options en construisant un arbre binomial, et il converge vers le modèle de Black-Scholes-Merton lorsque le nombre de pas tend vers l'infini.",
          "options": [
            {
              "text": "Valoriser des options exotiques complexes.",
              "correct": false
            },
            {
              "text": "Fournir une approximation discrète du modèle de Black-Scholes-Merton.",
              "correct": true
            },
            {
              "text": "Modéliser les taux d'intérêt stochastiques.",
              "correct": false
            },
            {
              "text": "Analyser les stratégies de trading haute fréquence.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Bien que n'étant pas directement de la finance stochastique au sens strict, quelle contribution de Harry Markowitz a été fondamentale pour la gestion de portefeuille et a influencé la pensée financière moderne?",
          "explanation": "Harry Markowitz a introduit la théorie du portefeuille moderne (MPT) en 1952, qui met l'accent sur la diversification et l'optimisation du couple rendement-risque, une pierre angulaire de la finance quantitative.",
          "options": [
            {
              "text": "La théorie du portefeuille moderne (Modern Portfolio Theory - MPT).",
              "correct": true
            },
            {
              "text": "Le modèle d'évaluation des actifs financiers (CAPM).",
              "correct": false
            },
            {
              "text": "La théorie des jeux.",
              "correct": false
            },
            {
              "text": "L'hypothèse des marchés efficients.",
              "correct": false
            }
          ],
          "multiple": false
        }
      ],
      "durationLimit": 1800
    }
  },
  "references": [
    "Bachelier, L. (1900). Théorie de la spéculation. Gauthier-Villars.",
    "Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. Journal of Political Economy, 81(3), 637-654.",
    "Merton, R. C. (1973). Theory of rational option pricing. Bell Journal of Economics and Management Science, 4(1), 141-183.",
    "Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. Journal of Financial Economics, 7(3), 229-263.",
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer.",
    "Karatzas, I., & Shreve, S. E. (1991). Brownian motion and stochastic calculus (2nd ed.). Springer.",
    "Harrison, J. M., & Kreps, D. M. (1979). Martingales and arbitrage in multiperiod securities markets. Journal of Economic Theory, 20(3), 381-408.",
    "Dupire, B. (1994). Pricing with a smile. Risk, 7(1), 18-20.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman and Hall/CRC.",
    "Markowitz, H. (1952). Portfolio selection. The Journal of Finance, 7(1), 77-91."
  ]
}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.
4. Absolutely ZERO placeholders or generic filler text (like "Option A", "Option B", "Option", etc.) are allowed in the quiz questions or options. All questions and options must contain actual high-quality academic content in the target language. Reject if any question has dummy options.
5. If this is a terminal evaluation (isTerminalEvaluation is false), the "references" array must be strictly empty ([]).
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