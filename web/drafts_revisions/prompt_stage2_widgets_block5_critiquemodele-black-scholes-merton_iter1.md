You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est l'une des hypothèses fondamentales du modèle de Black-Scholes-Merton (BSM) concernant le prix de l'actif sous-jacent?",
          "explanation": "Le modèle BSM suppose que le prix de l'actif sous-jacent suit un mouvement brownien géométrique, ce qui implique que les rendements sont log-normaux et que la volatilité est constante.",
          "options": [
            {
              "text": "Le prix de l'actif suit une distribution normale.",
              "correct": false
            },
            {
              "text": "Le prix de l'actif suit un mouvement brownien géométrique.",
              "correct": true
            },
            {
              "text": "Le prix de l'actif est constant dans le temps.",
              "correct": false
            },
            {
              "text": "Le prix de l'actif suit une distribution de Poisson.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans le modèle de Black-Scholes-Merton, comment une augmentation de la volatilité implicite affecte-t-elle le prix d'une option d'achat (call) et d'une option de vente (put)?",
          "explanation": "Une volatilité plus élevée augmente la probabilité que le prix de l'actif sous-jacent s'éloigne de son prix actuel, augmentant ainsi la valeur des options d'achat et de vente car le potentiel de gain est plus grand tandis que la perte est limitée au prix de la prime.",
          "options": [
            {
              "text": "Elle diminue le prix des options d'achat et augmente le prix des options de vente.",
              "correct": false
            },
            {
              "text": "Elle augmente le prix des options d'achat et diminue le prix des options de vente.",
              "correct": false
            },
            {
              "text": "Elle augmente le prix des options d'achat et des options de vente.",
              "correct": true
            },
            {
              "text": "Elle diminue le prix des options d'achat et des options de vente.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel est le rôle du taux sans risque dans la formule de Black-Scholes-Merton?",
          "explanation": "Le taux sans risque est utilisé pour actualiser les flux de trésorerie futurs dans un monde neutre au risque et pour refléter le coût d'opportunité de l'argent. Il affecte différemment les options d'achat et de vente.",
          "options": [
            {
              "text": "Il représente le rendement attendu de l'actif sous-jacent.",
              "correct": false
            },
            {
              "text": "Il est utilisé pour actualiser les flux de trésorerie futurs et reflète le coût d'opportunité.",
              "correct": true
            },
            {
              "text": "Il mesure le risque de défaut de l'émetteur de l'option.",
              "correct": false
            },
            {
              "text": "Il est directement proportionnel à la volatilité de l'actif.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Laquelle des affirmations suivantes est une limitation connue du modèle de Black-Scholes-Merton?",
          "explanation": "Le modèle BSM suppose une volatilité constante, ce qui n'est pas réaliste sur les marchés financiers où la volatilité tend à varier dans le temps (phénomène de 'smile' ou 'skew' de volatilité).",
          "options": [
            {
              "text": "Il ne peut pas être utilisé pour évaluer les options européennes.",
              "correct": false
            },
            {
              "text": "Il suppose que la volatilité de l'actif sous-jacent est constante.",
              "correct": true
            },
            {
              "text": "Il ne prend pas en compte le temps jusqu'à l'expiration.",
              "correct": false
            },
            {
              "text": "Il ne permet pas de calculer les 'Greeks'.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce que le concept de 'neutralité au risque' implique dans le contexte du modèle de Black-Scholes-Merton?",
          "explanation": "La neutralité au risque est une hypothèse clé qui permet de valoriser les options en supposant que les investisseurs sont indifférents au risque, et que le rendement attendu de tout actif est le taux sans risque. Cela simplifie le calcul des prix des options.",
          "options": [
            {
              "text": "Les investisseurs sont averses au risque et exigent une prime de risque.",
              "correct": false
            },
            {
              "text": "Les prix des actifs sont déterminés par l'offre et la demande sans tenir compte du risque.",
              "correct": false
            },
            {
              "text": "Les actifs financiers rapportent le taux sans risque en espérance, et les investisseurs sont indifférents au risque.",
              "correct": true
            },
            {
              "text": "Le marché est inefficace et les opportunités d'arbitrage sont fréquentes.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Selon le modèle BSM, comment le versement de dividendes sur l'actif sous-jacent affecte-t-il le prix d'une option d'achat (call) européenne?",
          "explanation": "Le versement de dividendes réduit le prix de l'actif sous-jacent à la date ex-dividende, ce qui diminue la valeur d'une option d'achat car le prix d'exercice devient relativement plus élevé par rapport au prix de l'actif ajusté.",
          "options": [
            {
              "text": "Il augmente le prix de l'option d'achat.",
              "correct": false
            },
            {
              "text": "Il diminue le prix de l'option d'achat.",
              "correct": true
            },
            {
              "text": "Il n'a aucun impact sur le prix de l'option d'achat.",
              "correct": false
            },
            {
              "text": "Il augmente le prix de l'option d'achat si le dividende est élevé.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel est le 'Grec' qui mesure la sensibilité du prix d'une option aux variations du prix de l'actif sous-jacent?",
          "explanation": "Delta mesure la variation du prix de l'option pour une variation d'un euro du prix de l'actif sous-jacent. C'est un indicateur clé pour la couverture (hedging).",
          "options": [
            {
              "text": "Gamma",
              "correct": false
            },
            {
              "text": "Theta",
              "correct": false
            },
            {
              "text": "Vega",
              "correct": false
            },
            {
              "text": "Delta",
              "correct": true
            }
          ],
          "multiple": false
        },
        {
          "q": "La parité put-call est une relation fondamentale entre les prix des options d'achat et de vente européennes ayant le même actif sous-jacent, le même prix d'exercice et la même date d'expiration. Quelle est la formule correcte de la parité put-call (où C est le prix du call, P le prix du put, S le prix de l'actif, K le prix d'exercice, r le taux sans risque et T le temps à l'expiration)?",
          "explanation": "La formule de la parité put-call est C + K * e^(-rT) = P + S. Elle est dérivée d'un argument d'arbitrage.",
          "options": [
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
            },
            {
              "text": "C * e^(rT) = P + S - K",
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
    "Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. The Journal of Political Economy, 81(3), 637-654.",
    "Merton, R. C. (1973). Theory of rational option pricing. The Bell Journal of Economics and Management Science, 4(1), 141-183.",
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer.",
    "Baxter, M., & Rennie, A. (1996). Financial calculus: An introduction to derivative pricing. Cambridge University Press.",
    "Wilmott, P. (2006). Paul Wilmott on quantitative finance (2nd ed.). John Wiley & Sons.",
    "Duffie, D. (2001). Dynamic asset pricing theory (3rd ed.). Princeton University Press.",
    "Cox, J. C., Ross, S. A., & Rubinstein, M. (1979). Option pricing: A simplified approach. Journal of Financial Economics, 7(3), 229-263.",
    "Brealey, R. A., Myers, S. C., & Allen, F. (2020). Principles of corporate finance (13th ed.). McGraw-Hill Education.",
    "Neftci, S. N. (2000). An introduction to the mathematics of financial derivatives. Academic Press."
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