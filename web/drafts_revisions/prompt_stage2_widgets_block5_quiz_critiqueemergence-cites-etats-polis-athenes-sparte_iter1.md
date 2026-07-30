You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5 Quiz:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "durationLimit": 1800,
      "questions": [
        {
          "q": "Qu'est-ce qu'une \"polis\" dans la Grèce antique ?",
          "explanation": "Une polis était une cité-État, une entité politique indépendante comprenant une ville et son territoire environnant, caractéristique de l'organisation politique de la Grèce antique.",
          "options": [
            {
              "text": "Une grande montagne",
              "correct": false
            },
            {
              "text": "Une cité-État indépendante",
              "correct": true
            },
            {
              "text": "Un type de navire de guerre",
              "correct": false
            },
            {
              "text": "Un dieu grec",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est la principale caractéristique du système politique d'Athènes ?",
          "explanation": "Athènes est célèbre pour avoir développé la démocratie, un système où les citoyens participaient directement aux décisions politiques.",
          "options": [
            {
              "text": "Une monarchie héréditaire",
              "correct": false
            },
            {
              "text": "Une démocratie directe",
              "correct": true
            },
            {
              "text": "Une oligarchie militaire",
              "correct": false
            },
            {
              "text": "Une théocratie",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle était la valeur la plus importante pour les citoyens de Sparte ?",
          "explanation": "Sparte était une société fortement militarisée, où l'entraînement militaire et la loyauté envers la cité étaient primordiaux dès le plus jeune âge.",
          "options": [
            {
              "text": "L'art et la philosophie",
              "correct": false
            },
            {
              "text": "Le commerce et la richesse",
              "correct": false
            },
            {
              "text": "La discipline militaire et la loyauté envers l'État",
              "correct": true
            },
            {
              "text": "L'agriculture et l'élevage",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle est une différence majeure entre Athènes et Sparte ?",
          "explanation": "Athènes était le berceau de la démocratie, tandis que Sparte était dirigée par une oligarchie stricte, axée sur la puissance militaire.",
          "options": [
            {
              "text": "Athènes était située sur une île, Sparte sur le continent.",
              "correct": false
            },
            {
              "text": "Athènes était connue pour sa puissance militaire, Sparte pour sa culture.",
              "correct": false
            },
            {
              "text": "Athènes était une démocratie, Sparte une oligarchie militaire.",
              "correct": true
            },
            {
              "text": "Athènes n'avait pas d'esclaves, Sparte en avait beaucoup.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel facteur géographique a le plus contribué à l'émergence de nombreuses cités-États indépendantes en Grèce antique ?",
          "explanation": "Le paysage montagneux de la Grèce a naturellement divisé la région en petites vallées et plaines isolées, favorisant le développement de communautés indépendantes plutôt que d'un empire unifié.",
          "options": [
            {
              "text": "La présence de vastes plaines fertiles",
              "correct": false
            },
            {
              "text": "L'abondance de grandes rivières navigables",
              "correct": false
            },
            {
              "text": "Le relief montagneux et la fragmentation du territoire",
              "correct": true
            },
            {
              "text": "La proximité de grands déserts",
              "correct": false
            }
          ],
          "multiple": false
        }
      ]
    }
  }
}

Ensure:
1. Quizzes are mathematically/scientifically accurate.
2. No HTML or custom Hover-Card tags inside quiz strings.
3. Absolutely ZERO placeholders or generic filler text (like "Option A", "Option B", "Option", etc.) are allowed in the quiz questions or options. All questions and options must contain actual high-quality academic content in the target language. Reject if any question has dummy options.
4. If this is a terminal evaluation (isTerminalEvaluation is false), no media (images, video, audio) or Mermaid diagrams are allowed in the quiz questions/explanations unless they are absolutely functional to the assessment itself (e.g. diagram-based logic puzzles). Decorative images or non-essential diagrams must be rejected.
5. If this is a terminal evaluation, no hover cards (RealPerson, ConceptLink, Glossary) are allowed in the quiz questions/explanations.
6. CRITICAL EVALUATION CONNECTION: Every question in the finalEvaluation quiz must be strongly connected to the lesson's/course's topics, with specific parameters or scenarios and a detailed pedagogical explanation of the correct choice(s). Reject the block if any question is trivial, generic, or lacks explanation.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    {
      "field": "finalEvaluation",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in the quiz"
    }
  ]
}
\`\`\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.