You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quel est l'un des principaux inconvénients du modèle de Vasicek pour la modélisation des taux d'intérêt?",
          "explanation": "Le modèle de Vasicek, bien que simple et analytiquement traitable, permet aux taux d'intérêt de devenir négatifs, ce qui n'est pas toujours réaliste dans certains contextes de marché.",
          "options": [
            {
              "text": "Il ne permet pas la réversion à la moyenne.",
              "correct": false
            },
            {
              "text": "Il ne peut pas être calibré aux données de marché.",
              "correct": false
            },
            {
              "text": "Il permet aux taux d'intérêt de devenir négatifs.",
              "correct": true
            },
            {
              "text": "Il est trop complexe à implémenter.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle caractéristique clé le modèle de Cox-Ingersoll-Ross (CIR) possède-t-il par rapport au modèle de Vasicek concernant les taux d'intérêt?",
          "explanation": "Le modèle CIR garantit que les taux d'intérêt restent non-négatifs, ce qui est une amélioration significative par rapport au modèle de Vasicek qui peut générer des taux négatifs.",
          "options": [
            {
              "text": "Il est plus simple à calibrer.",
              "correct": false
            },
            {
              "text": "Il ne permet pas la réversion à la moyenne.",
              "correct": false
            },
            {
              "text": "Il garantit des taux d'intérêt non-négatifs.",
              "correct": true
            },
            {
              "text": "Il est un modèle à plusieurs facteurs.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la principale différence entre les modèles de taux courts (comme Vasicek ou CIR) et le cadre Heath-Jarrow-Morton (HJM)?",
          "explanation": "Les modèles de taux courts modélisent l'évolution du taux d'intérêt instantané, tandis que le cadre HJM modélise directement l'évolution de l'ensemble de la courbe des taux forward, assurant l'absence d'arbitrage par construction.",
          "options": [
            {
              "text": "Les modèles de taux courts sont toujours plus précis.",
              "correct": false
            },
            {
              "text": "Le cadre HJM modélise directement la courbe des taux forward, tandis que les modèles de taux courts modélisent le taux instantané.",
              "correct": true
            },
            {
              "text": "Les modèles de taux courts sont des modèles à plusieurs facteurs, contrairement à HJM.",
              "correct": false
            },
            {
              "text": "Le cadre HJM ne permet pas la réversion à la moyenne.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est l'objectif principal de la calibration d'un modèle de taux d'intérêt?",
          "explanation": "La calibration consiste à ajuster les paramètres du modèle pour qu'il corresponde le mieux possible aux prix observés sur le marché des instruments financiers, tels que les obligations ou les swaps.",
          "options": [
            {
              "text": "Déterminer la valeur future des taux d'intérêt avec certitude.",
              "correct": false
            },
            {
              "text": "Ajuster les paramètres du modèle pour qu'il corresponde aux prix de marché actuels.",
              "correct": true
            },
            {
              "text": "Simplifier la complexité mathématique du modèle.",
              "correct": false
            },
            {
              "text": "Éliminer toute incertitude stochastique du modèle.",
              "correct": false
            }
          ]
        },
        {
          "q": "Que signifie le concept de 'réversion à la moyenne' dans le contexte des modèles de taux d'intérêt?",
          "explanation": "La réversion à la moyenne implique que les taux d'intérêt ont tendance à revenir vers une valeur moyenne à long terme, plutôt que de dériver indéfiniment dans une direction.",
          "options": [
            {
              "text": "Les taux d'intérêt sont toujours constants.",
              "correct": false
            },
            {
              "text": "Les taux d'intérêt ont tendance à revenir vers une valeur moyenne à long terme.",
              "correct": true
            },
            {
              "text": "Les taux d'intérêt augmentent ou diminuent de manière aléatoire sans tendance.",
              "correct": false
            },
            {
              "text": "Les taux d'intérêt sont toujours négatifs.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce que le principe de 'non-arbitrage' implique pour la modélisation des taux d'intérêt?",
          "explanation": "Le principe de non-arbitrage stipule qu'il ne doit pas être possible de réaliser un profit sans risque en exploitant des différences de prix sur le marché. Les modèles de taux d'intérêt doivent être construits pour respecter ce principe.",
          "options": [
            {
              "text": "Il est toujours possible de faire un profit sans risque.",
              "correct": false
            },
            {
              "text": "Les modèles doivent être construits de manière à ne pas permettre de profits sans risque.",
              "correct": true
            },
            {
              "text": "Les taux d'intérêt sont toujours nuls.",
              "correct": false
            },
            {
              "text": "Seuls les modèles stochastiques peuvent respecter ce principe.",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce qu'une courbe de rendement (yield curve) dans le contexte des taux d'intérêt?",
          "explanation": "La courbe de rendement est une représentation graphique de la relation entre le rendement des obligations (ou d'autres instruments de taux) et leur échéance, à un moment donné.",
          "options": [
            {
              "text": "Un graphique montrant l'évolution historique d'un seul taux d'intérêt.",
              "correct": false
            },
            {
              "text": "La relation entre le rendement et l'échéance des instruments de taux d'intérêt à un moment donné.",
              "correct": true
            },
            {
              "text": "Le taux d'inflation attendu sur différentes périodes.",
              "correct": false
            },
            {
              "text": "La volatilité des taux d'intérêt au fil du temps.",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 1800
    }
  },
  "references": [
    "Andersen, L., & Piterbarg, V. (2010). Interest rate modeling. Atlantic Financial Press.",
    "Björk, T. (2009). Arbitrage theory in continuous time (3rd ed.). Oxford University Press.",
    "Brace, A., Gatarek, D., & Musiela, M. (1997). The market model of interest rate dynamics. Mathematical Finance, 7(1), 127-144.",
    "Cox, J. C., Ingersoll, J. E., & Ross, S. A. (1985). A theory of the term structure of interest rates. Econometrica: Journal of the Econometric Society, 385-407.",
    "Filipović, D. (2009). Term-structure models: A graduate course. Springer.",
    "Heath, D., Jarrow, R., & Morton, A. (1992). Bond pricing and the term structure of interest rates: A new approach. Econometrica: Journal of the Econometric Society, 60(1), 77-105.",
    "Hull, J. C., & White, A. (1990). Pricing interest-rate-derivative securities. The Review of Financial Studies, 3(4), 573-592.",
    "Rebonato, R. (2002). Modern pricing of interest-rate derivatives: The LIBOR market model and beyond. Princeton University Press.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer Science & Business Media.",
    "Vasicek, O. A. (1977). An equilibrium characterization of the term structure. Journal of Financial Economics, 5(2), 177-188."
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