You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est une propriété fondamentale du mouvement brownien standard (W_t) ?",
          "explanation": "Le mouvement brownien est caractérisé par des accroissements indépendants et stationnaires, des trajectoires continues mais nulle part différentiables, et une variation quadratique non nulle. Les accroissements sur des intervalles disjoints sont indépendants.",
          "options": [
            {
              "text": "Les trajectoires sont différentiables partout.",
              "correct": false
            },
            {
              "text": "Les accroissements (W_t - W_s) sont indépendants pour des intervalles disjoints.",
              "correct": true
            },
            {
              "text": "La variance de W_t est toujours 1.",
              "correct": false
            },
            {
              "text": "W_t est un processus à variation bornée.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la variation quadratique du mouvement brownien standard W_t sur l'intervalle [0, T] ?",
          "explanation": "La variation quadratique d'un mouvement brownien standard sur l'intervalle [0, T] est égale à T. C'est une propriété clé qui le distingue des processus à variation bornée.",
          "options": [
            {
              "text": "0",
              "correct": false
            },
            {
              "text": "T",
              "correct": true
            },
            {
              "text": "T^2",
              "correct": false
            },
            {
              "text": "L'infini",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Soit f(t, W_t) une fonction de classe C^2 en W_t et C^1 en t. Quelle est la formule du Lemme d'Itô pour df(t, W_t) ?",
          "explanation": "Le Lemme d'Itô est une généralisation de la règle de la chaîne pour les processus stochastiques. Il inclut un terme additionnel (1/2)(∂^2f/∂W^2)dt dû à la variation quadratique non nulle du mouvement brownien.",
          "options": [
            {
              "text": "df = (∂f/∂t)dt + (∂f/∂W)dW_t",
              "correct": false
            },
            {
              "text": "df = (∂f/∂t)dt + (∂f/∂W)dW_t + (1/2)(∂^2f/∂W^2)dt",
              "correct": true
            },
            {
              "text": "df = (∂f/∂t)dt + (∂f/∂W)dW_t + (1/2)(∂^2f/∂W^2)(dW_t)^2",
              "correct": false
            },
            {
              "text": "df = (∂f/∂t)dt + (∂f/∂W)dW_t + (∂^2f/∂W^2)dt",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Parmi les affirmations suivantes concernant l'intégrale d'Itô (∫ H_s dW_s), laquelle est correcte ?",
          "explanation": "L'intégrale d'Itô d'un processus prévisible et carrément intégrable par rapport à un mouvement brownien est une martingale. C'est une propriété fondamentale en finance stochastique.",
          "options": [
            {
              "text": "Elle est toujours un processus à variation bornée.",
              "correct": false
            },
            {
              "text": "Elle est un processus de Markov.",
              "correct": false
            },
            {
              "text": "Elle est une martingale (sous certaines conditions d'intégrabilité).",
              "correct": true
            },
            {
              "text": "Elle est toujours positive.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Le mouvement brownien géométrique (MBG) est souvent utilisé pour modéliser le prix des actifs financiers. Quelle est la raison principale de ce choix ?",
          "explanation": "Le MBG est privilégié car il assure que les prix des actifs restent positifs (contrairement à un mouvement brownien arithmétique) et que les rendements log-normaux sont distribués normalement, ce qui est souvent observé empiriquement.",
          "options": [
            {
              "text": "Il garantit que le prix de l'actif peut devenir négatif.",
              "correct": false
            },
            {
              "text": "Il permet de modéliser des rendements gaussiens et des prix positifs.",
              "correct": true
            },
            {
              "text": "Il a des trajectoires différentiables.",
              "correct": false
            },
            {
              "text": "Il est plus simple à calculer que d'autres modèles.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la principale différence entre l'intégrale de Riemann et l'intégrale d'Itô ?",
          "explanation": "La différence fondamentale réside dans la manière dont les sommes de Riemann sont construites. L'intégrale d'Itô utilise des points d'évaluation au début de chaque intervalle et intègre par rapport à un processus à variation non bornée (comme le MB), ce qui introduit le terme de correction d'Itô.",
          "options": [
            {
              "text": "L'intégrale de Riemann est définie pour des fonctions aléatoires, tandis que l'intégrale d'Itô est pour des fonctions déterministes.",
              "correct": false
            },
            {
              "text": "L'intégrale d'Itô prend en compte la variation quadratique du processus intégrateur.",
              "correct": true
            },
            {
              "text": "L'intégrale de Riemann est toujours plus grande que l'intégrale d'Itô.",
              "correct": false
            },
            {
              "text": "L'intégrale d'Itô ne peut être calculée que numériquement.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce qu'une Équation Différentielle Stochastique (EDS) ?",
          "explanation": "Une EDS est une équation différentielle où au moins un terme est un processus stochastique, généralement un mouvement brownien, modélisant des fluctuations aléatoires.",
          "options": [
            {
              "text": "Une équation différentielle dont les coefficients sont des variables aléatoires.",
              "correct": false
            },
            {
              "text": "Une équation différentielle qui inclut un terme de bruit blanc ou un mouvement brownien.",
              "correct": true
            },
            {
              "text": "Une équation différentielle qui n'a pas de solution analytique.",
              "correct": false
            },
            {
              "text": "Une équation différentielle ordinaire avec des conditions initiales aléatoires.",
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
    "Björk, T. (2009). Arbitrage theory in continuous time (3rd ed.). Oxford University Press.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman & Hall/CRC.",
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson.",
    "Karatzas, I., & Shreve, S. E. (1991). Brownian motion and stochastic calculus (2nd ed.). Springer-Verlag.",
    "Merton, R. C. (1990). Continuous-time finance. Blackwell.",
    "Øksendal, B. (2003). Stochastic differential equations: An introduction with applications (6th ed.). Springer-Verlag.",
    "Protter, P. E. (2005). Stochastic integration and differential equations (2nd ed.). Springer.",
    "Revuz, D., & Yor, M. (1999). Continuous martingales and Brownian motion (3rd ed.). Springer.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer.",
    "Steele, J. M. (2001). Stochastic calculus and financial applications. Springer."
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