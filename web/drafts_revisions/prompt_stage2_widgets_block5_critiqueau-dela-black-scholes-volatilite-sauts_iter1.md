You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est la principale limitation du modèle de Black-Scholes que les modèles de volatilité stochastique et de sauts cherchent à corriger ?",
          "explanation": "Le modèle de Black-Scholes suppose une volatilité constante, ce qui ne correspond pas aux observations du marché, notamment le sourire de volatilité implicite et les mouvements de prix extrêmes.",
          "options": [
            {
              "text": "Il ne prend pas en compte les dividendes.",
              "correct": false
            },
            {
              "text": "Il suppose des taux d'intérêt constants.",
              "correct": false
            },
            {
              "text": "Il suppose une volatilité constante de l'actif sous-jacent.",
              "correct": true
            },
            {
              "text": "Il ne permet pas de valoriser les options américaines.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans un modèle de volatilité stochastique, comment la volatilité de l'actif sous-jacent est-elle traitée ?",
          "explanation": "Contrairement au modèle de Black-Scholes, la volatilité n'est pas une constante mais suit son propre processus stochastique, souvent corrélé avec le processus du prix de l'actif.",
          "options": [
            {
              "text": "Elle est fixée à une valeur constante déterminée par le marché.",
              "correct": false
            },
            {
              "text": "Elle est modélisée comme une variable aléatoire suivant son propre processus stochastique.",
              "correct": true
            },
            {
              "text": "Elle est calculée à partir de la moyenne historique des rendements.",
              "correct": false
            },
            {
              "text": "Elle est ajustée quotidiennement en fonction des annonces économiques.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est un avantage clé du modèle de Heston par rapport à d'autres modèles de volatilité stochastique ?",
          "explanation": "Le modèle de Heston permet une forme fermée pour la transformée de Fourier du prix de l'option, ce qui facilite le calcul des prix via des méthodes basées sur la transformée de Fourier.",
          "options": [
            {
              "text": "Il est plus simple à calibrer que le modèle de Black-Scholes.",
              "correct": false
            },
            {
              "text": "Il permet une solution analytique fermée pour les prix des options européennes.",
              "correct": true
            },
            {
              "text": "Il ne nécessite pas de simulations Monte Carlo.",
              "correct": false
            },
            {
              "text": "Il intègre automatiquement les sauts de prix.",
              "correct": false
            }
          ]
        },
        {
          "q": "Les modèles de sauts (jump-diffusion models) sont particulièrement adaptés pour capturer quel type de phénomène de marché ?",
          "explanation": "Les modèles de sauts sont conçus pour modéliser les mouvements de prix brusques et importants qui ne sont pas bien expliqués par un processus de diffusion continu (comme le mouvement brownien géométrique).",
          "options": [
            {
              "text": "La dérive des prix à long terme.",
              "correct": false
            },
            {
              "text": "Les mouvements de prix continus et lents.",
              "correct": false
            },
            {
              "text": "Les changements soudains et importants dans les prix des actifs.",
              "correct": true
            },
            {
              "text": "La corrélation entre différents actifs.",
              "correct": false
            }
          ]
        },
        {
          "q": "Dans le modèle de Merton de sauts-diffusion, comment l'arrivée des sauts est-elle modélisée ?",
          "explanation": "Merton utilise un processus de Poisson pour modéliser le nombre d'arrivées de sauts sur une période donnée, avec une intensité constante.",
          "options": [
            {
              "text": "Par un processus de Wiener.",
              "correct": false
            },
            {
              "text": "Par un processus de Poisson.",
              "correct": true
            },
            {
              "text": "Par un processus de Markov caché.",
              "correct": false
            },
            {
              "text": "Par une distribution normale.",
              "correct": false
            }
          ]
        },
        {
          "q": "Le 'sourire de volatilité implicite' (implied volatility smile) est une observation de marché qui suggère que :",
          "explanation": "Le sourire de volatilité implicite montre que la volatilité implicite n'est pas constante pour différentes strikes et maturités, contredisant l'hypothèse de Black-Scholes et justifiant l'utilisation de modèles plus complexes.",
          "options": [
            {
              "text": "La volatilité historique est toujours supérieure à la volatilité implicite.",
              "correct": false
            },
            {
              "text": "La volatilité implicite est constante pour toutes les options sur un même actif.",
              "correct": false
            },
            {
              "text": "La volatilité implicite varie en fonction du prix d'exercice (strike) et de la maturité de l'option.",
              "correct": true
            },
            {
              "text": "Les options sont surévaluées par le marché.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce que la calibration d'un modèle financier comme Heston ou Merton ?",
          "explanation": "La calibration consiste à ajuster les paramètres du modèle pour qu'il reproduise au mieux les prix des options observés sur le marché, minimisant ainsi l'écart entre les prix théoriques et les prix de marché.",
          "options": [
            {
              "text": "Le processus de validation des données d'entrée du modèle.",
              "correct": false
            },
            {
              "text": "L'ajustement des paramètres du modèle pour qu'il corresponde aux prix des options observés sur le marché.",
              "correct": true
            },
            {
              "text": "La détermination de la volatilité historique de l'actif sous-jacent.",
              "correct": false
            },
            {
              "text": "La simulation Monte Carlo pour estimer les prix des options.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle méthode numérique est couramment utilisée pour valoriser des options dans des modèles de volatilité stochastique ou de sauts lorsque des solutions analytiques ne sont pas disponibles ?",
          "explanation": "Les simulations Monte Carlo et les méthodes de différences finies sont très flexibles et peuvent être utilisées pour valoriser des options complexes sous des modèles complexes où les solutions analytiques ou semi-analytiques sont introuvables.",
          "options": [
            {
              "text": "La formule de Black-Scholes.",
              "correct": false
            },
            {
              "text": "Les méthodes de différences finies.",
              "correct": true
            },
            {
              "text": "Les simulations Monte Carlo.",
              "correct": true
            },
            {
              "text": "La méthode des moindres carrés ordinaires.",
              "correct": false
            }
          ],
          "multiple": true
        }
      ],
      "durationLimit": 1800
    }
  },
  "references": [
    "Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. Journal of Political Economy, 81(3), 637-654.",
    "Merton, R. C. (1976). Option pricing when underlying stock returns are discontinuous. Journal of Financial Economics, 3(1-2), 125-144.",
    "Heston, S. L. (1993). A closed-form solution for options with stochastic volatility with applications to bond and currency options. The Review of Financial Studies, 6(2), 327-343.",
    "Hull, J. C. (2022). Options, futures, and other derivatives (11th ed.). Pearson.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman and Hall/CRC.",
    "Gatheral, J. (2006). The volatility surface: A practitioner's guide. John Wiley & Sons.",
    "Fouque, J. P., Papanicolaou, G., & Sircar, R. (2000). Derivatives in financial markets with stochastic volatility. Cambridge University Press.",
    "Duffie, D. (2001). Dynamic asset pricing theory (3rd ed.). Princeton University Press.",
    "Bakshi, G., Cao, C., & Chen, Z. (1997). Empirical performance of alternative option pricing models. The Journal of Finance, 52(5), 2003-2049.",
    "Carr, P., & Madan, D. B. (1999). Option valuation using the fast Fourier transform. Journal of Computational Finance, 2(4), 61-73."
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