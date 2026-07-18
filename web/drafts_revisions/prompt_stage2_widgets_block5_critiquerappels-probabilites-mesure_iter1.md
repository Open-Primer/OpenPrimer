You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce qu'une sigma-algèbre (ou tribu) sur un ensemble Ω ?",
          "explanation": "Une sigma-algèbre est une collection de sous-ensembles d'un ensemble Ω qui satisfait trois propriétés: elle contient l'ensemble vide, elle est fermée sous l'opération de complémentation, et elle est fermée sous l'opération d'union dénombrable.",
          "options": [
            {
              "text": "Un ensemble de sous-ensembles de Ω qui contient Ω et est fermé par complémentation et unions finies.",
              "correct": false
            },
            {
              "text": "Un ensemble de sous-ensembles de Ω qui contient l'ensemble vide et est fermé par complémentation et unions dénombrables.",
              "correct": true
            },
            {
              "text": "Un ensemble de sous-ensembles de Ω qui contient Ω et est fermé par intersection et unions finies.",
              "correct": false
            },
            {
              "text": "Un ensemble de sous-ensembles de Ω qui contient l'ensemble vide et est fermé par intersection et unions dénombrables.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Parmi les propositions suivantes, laquelle est une propriété fondamentale d'une mesure de probabilité P sur un espace mesurable (Ω, F) ?",
          "explanation": "La sigma-additivité est une propriété clé d'une mesure de probabilité, stipulant que la probabilité d'une union dénombrable d'événements mutuellement exclusifs est la somme de leurs probabilités individuelles.",
          "options": [
            {
              "text": "P(Ω) = 0.",
              "correct": false
            },
            {
              "text": "P(A ∪ B) = P(A) + P(B) pour tous A, B ∈ F.",
              "correct": false
            },
            {
              "text": "Pour toute suite d'événements disjoints (An)n≥1 dans F, P(∪n=1∞ An) = ∑n=1∞ P(An).",
              "correct": true
            },
            {
              "text": "P(A) peut être négatif pour certains événements A.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "En théorie de la mesure, une variable aléatoire X est une fonction mesurable. Qu'est-ce que cela signifie ?",
          "explanation": "Une variable aléatoire est une fonction mesurable, ce qui signifie que l'image inverse de tout ensemble mesurable (généralement un borélien) de l'espace d'arrivée est un ensemble mesurable (un événement) dans l'espace de départ.",
          "options": [
            {
              "text": "Pour tout ensemble borélien B dans l'espace d'arrivée, l'image inverse X⁻¹(B) est un événement dans l'espace de départ.",
              "correct": false
            },
            {
              "text": "Pour tout ensemble borélien B dans l'espace d'arrivée, l'image inverse X⁻¹(B) appartient à la sigma-algèbre de l'espace de départ.",
              "correct": true
            },
            {
              "text": "Pour tout événement A dans l'espace de départ, l'image X(A) est un ensemble borélien dans l'espace d'arrivée.",
              "correct": false
            },
            {
              "text": "La fonction X est continue.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Soit X une variable aléatoire discrète prenant des valeurs x_i avec probabilités p_i, et Y une variable aléatoire continue de densité f_Y(y). Quelle est la formule correcte pour l'espérance E[X] et E[Y] ?",
          "explanation": "L'espérance d'une variable aléatoire discrète est la somme des produits de chaque valeur par sa probabilité. Pour une variable aléatoire continue, c'est l'intégrale du produit de la variable par sa fonction de densité de probabilité.",
          "options": [
            {
              "text": "E[X] = ∑x_i * p_i et E[Y] = ∫y * f_Y(y) dy.",
              "correct": true
            },
            {
              "text": "E[X] = ∑p_i et E[Y] = ∫f_Y(y) dy.",
              "correct": false
            },
            {
              "text": "E[X] = ∑x_i et E[Y] = ∫y dy.",
              "correct": false
            },
            {
              "text": "E[X] = ∑x_i² * p_i et E[Y] = ∫y² * f_Y(y) dy.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Deux événements A et B sont dits indépendants si :",
          "explanation": "L'indépendance de deux événements A et B est définie par la propriété que la probabilité de leur intersection est égale au produit de leurs probabilités individuelles.",
          "options": [
            {
              "text": "P(A ∩ B) = P(A) + P(B).",
              "correct": false
            },
            {
              "text": "P(A | B) = P(B).",
              "correct": false
            },
            {
              "text": "P(A ∩ B) = P(A) * P(B).",
              "correct": true
            },
            {
              "text": "A et B sont mutuellement exclusifs.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel est l'avantage principal de l'intégrale de Lebesgue par rapport à l'intégrale de Riemann, particulièrement en théorie des probabilités ?",
          "explanation": "L'intégrale de Lebesgue est plus puissante car elle permet d'intégrer une classe plus large de fonctions (fonctions mesurables) sur des ensembles plus généraux, et elle possède de meilleures propriétés de convergence, ce qui est crucial pour les théorèmes limites en probabilités.",
          "options": [
            {
              "text": "Elle est plus facile à calculer pour les fonctions continues.",
              "correct": false
            },
            {
              "text": "Elle permet d'intégrer des fonctions sur des ensembles plus généraux et gère mieux les limites de suites de fonctions.",
              "correct": true
            },
            {
              "text": "Elle ne s'applique qu'aux fonctions positives.",
              "correct": false
            },
            {
              "text": "Elle est définie uniquement pour les variables aléatoires discrètes.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "La convergence presque sûre d'une suite de variables aléatoires (Xn) vers X implique-t-elle la convergence en probabilité ?",
          "explanation": "La convergence presque sûre est une forme de convergence plus forte que la convergence en probabilité. Si une suite de variables aléatoires converge presque sûrement, elle converge également en probabilité.",
          "options": [
            {
              "text": "Non, jamais.",
              "correct": false
            },
            {
              "text": "Oui, toujours.",
              "correct": true
            },
            {
              "text": "Seulement si les variables sont bornées.",
              "correct": false
            },
            {
              "text": "Seulement si l'espace de probabilité est fini.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "L'espérance conditionnelle E[X | G] d'une variable aléatoire X par rapport à une sous-sigma-algèbre G est elle-même :",
          "explanation": "L'espérance conditionnelle E[X | G] est une variable aléatoire qui est mesurable par rapport à la sous-sigma-algèbre G et qui représente la \"meilleure\" prédiction de X étant donné l'information contenue dans G.",
          "options": [
            {
              "text": "Une constante.",
              "correct": false
            },
            {
              "text": "Une variable aléatoire mesurable par rapport à G.",
              "correct": true
            },
            {
              "text": "Une fonction de densité de probabilité.",
              "correct": false
            },
            {
              "text": "Toujours égale à E[X].",
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
    "Billingsley, P. (1995). Probability and Measure (3rd ed.). Wiley.",
    "Durrett, R. (2019). Probability: Theory and Examples (5th ed.). Cambridge University Press.",
    "Feller, W. (1968). An Introduction to Probability Theory and Its Applications, Vol. 1 (3rd ed.). Wiley.",
    "Karatzas, I., & Shreve, S. E. (1991). Brownian Motion and Stochastic Calculus (2nd ed.). Springer.",
    "Neveu, J. (1975). Discrete-Parameter Martingales. North-Holland.",
    "Øksendal, B. (2003). Stochastic Differential Equations: An Introduction with Applications (6th ed.). Springer.",
    "Protter, P. E. (2005). Stochastic Integration and Differential Equations (2nd ed.). Springer.",
    "Revuz, D., & Yor, M. (1999). Continuous Martingales and Brownian Motion (3rd ed.). Springer.",
    "Shiryaev, A. N. (1996). Probability. Springer.",
    "Williams, D. (1991). Probability with Martingales. Cambridge University Press."
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