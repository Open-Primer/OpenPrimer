You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce qu'une mesure de probabilité neutre au risque (MPNR) ?",
          "explanation": "La MPNR est une construction théorique utilisée en finance pour évaluer les actifs dérivés. Sous cette mesure, le prix actualisé de tout actif négociable est une martingale, ce qui implique que le rendement espéré de tout actif risqué est égal au taux sans risque.",
          "options": [
            {
              "text": "Une mesure sous laquelle les actifs risqués ont un rendement espéré égal au taux sans risque.",
              "correct": true
            },
            {
              "text": "Une mesure qui reflète les préférences réelles des investisseurs pour le risque.",
              "correct": false
            },
            {
              "text": "Une mesure utilisée pour évaluer la probabilité de défaut d'une entreprise.",
              "correct": false
            },
            {
              "text": "Une mesure qui maximise le rendement attendu d'un portefeuille.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans un marché financier complet et sans arbitrage, combien de mesures de probabilité neutres au risque existent-il ?",
          "explanation": "Le premier théorème fondamental de la finance stipule qu'un marché est sans arbitrage si et seulement s'il existe au moins une mesure de probabilité neutre au risque. Le second théorème fondamental de la finance stipule qu'un marché est complet si et seulement si cette mesure est unique.",
          "options": [
            {
              "text": "Exactement une.",
              "correct": true
            },
            {
              "text": "Aucune.",
              "correct": false
            },
            {
              "text": "Une infinité.",
              "correct": false
            },
            {
              "text": "Au moins une, mais pas nécessairement unique.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel théorème est fondamental pour le changement de mesure de probabilité du monde réel (P) à la mesure neutre au risque (Q) ?",
          "explanation": "Le théorème de Girsanov est crucial car il décrit comment le processus de Wiener (mouvement brownien) se transforme sous un changement de mesure de probabilité, permettant de passer d'une mesure physique à une mesure neutre au risque.",
          "options": [
            {
              "text": "Le théorème de la limite centrale.",
              "correct": false
            },
            {
              "text": "Le théorème de Girsanov.",
              "correct": true
            },
            {
              "text": "Le théorème de Bayes.",
              "correct": false
            },
            {
              "text": "Le théorème de Fubini.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Pourquoi la mesure neutre au risque est-elle essentielle pour la valorisation des options ?",
          "explanation": "En valorisation d'options, l'utilisation de la mesure neutre au risque permet de calculer le prix d'une option comme l'espérance actualisée de son payoff futur, sans avoir besoin de connaître les préférences de risque des investisseurs, car ces préférences sont déjà 'intégrées' dans le prix de l'actif sous-jacent.",
          "options": [
            {
              "text": "Elle permet de simplifier les calculs en éliminant la nécessité d'estimer les préférences de risque des investisseurs.",
              "correct": true
            },
            {
              "text": "Elle reflète les probabilités réelles de hausse ou de baisse du sous-jacent.",
              "correct": false
            },
            {
              "text": "Elle garantit que les options sont toujours rentables pour l'acheteur.",
              "correct": false
            },
            {
              "text": "Elle est uniquement utilisée pour les options exotiques.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Sous la mesure neutre au risque, quel est le comportement attendu du prix actualisé d'un actif risqué ?",
          "explanation": "La propriété clé de la mesure neutre au risque est que le prix actualisé de tout actif négociable (divisé par le numéraire, souvent un compte bancaire) est une martingale. Cela signifie que son espérance future, conditionnellement à l'information présente, est égale à sa valeur actuelle.",
          "options": [
            {
              "text": "Il suit un processus de Markov.",
              "correct": false
            },
            {
              "text": "Il est une martingale.",
              "correct": true
            },
            {
              "text": "Il est une submartingale.",
              "correct": false
            },
            {
              "text": "Il est une surmartingale.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce que le numéraire dans le contexte de la mesure neutre au risque ?",
          "explanation": "Le numéraire est un actif dont le prix est toujours positif et par rapport auquel les prix des autres actifs sont exprimés. Sous la mesure neutre au risque, le prix actualisé par le numéraire est une martingale. Le compte bancaire (actif sans risque) est un choix courant de numéraire.",
          "options": [
            {
              "text": "L'actif sous-jacent d'une option.",
              "correct": false
            },
            {
              "text": "Un actif dont le prix est utilisé pour actualiser les flux futurs et par rapport auquel les prix des autres actifs sont exprimés.",
              "correct": true
            },
            {
              "text": "Le taux d'intérêt sans risque.",
              "correct": false
            },
            {
              "text": "Le facteur de actualisation stochastique.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Lequel des énoncés suivants est VRAI concernant la densité de Radon-Nikodym dans le contexte des mesures neutres au risque ?",
          "explanation": "La densité de Radon-Nikodym est la fonction qui relie la mesure de probabilité physique (P) à la mesure neutre au risque (Q). Elle est utilisée pour effectuer le changement de mesure et est souvent exprimée en termes d'exponentielle stochastique.",
          "options": [
            {
              "text": "Elle est toujours égale à 1.",
              "correct": false
            },
            {
              "text": "Elle est utilisée pour transformer les probabilités du monde réel en probabilités neutres au risque.",
              "correct": true
            },
            {
              "text": "Elle est une constante positive.",
              "correct": false
            },
            {
              "text": "Elle est indépendante du processus stochastique sous-jacent.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans le modèle de Black-Scholes, quelle est la nature du mouvement brownien sous la mesure neutre au risque ?",
          "explanation": "Sous la mesure neutre au risque dans le modèle de Black-Scholes, le mouvement brownien ajusté (celui qui pilote le prix de l'actif) a une dérive égale au taux sans risque, tandis que sa volatilité reste inchangée.",
          "options": [
            {
              "text": "Il reste le même que sous la mesure physique.",
              "correct": false
            },
            {
              "text": "Sa dérive est modifiée pour refléter le taux sans risque.",
              "correct": true
            },
            {
              "text": "Sa volatilité est modifiée.",
              "correct": false
            },
            {
              "text": "Il devient un processus de Poisson.",
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
    "Harrison, J. M., & Kreps, D. M. (1979). Martingales and arbitrage in multiperiod securities markets. Journal of Economic Theory, 20(3), 381-408.",
    "Harrison, J. M., & Pliska, S. R. (1981). Martingales and stochastic integrals in the theory of continuous trading. Stochastic Processes and their Applications, 11(3), 215-260.",
    "Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. Journal of Political Economy, 81(3), 637-654.",
    "Merton, R. C. (1973). Theory of rational option pricing. Bell Journal of Economics and Management Science, 4(1), 141-183.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer Science & Business Media.",
    "Björk, T. (2009). Arbitrage theory in continuous time (3rd ed.). Oxford University Press.",
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson.",
    "Musiela, M., & Rutkowski, M. (2005). Martingale methods in financial modelling (2nd ed.). Springer.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman and Hall/CRC.",
    "Delbaen, F., & Schachermayer, W. (2006). The mathematics of arbitrage. Springer Science & Business Media."
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