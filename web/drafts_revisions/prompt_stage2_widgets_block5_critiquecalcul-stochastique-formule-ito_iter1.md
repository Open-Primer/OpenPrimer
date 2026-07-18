You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce qui caractérise un mouvement brownien standard (ou processus de Wiener) ?",
          "explanation": "Un mouvement brownien standard est caractérisé par des accroissements indépendants et stationnaires, une moyenne nulle et une variance proportionnelle au temps. Il est continu mais nulle part différentiable.",
          "options": [
            {
              "text": "Il a des accroissements stationnaires et indépendants.",
              "correct": true
            },
            {
              "text": "Il est déterministe.",
              "correct": false
            },
            {
              "text": "Sa variance est constante.",
              "correct": false
            },
            {
              "text": "Il est toujours positif.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la principale différence entre le calcul stochastique et le calcul différentiel classique ?",
          "explanation": "Le calcul stochastique est spécifiquement conçu pour manipuler des fonctions de processus aléatoires, notamment ceux qui ne sont pas différentiables au sens classique, comme le mouvement brownien, en tenant compte de leur variation quadratique.",
          "options": [
            {
              "text": "Le calcul stochastique traite des fonctions aléatoires et intègre un terme de variation quadratique.",
              "correct": true
            },
            {
              "text": "Le calcul stochastique utilise des dérivées partielles uniquement.",
              "correct": false
            },
            {
              "text": "Le calcul stochastique ne s'applique qu'aux processus discrets.",
              "correct": false
            },
            {
              "text": "Le calcul stochastique ne permet pas d'intégrer.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "La formule d'Itô est utilisée pour différentier quelle type de fonction ?",
          "explanation": "La formule d'Itô est une généralisation de la règle de la chaîne pour les fonctions de processus stochastiques (plus précisément, de processus d'Itô), permettant de calculer la différentielle d'une fonction d'un tel processus.",
          "options": [
            {
              "text": "Une fonction d'une variable déterministe.",
              "correct": false
            },
            {
              "text": "Une fonction d'un processus stochastique (comme un mouvement brownien).",
              "correct": true
            },
            {
              "text": "Une fonction linéaire.",
              "correct": false
            },
            {
              "text": "Une fonction constante.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel terme additionnel apparaît dans la formule d'Itô par rapport à la règle de la chaîne classique ?",
          "explanation": "La formule d'Itô inclut un terme de correction lié à la variation quadratique du processus stochastique, souvent exprimé comme (1/2) * (dérivée seconde de la fonction par rapport au processus) * (variation quadratique du processus). Ce terme est absent en calcul classique car la variation quadratique des fonctions différentiables est nulle.",
          "options": [
            {
              "text": "Un terme de dérivée seconde par rapport au temps.",
              "correct": false
            },
            {
              "text": "Un terme impliquant la variation quadratique du processus stochastique.",
              "correct": true
            },
            {
              "text": "Un terme de dérivée première par rapport à la variable stochastique.",
              "correct": false
            },
            {
              "text": "Un terme de covariance.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Si S_t suit un mouvement brownien géométrique dS_t = rS_t dt + σS_t dW_t, quelle est la dynamique de ln(S_t) selon la formule d'Itô ?",
          "explanation": "En appliquant la formule d'Itô à f(S_t) = ln(S_t), on a ∂f/∂S = 1/S_t et ∂²f/∂S² = -1/S_t². Le terme (dS_t)² est (σS_t dW_t)² = σ²S_t² dt. Ainsi, d(ln S_t) = (1/S_t)(rS_t dt + σS_t dW_t) + (1/2)(-1/S_t²)(σ²S_t² dt) = (r dt + σ dW_t) - (σ²/2) dt = (r - σ²/2) dt + σ dW_t.",
          "options": [
            {
              "text": "d(ln S_t) = (r - σ²/2) dt + σ dW_t",
              "correct": true
            },
            {
              "text": "d(ln S_t) = r dt + σ dW_t",
              "correct": false
            },
            {
              "text": "d(ln S_t) = (r + σ²/2) dt + σ dW_t",
              "correct": false
            },
            {
              "text": "d(ln S_t) = σ dW_t",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Qu'est-ce que l'intégrale d'Itô ?",
          "explanation": "L'intégrale d'Itô est une construction fondamentale du calcul stochastique, permettant d'intégrer des processus stochastiques par rapport à un mouvement brownien. Une condition clé est que l'intégrande doit être non anticipatif (adapté au filtre généré par le mouvement brownien).",
          "options": [
            {
              "text": "Une intégrale définie pour des fonctions déterministes.",
              "correct": false
            },
            {
              "text": "Une intégrale où l'intégrande est un processus stochastique non anticipatif par rapport à un mouvement brownien.",
              "correct": true
            },
            {
              "text": "Une intégrale qui ne peut être calculée que numériquement.",
              "correct": false
            },
            {
              "text": "Une intégrale qui ne s'applique qu'aux processus de Poisson.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "La variation quadratique d'un mouvement brownien W_t sur l'intervalle [0, T] est égale à :",
          "explanation": "La variation quadratique d'un mouvement brownien standard W_t sur un intervalle [0, T] est définie comme la limite en moyenne quadratique de la somme des carrés des accroissements sur une partition de l'intervalle, et elle est égale à T.",
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
              "text": "W_T",
              "correct": false
            },
            {
              "text": "T²",
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
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer Science & Business Media.",
    "Karatzas, I., & Shreve, S. E. (1991). Brownian motion and stochastic calculus. Springer Science & Business Media.",
    "Øksendal, B. (2003). Stochastic differential equations: An introduction with applications. Springer Science & Business Media.",
    "Protter, P. E. (2004). Stochastic integration and differential equations. Springer Science & Business Media.",
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson Education.",
    "Baxter, M., & Rennie, A. (1996). Financial calculus: An introduction to derivative pricing. Cambridge University Press.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman and Hall/CRC.",
    "Rogers, L. C. G., & Williams, D. (2000). Diffusions, Markov processes, and martingales: Volume 1, Foundations. Cambridge University Press.",
    "Merton, R. C. (1973). Theory of rational option pricing. The Bell Journal of Economics and Management Science, 4(1), 141-183.",
    "Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. Journal of Political Economy, 81(3), 637-654.",
    "Revuz, D., & Yor, M. (1999). Continuous martingales and Brownian motion (3rd ed.). Springer Science & Business Media.",
    "Klebaner, F. C. (2012). Introduction to stochastic calculus with applications (3rd ed.). Imperial College Press."
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