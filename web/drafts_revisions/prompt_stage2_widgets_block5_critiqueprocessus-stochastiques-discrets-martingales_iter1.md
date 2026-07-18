You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce qu'un processus stochastique discret?",
          "explanation": "Un processus stochastique discret est une collection de variables aléatoires indexées par un ensemble discret, souvent le temps, représentant l'évolution d'un système au fil d'étapes distinctes.",
          "options": [
            {
              "text": "Une suite de variables aléatoires indexées par un ensemble continu.",
              "correct": false
            },
            {
              "text": "Une suite de variables aléatoires indexées par un ensemble discret.",
              "correct": true
            },
            {
              "text": "Une fonction déterministe du temps.",
              "correct": false
            },
            {
              "text": "Un ensemble de fonctions aléatoires.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la condition principale pour qu'un processus stochastique discret (X_n) soit une martingale par rapport à une filtration (F_n)?",
          "explanation": "Pour qu'un processus (X_n) soit une martingale par rapport à (F_n), il doit être adapté à (F_n), avoir une espérance finie pour chaque X_n, et satisfaire E[X_{n+1} | F_n] = X_n presque sûrement. Cette condition signifie que la meilleure estimation du futur, basée sur l'information présente, est la valeur présente elle-même.",
          "options": [
            {
              "text": "E[X_{n+1} | F_n] = X_n presque sûrement.",
              "correct": true
            },
            {
              "text": "E[X_{n+1}] = X_n presque sûrement.",
              "correct": false
            },
            {
              "text": "X_n est indépendant de F_n.",
              "correct": false
            },
            {
              "text": "X_n est une suite déterministe.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle affirmation est vraie pour une sous-martingale (X_n) par rapport à une filtration (F_n)?",
          "explanation": "Pour une sous-martingale, l'espérance conditionnelle du prochain état est supérieure ou égale à l'état actuel (E[X_{n+1} | F_n] >= X_n presque sûrement), ce qui implique que l'espérance non conditionnelle E[X_n] est une suite non décroissante.",
          "options": [
            {
              "text": "E[X_{n+1} | F_n] <= X_n presque sûrement.",
              "correct": false
            },
            {
              "text": "E[X_{n+1} | F_n] >= X_n presque sûrement.",
              "correct": true
            },
            {
              "text": "E[X_{n+1} | F_n] = X_n presque sûrement.",
              "correct": false
            },
            {
              "text": "E[X_n] est une suite décroissante.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Considérez une marche aléatoire simple où S_n = S_{n-1} + X_n, avec X_n prenant les valeurs +1 ou -1 avec probabilité 0.5. S_0 = 0. Ce processus est-il une martingale?",
          "explanation": "Oui, car E[X_n] = 0. L'espérance conditionnelle E[S_{n+1} | F_n] = E[S_n + X_{n+1} | F_n] = S_n + E[X_{n+1} | F_n] = S_n + E[X_{n+1}] = S_n + 0 = S_n. Donc, c'est une martingale.",
          "options": [
            {
              "text": "Oui, car E[X_n] = 0.",
              "correct": true
            },
            {
              "text": "Non, car les pas sont indépendants.",
              "correct": false
            },
            {
              "text": "Oui, mais seulement si les pas sont non-négatifs.",
              "correct": false
            },
            {
              "text": "Non, car la variance augmente avec le temps.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce qu'un temps d'arrêt (stopping time) T par rapport à une filtration (F_n)?",
          "explanation": "Un temps d'arrêt T est une variable aléatoire à valeurs entières positives telle que la décision d'arrêter au temps n dépend uniquement de l'information disponible jusqu'au temps n (F_n). Formellement, l'événement {T <= n} doit appartenir à F_n pour tout n.",
          "options": [
            {
              "text": "Une variable aléatoire T telle que l'événement {T <= n} appartient à F_n pour tout n.",
              "correct": true
            },
            {
              "text": "Une variable aléatoire T telle que l'événement {T = n} appartient à F_n pour tout n.",
              "correct": false
            },
            {
              "text": "Une variable aléatoire T qui est indépendante de la filtration.",
              "correct": false
            },
            {
              "text": "Un temps fixe et non aléatoire.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Le théorème d'arrêt optionnel de Doob s'applique-t-il toujours à toute martingale et tout temps d'arrêt borné?",
          "explanation": "Oui, le théorème d'arrêt optionnel de Doob stipule que pour une martingale (X_n) et un temps d'arrêt T borné, E[X_T] = E[X_0]. Des conditions supplémentaires (comme l'intégrabilité uniforme ou la borne L1) sont nécessaires si T n'est pas borné.",
          "options": [
            {
              "text": "Oui, sans aucune condition supplémentaire.",
              "correct": false
            },
            {
              "text": "Oui, si le temps d'arrêt est borné.",
              "correct": true
            },
            {
              "text": "Non, jamais.",
              "correct": false
            },
            {
              "text": "Seulement pour les sous-martingales.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans quel domaine de la finance les martingales sont-elles particulièrement utiles?",
          "explanation": "Les martingales sont fondamentales dans la théorie de l'évaluation des actifs sans arbitrage, où les prix actualisés des actifs sont souvent modélisés comme des martingales sous une mesure de probabilité risque-neutre. Elles sont essentielles pour l'évaluation des options et la gestion des risques.",
          "options": [
            {
              "text": "L'analyse technique des marchés.",
              "correct": false
            },
            {
              "text": "La comptabilité d'entreprise.",
              "correct": false
            },
            {
              "text": "L'évaluation des options et la gestion des risques.",
              "correct": true
            },
            {
              "text": "La macroéconomie purement descriptive.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce qu'une filtration (F_n) dans le contexte des processus stochastiques?",
          "explanation": "Une filtration est une suite croissante de sigma-algèbres, où F_n représente l'information disponible jusqu'au temps n. Elle est essentielle pour définir l'adaptabilité d'un processus et les propriétés des martingales, car elle formalise l'évolution de l'information au cours du temps.",
          "options": [
            {
              "text": "Une suite décroissante de sigma-algèbres.",
              "correct": false
            },
            {
              "text": "Une suite croissante de sigma-algèbres, représentant l'information disponible au fil du temps.",
              "correct": true
            },
            {
              "text": "Un ensemble de variables aléatoires indépendantes.",
              "correct": false
            },
            {
              "text": "Une fonction de densité de probabilité.",
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
    "Shiryaev, A. N. (1996). Probability. Springer.",
    "Williams, D. (1991). Probability with martingales. Cambridge University Press.",
    "Lamberton, D., & Lapeyre, B. (2008). Introduction au calcul stochastique appliqué à la finance. Ellipses.",
    "Mikosch, T. (1998). Elementary stochastic calculus with finance in view. World Scientific.",
    "Protter, P. E. (2005). Stochastic integration and differential equations. Springer.",
    "Rogers, L. C. G., & Williams, D. (2000). Diffusions, Markov processes, and martingales: Volume 1, Foundations. Cambridge University Press.",
    "Björk, T. (2009). Arbitrage theory in continuous time. Oxford University Press.",
    "Brémaud, P. (1999). Marcov chains: Gibbs fields, Monte Carlo simulation, and queues. Springer.",
    "Durrett, R. (2019). Probability: Theory and examples (5th ed.). Cambridge University Press.",
    "Feller, W. (1968). An introduction to probability theory and its applications, Vol. 1 (3rd ed.). John Wiley & Sons."
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