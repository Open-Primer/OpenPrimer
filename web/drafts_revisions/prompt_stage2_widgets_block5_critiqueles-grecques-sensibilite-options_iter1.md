You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Qu'est-ce que le Delta d'une option?",
          "explanation": "Le Delta mesure la variation du prix d'une option pour une variation d'un euro du prix de l'actif sous-jacent. Il est crucial pour la couverture en Delta.",
          "options": [
            {
              "text": "La sensibilité du prix de l'option aux variations du taux d'intérêt.",
              "correct": false
            },
            {
              "text": "La sensibilité du prix de l'option aux variations du prix de l'actif sous-jacent.",
              "correct": true
            },
            {
              "text": "La sensibilité du prix de l'option aux variations de la volatilité implicite.",
              "correct": false
            },
            {
              "text": "La sensibilité du prix de l'option au passage du temps.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Le Gamma d'une option mesure:",
          "explanation": "Le Gamma est la dérivée seconde du prix de l'option par rapport au prix de l'actif sous-jacent, ou la sensibilité du Delta. Un Gamma élevé indique que le Delta change rapidement.",
          "options": [
            {
              "text": "La sensibilité du Delta de l'option aux variations du prix de l'actif sous-jacent.",
              "correct": true
            },
            {
              "text": "La sensibilité du prix de l'option aux variations du taux d'intérêt.",
              "correct": false
            },
            {
              "text": "La sensibilité du prix de l'option aux variations de la volatilité.",
              "correct": false
            },
            {
              "text": "La sensibilité du prix de l'option aux variations du temps.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Comment le Theta d'une option se comporte-t-il généralement à l'approche de l'échéance pour une option hors de la monnaie?",
          "explanation": "Le Theta mesure l'érosion de la valeur de l'option due au passage du temps. Pour les options hors de la monnaie, le Theta s'accélère à l'approche de l'échéance, signifiant une perte de valeur plus rapide.",
          "options": [
            {
              "text": "Il devient moins négatif.",
              "correct": false
            },
            {
              "text": "Il devient plus négatif (en valeur absolue).",
              "correct": true
            },
            {
              "text": "Il reste constant.",
              "correct": false
            },
            {
              "text": "Il devient positif.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle Grecque est la plus pertinente pour évaluer le risque lié aux changements de la volatilité du marché?",
          "explanation": "Le Vega mesure la sensibilité du prix d'une option aux variations de la volatilité implicite de l'actif sous-jacent. Il est essentiel pour gérer le risque de volatilité.",
          "options": [
            {
              "text": "Delta",
              "correct": false
            },
            {
              "text": "Gamma",
              "correct": false
            },
            {
              "text": "Vega",
              "correct": true
            },
            {
              "text": "Rho",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Le Rho d'une option de vente (put) est généralement:",
          "explanation": "Le Rho mesure la sensibilité du prix de l'option aux variations des taux d'intérêt sans risque. Pour une option de vente, une augmentation des taux d'intérêt diminue généralement sa valeur, rendant le Rho négatif.",
          "options": [
            {
              "text": "Positif.",
              "correct": false
            },
            {
              "text": "Négatif.",
              "correct": true
            },
            {
              "text": "Nul.",
              "correct": false
            },
            {
              "text": "Indépendant des taux d'intérêt.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Pour une couverture Delta-neutre, un portefeuille doit avoir un Delta total de:",
          "explanation": "Un portefeuille Delta-neutre est conçu pour que sa valeur ne change pas pour de petites variations du prix de l'actif sous-jacent, ce qui est atteint lorsque le Delta total du portefeuille est nul.",
          "options": [
            {
              "text": "1",
              "correct": false
            },
            {
              "text": "-1",
              "correct": false
            },
            {
              "text": "0",
              "correct": true
            },
            {
              "text": "Indéfini",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Pour une option d'achat (call) à la monnaie (at-the-money), le Delta est approximativement:",
          "explanation": "Pour une option d'achat à la monnaie, la probabilité qu'elle expire dans la monnaie est d'environ 50%, d'où un Delta proche de 0.5.",
          "options": [
            {
              "text": "0",
              "correct": false
            },
            {
              "text": "0.5",
              "correct": true
            },
            {
              "text": "1",
              "correct": false
            },
            {
              "text": "-0.5",
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
    "Black, F., & Scholes, M. (1973). The pricing of options and corporate liabilities. Journal of Political Economy, 81(3), 637-654.",
    "Hull, J. C. (2021). Options, futures, and other derivatives (11th ed.). Pearson.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer.",
    "Baxter, M., & Rennie, A. (1996). Financial calculus: An introduction to derivative pricing. Cambridge University Press.",
    "Wilmott, P. (2006). Paul Wilmott on quantitative finance (2nd ed.). John Wiley & Sons.",
    "Merton, R. C. (1973). Theory of rational option pricing. The Bell Journal of Economics and Management Science, 4(1), 141-183.",
    "Dupire, B. (1994). Pricing with a smile. Risk, 7(1), 18-20.",
    "Rebonato, R. (2004). Volatility and correlation: The perfect hedger and the fox. John Wiley & Sons.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman & Hall/CRC.",
    "Taleb, N. N. (2007). The black swan: The impact of the highly improbable. Random House.",
    "Gatheral, J. (2006). The volatility surface: A practitioner's guide. John Wiley & Sons.",
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