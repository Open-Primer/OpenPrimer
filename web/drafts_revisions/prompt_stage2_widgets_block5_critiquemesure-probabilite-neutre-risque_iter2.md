You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est la caractéristique principale d'une mesure de probabilité neutre au risque?",
          "explanation": "Sous une mesure de probabilité neutre au risque, le rendement attendu de tout actif négocié, lorsqu'il est actualisé au taux sans risque, est égal à son prix actuel. Cela implique que tous les actifs devraient croître au taux sans risque.",
          "options": [
            {
              "text": "Tous les actifs rapportent le taux sans risque.",
              "correct": true
            },
            {
              "text": "Tous les actifs rapportent la prime de risque du marché.",
              "correct": false
            },
            {
              "text": "Elle reflète la véritable aversion au risque des investisseurs.",
              "correct": false
            },
            {
              "text": "Elle est identique à la mesure de probabilité du monde réel.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "En modélisation financière, pourquoi la mesure de probabilité neutre au risque est-elle particulièrement utile pour la tarification des produits dérivés?",
          "explanation": "La mesure neutre au risque permet de valoriser les produits dérivés en prenant l'espérance actualisée des flux de trésorerie futurs, où l'espérance est prise sous cette mesure spécifique. Cela élimine le besoin de modéliser explicitement l'aversion au risque et les primes de risque, simplifiant ainsi le processus de tarification.",
          "options": [
            {
              "text": "Elle simplifie le calcul des paiements futurs attendus en supprimant la nécessité d'estimer les primes de risque.",
              "correct": true
            },
            {
              "text": "Elle reflète avec précision les probabilités réelles des mouvements futurs du marché.",
              "correct": false
            },
            {
              "text": "Elle permet l'utilisation directe des données historiques sans ajustements.",
              "correct": false
            },
            {
              "text": "Elle intègre les préférences de risque individuelles des investisseurs dans le modèle de tarification.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel théorème est fondamental pour passer de la mesure de probabilité du monde réel à une mesure de probabilité neutre au risque dans les modèles financiers en temps continu?",
          "explanation": "Le théorème de Girsanov fournit le cadre mathématique pour changer la mesure de probabilité de telle sorte qu'un processus qui était une semi-martingale sous une mesure devienne une martingale sous une autre, ce qui est crucial pour construire des mesures neutres au risque.",
          "options": [
            {
              "text": "Théorème Central Limite",
              "correct": false
            },
            {
              "text": "Théorème de Bayes",
              "correct": false
            },
            {
              "text": "Théorème de Girsanov",
              "correct": true
            },
            {
              "text": "Théorème de Fubini",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la relation entre une mesure de probabilité neutre au risque et le concept de martingale?",
          "explanation": "Une propriété clé d'une mesure neutre au risque est que le prix de tout actif, lorsqu'il est actualisé au taux sans risque, devient une martingale. Cette propriété est fondamentale pour la tarification sans arbitrage.",
          "options": [
            {
              "text": "Sous une mesure neutre au risque, les prix des actifs actualisés sont des martingales.",
              "correct": true
            },
            {
              "text": "Sous une mesure neutre au risque, les prix des actifs sont des martingales.",
              "correct": false
            },
            {
              "text": "Les martingales ne sont pertinentes que sous la mesure du monde réel.",
              "correct": false
            },
            {
              "text": "Il n'y a pas de relation directe; ce sont des concepts distincts.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Considérons un marché financier complet. Que signifie l'existence d'une mesure de probabilité neutre au risque unique?",
          "explanation": "Le premier théorème fondamental de la tarification des actifs stipule que l'absence d'arbitrage est équivalente à l'existence d'une mesure de martingale équivalente (mesure neutre au risque). Le deuxième théorème fondamental stipule qu'un marché est complet si et seulement s'il existe une mesure de martingale équivalente unique.",
          "options": [
            {
              "text": "Il n'y a pas d'opportunités d'arbitrage sur le marché.",
              "correct": true
            },
            {
              "text": "Les investisseurs sont tous averses au risque.",
              "correct": false
            },
            {
              "text": "Tous les actifs ont la même volatilité.",
              "correct": false
            },
            {
              "text": "Le marché est inefficace.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Laquelle des affirmations suivantes concernant la mesure neutre au risque est FAUSSE?",
          "explanation": "La mesure neutre au risque est une construction théorique utilisée pour la tarification, et non pour prendre des décisions d'investissement réelles basées sur les rendements attendus, qui reposent généralement sur la mesure du monde réel et les primes de risque.",
          "options": [
            {
              "text": "Elle est généralement différente de la mesure de probabilité du monde réel.",
              "correct": false
            },
            {
              "text": "Elle est utilisée pour calculer les rendements attendus pour les décisions d'investissement.",
              "correct": true
            },
            {
              "text": "C'est une mesure de probabilité équivalente.",
              "correct": false
            },
            {
              "text": "Elle simplifie la tarification des produits dérivés en rendant les prix des actifs actualisés des martingales.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel est le rôle d'un numéraire dans la construction d'une mesure neutre au risque?",
          "explanation": "Un numéraire est un actif utilisé comme unité de compte. En changeant le numéraire, on peut changer la mesure de martingale équivalente. L'actif sans risque est un choix courant pour un numéraire lors de la construction de la mesure neutre au risque standard.",
          "options": [
            {
              "text": "Il sert d'unité de compte par rapport à laquelle tous les autres actifs sont évalués, simplifiant la propriété de martingale.",
              "correct": true
            },
            {
              "text": "Il représente l'actif sans risque sur le marché.",
              "correct": false
            },
            {
              "text": "C'est une mesure de la volatilité du marché.",
              "correct": false
            },
            {
              "text": "Il détermine l'aversion au risque des investisseurs.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Dans un marché incomplet, combien de mesures de probabilité neutres au risque existent?",
          "explanation": "Dans un marché incomplet, il existe plusieurs mesures de martingale équivalentes (mesures neutres au risque) compatibles avec l'absence d'arbitrage. Cela signifie que les prix des produits dérivés ne sont pas uniques sans hypothèses supplémentaires.",
          "options": [
            {
              "text": "Exactement une.",
              "correct": false
            },
            {
              "text": "Aucune.",
              "correct": false
            },
            {
              "text": "Une infinité.",
              "correct": true
            },
            {
              "text": "Un nombre fini supérieur à un.",
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
    "Baxter, M., & Rennie, A. (1996). Financial calculus: An introduction to derivative pricing. Cambridge University Press.",
    "Björk, T. (2009). Arbitrage theory in continuous time (3rd ed.). Oxford University Press.",
    "Cont, R., & Tankov, P. (2004). Financial modelling with jump processes. Chapman and Hall/CRC.",
    "Duffie, D. (2001). Dynamic asset pricing theory (3rd ed.). Princeton University Press.",
    "Glasserman, P. (2004). Monte Carlo methods in financial engineering. Springer.",
    "Harrison, J. M., & Kreps, D. M. (1979). Martingales and arbitrage in multiperiod securities markets. Journal of Economic Theory, 20(3), 381-408.",
    "Harrison, J. M., & Pliska, S. R. (1981). Martingales and stochastic integrals in the theory of continuous trading. Stochastic Processes and their Applications, 11(3), 215-260.",
    "Hull, J. C. (2018). Options, futures, and other derivatives (10th ed.). Pearson.",
    "Lando, D. (2004). Credit risk modeling: Theory and applications. Princeton University Press.",
    "Musiela, M., & Rutkowski, M. (2005). Martingale methods in financial modelling (2nd ed.). Springer.",
    "Shreve, S. E. (2004). Stochastic calculus for finance II: Continuous-time models. Springer Science & Business Media."
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