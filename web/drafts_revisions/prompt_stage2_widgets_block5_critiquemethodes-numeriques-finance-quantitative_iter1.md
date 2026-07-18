You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quel est l'un des principaux avantages de la méthode de Monte Carlo pour l'évaluation des options exotiques ?",
          "explanation": "La méthode de Monte Carlo est particulièrement adaptée aux options exotiques car elle permet de simuler un grand nombre de trajectoires du sous-jacent, capturant ainsi des dépendances complexes et des caractéristiques de paiement non linéaires. Sa convergence est en O(1/√N), ce qui est relativement lent.",
          "options": [
            {
              "text": "Sa rapidité de convergence quadratique.",
              "correct": false
            },
            {
              "text": "Sa capacité à gérer des chemins de dépendance complexes.",
              "correct": true
            },
            {
              "text": "Sa précision garantie même avec un petit nombre de simulations.",
              "correct": false
            },
            {
              "text": "Sa simplicité de mise en œuvre pour les options de style américain.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelles méthodes aux différences finies sont inconditionnellement stables pour l'équation de Black-Scholes ?",
          "explanation": "La méthode implicite et la méthode de Crank-Nicolson sont inconditionnellement stables pour l'équation de Black-Scholes, contrairement à la méthode explicite qui a des conditions de stabilité restrictives. Monte Carlo n'est pas une méthode aux différences finies.",
          "options": [
            {
              "text": "La méthode explicite.",
              "correct": false
            },
            {
              "text": "La méthode implicite.",
              "correct": true
            },
            {
              "text": "La méthode de Crank-Nicolson.",
              "correct": true
            },
            {
              "text": "La méthode de Monte Carlo.",
              "correct": false
            }
          ],
          "multiple": true
        },
        {
          "q": "Pour l'évaluation d'une option américaine, pourquoi les arbres binomiaux sont-ils souvent préférés aux méthodes de Monte Carlo standard ?",
          "explanation": "Les arbres binomiaux permettent de modéliser l'exercice anticipé d'une option américaine en comparant la valeur de l'option si elle est exercée immédiatement à sa valeur si elle est maintenue à chaque nœud de l'arbre. Les méthodes de Monte Carlo standard ont des difficultés avec l'exercice anticipé.",
          "options": [
            {
              "text": "Les arbres binomiaux sont toujours plus rapides.",
              "correct": false
            },
            {
              "text": "Les arbres binomiaux gèrent naturellement l'exercice anticipé.",
              "correct": true
            },
            {
              "text": "Les arbres binomiaux sont plus précis pour un grand nombre de pas de temps.",
              "correct": false
            },
            {
              "text": "Les arbres binomiaux ne nécessitent pas de discrétisation du temps.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Lors de la simulation d'une équation différentielle stochastique (EDS) par la méthode d'Euler-Maruyama, quel est l'impact principal d'une taille de pas de temps (Δt) trop grande ?",
          "explanation": "Une taille de pas de temps trop grande dans la méthode d'Euler-Maruyama peut entraîner une accumulation d'erreurs de discrétisation, une perte de précision et, dans certains cas, une instabilité numérique conduisant à une divergence de la simulation par rapport à la vraie trajectoire du processus stochastique.",
          "options": [
            {
              "text": "Une convergence plus rapide vers la solution exacte.",
              "correct": false
            },
            {
              "text": "Une augmentation de la stabilité numérique.",
              "correct": false
            },
            {
              "text": "Une erreur de discrétisation plus importante et potentiellement une divergence.",
              "correct": true
            },
            {
              "text": "Une réduction de la variance des estimateurs.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Parmi les techniques suivantes, laquelle est une méthode de réduction de variance couramment utilisée en simulation de Monte Carlo pour l'évaluation d'options ?",
          "explanation": "La méthode des variables de contrôle est une technique efficace pour réduire la variance des estimateurs de Monte Carlo en utilisant une variable corrélée dont l'espérance est connue analytiquement. Les autres options sont des méthodes numériques pour d'autres problèmes.",
          "options": [
            {
              "text": "La méthode des différences finies.",
              "correct": false
            },
            {
              "text": "La méthode des variables de contrôle.",
              "correct": true
            },
            {
              "text": "La méthode de Newton-Raphson.",
              "correct": false
            },
            {
              "text": "La méthode des moindres carrés.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce que la calibration d'un modèle en finance quantitative ?",
          "explanation": "La calibration consiste à trouver les valeurs des paramètres d'un modèle (par exemple, volatilité, taux d'intérêt, paramètres de saut) qui minimisent l'écart entre les prix des instruments financiers dérivés calculés par le modèle et leurs prix observés sur le marché.",
          "options": [
            {
              "text": "Le processus de validation d'un modèle par rapport à des données historiques.",
              "correct": false
            },
            {
              "text": "L'ajustement des paramètres d'un modèle pour qu'il corresponde aux prix observés sur le marché.",
              "correct": true
            },
            {
              "text": "La simplification d'un modèle complexe pour le rendre plus rapide à calculer.",
              "correct": false
            },
            {
              "text": "La détermination de la meilleure méthode numérique pour résoudre un modèle donné.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Pour l'évaluation d'une option européenne simple (sans exercice anticipé) dont le sous-jacent suit un processus de Black-Scholes, quelle méthode est généralement la plus efficace en termes de vitesse et de précision ?",
          "explanation": "Pour les options européennes simples, la résolution de l'équation aux dérivées partielles (EDP) de Black-Scholes via des méthodes aux différences finies (ou même une solution analytique si disponible) est généralement plus rapide et plus précise que Monte Carlo, qui nécessite un grand nombre de simulations pour converger. Les arbres binomiaux sont aussi efficaces mais FDM est souvent plus rapide pour les EDP.",
          "options": [
            {
              "text": "La simulation de Monte Carlo.",
              "correct": false
            },
            {
              "text": "Les méthodes aux différences finies (FDM) pour résoudre l'EDP de Black-Scholes.",
              "correct": true
            },
            {
              "text": "Les arbres binomiaux avec un grand nombre de pas.",
              "correct": false
            },
            {
              "text": "La méthode des éléments finis.",
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
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer.",
    "Glasserman, P. (2004). Monte Carlo methods in financial engineering. Springer.",
    "Wilmott, P. (2006). Paul Wilmott on quantitative finance (2nd ed.). Wiley.",
    "Higham, D. J. (2001). An algorithmic introduction to numerical methods for stochastic differential equations. SIAM Review, 43(3), 525-546.",
    "Tavella, D., & Randall, C. (2000). Pricing financial instruments: The finite difference method. Wiley.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman and Hall/CRC.",
    "Kloeden, P. E., & Platen, E. (1992). Numerical solution of stochastic differential equations. Springer.",
    "Broadie, M., & Glasserman, P. P. (1997). Pricing American-style securities using simulation. Journal of Economic Dynamics and Control, 21(5-6), 1123-1152.",
    "Andersen, L., & Piterbarg, V. (2010). Interest rate modeling. Atlantic Financial Press."
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