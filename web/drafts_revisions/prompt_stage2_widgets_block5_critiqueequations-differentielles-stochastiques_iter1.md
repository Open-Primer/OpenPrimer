You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce qu'une Équation Différentielle Stochastique (EDS) ?",
          "explanation": "Une EDS est une équation différentielle où le terme de perturbation est un processus stochastique, généralement un mouvement brownien (processus de Wiener), ce qui la distingue des équations différentielles ordinaires.",
          "options": [
            {
              "text": "Une équation différentielle dont les coefficients sont des variables aléatoires.",
              "correct": false
            },
            {
              "text": "Une équation différentielle qui inclut un terme de bruit blanc modélisé par un processus de Wiener.",
              "correct": true
            },
            {
              "text": "Une équation différentielle ordinaire résolue par des méthodes stochastiques.",
              "correct": false
            },
            {
              "text": "Une équation différentielle partielle utilisée en finance quantitative.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel est le rôle principal du Lemme d'Itô dans la résolution des EDS ?",
          "explanation": "Le Lemme d'Itô est un outil fondamental pour différencier des fonctions de processus stochastiques, car les règles de calcul différentiel classique ne s'appliquent pas directement en raison de la non-différentiabilité du mouvement brownien.",
          "options": [
            {
              "text": "Il permet de calculer la dérivée d'une fonction d'un processus stochastique.",
              "correct": true
            },
            {
              "text": "Il fournit une solution analytique directe pour toutes les EDS.",
              "correct": false
            },
            {
              "text": "Il transforme une EDS en une équation différentielle ordinaire.",
              "correct": false
            },
            {
              "text": "Il est utilisé pour simuler numériquement les trajectoires des EDS.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Comment le modèle de Black-Scholes est-il lié aux Équations Différentielles Stochastiques ?",
          "explanation": "Le modèle de Black-Scholes suppose que le prix de l'actif sous-jacent suit une EDS de type mouvement brownien géométrique, ce qui est la base de la dérivation de l'équation aux dérivées partielles de Black-Scholes.",
          "options": [
            {
              "text": "Le prix de l'option dans le modèle de Black-Scholes est la solution d'une EDS.",
              "correct": false
            },
            {
              "text": "Le prix de l'actif sous-jacent dans le modèle de Black-Scholes est modélisé par une EDS.",
              "correct": true
            },
            {
              "text": "Le modèle de Black-Scholes utilise des EDS pour calibrer les paramètres du marché.",
              "correct": false
            },
            {
              "text": "Les EDS sont utilisées pour dériver la formule de Black-Scholes sans mouvement brownien.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans une EDS de la forme dXt = μ(Xt, t)dt + σ(Xt, t)dWt, que représentent μ(Xt, t) et σ(Xt, t) ?",
          "explanation": "μ(Xt, t) est le coefficient de dérive (drift), représentant la tendance déterministe du processus, tandis que σ(Xt, t) est le coefficient de diffusion (diffusion), représentant l'amplitude de la composante stochastique (bruit).",
          "options": [
            {
              "text": "μ est le terme de diffusion et σ est le terme de dérive.",
              "correct": false
            },
            {
              "text": "μ est le terme de dérive et σ est le terme de diffusion.",
              "correct": true
            },
            {
              "text": "μ et σ sont tous deux des termes de bruit.",
              "correct": false
            },
            {
              "text": "μ et σ sont des constantes de corrélation.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la différence principale entre une solution forte et une solution faible d'une EDS ?",
          "explanation": "Une solution forte est un processus stochastique qui satisfait l'EDS sur un espace de probabilité et un mouvement brownien donnés. Une solution faible est un couple (processus, mouvement brownien) sur un espace de probabilité potentiellement différent, qui satisfait l'EDS.",
          "options": [
            {
              "text": "Une solution forte est déterministe, tandis qu'une solution faible est stochastique.",
              "correct": false
            },
            {
              "text": "Une solution forte est un processus stochastique défini sur l'espace de probabilité donné, tandis qu'une solution faible est un processus stochastique pour lequel on peut trouver un espace de probabilité approprié.",
              "correct": true
            },
            {
              "text": "Une solution forte est une solution analytique, tandis qu'une solution faible est une solution numérique.",
              "correct": false
            },
            {
              "text": "Une solution forte existe toujours, alors qu'une solution faible n'existe que sous certaines conditions.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle méthode est couramment utilisée pour la simulation numérique des trajectoires d'une EDS ?",
          "explanation": "La méthode d'Euler-Maruyama est une extension de la méthode d'Euler pour les équations différentielles ordinaires, adaptée aux EDS en discrétisant le temps et en ajoutant un terme de bruit aléatoire.",
          "options": [
            {
              "text": "La méthode de Newton-Raphson.",
              "correct": false
            },
            {
              "text": "La méthode d'Euler-Maruyama.",
              "correct": true
            },
            {
              "text": "La méthode des moindres carrés ordinaires.",
              "correct": false
            },
            {
              "text": "La transformée de Fourier rapide.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Sous quelles conditions un processus d'Itô est-il une martingale ?",
          "explanation": "Un processus d'Itô X_t = X_0 + ∫_0^t μ_s ds + ∫_0^t σ_s dW_s est une martingale si son terme de dérive (μ_s) est nul, sous certaines conditions d'intégrabilité.",
          "options": [
            {
              "text": "Si son terme de dérive est nul.",
              "correct": true
            },
            {
              "text": "Si son terme de diffusion est nul.",
              "correct": false
            },
            {
              "text": "Si les coefficients de dérive et de diffusion sont constants.",
              "correct": false
            },
            {
              "text": "Si le processus est borné.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "À quoi sert le théorème de Girsanov en finance quantitative ?",
          "explanation": "Le théorème de Girsanov permet de passer d'une mesure de probabilité à une autre (par exemple, de la mesure historique à la mesure risque-neutre) tout en transformant le mouvement brownien, ce qui est essentiel pour la valorisation des produits dérivés.",
          "options": [
            {
              "text": "À trouver des solutions analytiques aux EDS non linéaires.",
              "correct": false
            },
            {
              "text": "À changer la mesure de probabilité sous laquelle un processus de Wiener est défini, ce qui est crucial pour la valorisation sans arbitrage.",
              "correct": true
            },
            {
              "text": "À prouver l'existence et l'unicité des solutions d'EDS.",
              "correct": false
            },
            {
              "text": "À simuler des trajectoires de processus stochastiques plus efficacement.",
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
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman and Hall/CRC.",
    "Glasserman, P. (2004). Monte Carlo methods in financial engineering. Springer.",
    "Higham, D. J. (2001). An algorithmic introduction to numerical simulation of stochastic differential equations. SIAM Review, 43(3), 525-546.",
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson.",
    "Karatzas, I., & Shreve, S. E. (1991). Brownian motion and stochastic calculus (2nd ed.). Springer.",
    "Klebaner, F. C. (2012). Introduction to stochastic calculus with applications (3rd ed.). Imperial College Press.",
    "Oksendal, B. (2003). Stochastic differential equations: An introduction with applications (6th ed.). Springer.",
    "Protter, P. E. (2005). Stochastic integration and differential equations (2nd ed.). Springer.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer."
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