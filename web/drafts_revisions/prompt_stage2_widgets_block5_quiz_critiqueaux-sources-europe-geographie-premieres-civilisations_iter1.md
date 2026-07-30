You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5 Quiz:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "durationLimit": 1800,
      "questions": [
        {
          "q": "Quelle caractéristique géographique a le plus contribué à la division de la Grèce antique en de nombreuses cités-États indépendantes ?",
          "explanation": "Les montagnes et le relief accidenté de la Grèce ont rendu les communications et les déplacements difficiles, favorisant l'isolement et le développement de petites communautés autonomes, les cités-États.",
          "options": [
            {
              "text": "La présence de nombreux fleuves",
              "correct": false
            },
            {
              "text": "Le climat méditerranéen",
              "correct": false
            },
            {
              "text": "Le relief montagneux",
              "correct": true
            },
            {
              "text": "La proximité de l'Égypte",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel rôle majeur la mer a-t-elle joué dans le développement des civilisations égéennes ?",
          "explanation": "La mer Égée était une voie de communication essentielle pour le commerce, les échanges culturels et l'expansion des civilisations comme les Minoens et les Mycéniens, malgré le relief montagneux de l'intérieur des terres.",
          "options": [
            {
              "text": "Elle a servi de barrière naturelle contre les invasions.",
              "correct": false
            },
            {
              "text": "Elle a permis le développement de l'agriculture intensive.",
              "correct": false
            },
            {
              "text": "Elle a facilité le commerce et les échanges culturels.",
              "correct": true
            },
            {
              "text": "Elle a fourni de l'eau douce pour l'irrigation.",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Sur quelle île s'est principalement développée la civilisation minoenne ?",
          "explanation": "La civilisation minoenne, l'une des premières civilisations égéennes, était centrée sur l'île de Crète, avec des palais comme celui de Knossos.",
          "options": [
            {
              "text": "Rhodes",
              "correct": false
            },
            {
              "text": "Chypre",
              "correct": false
            },
            {
              "text": "Crète",
              "correct": true
            },
            {
              "text": "Santorin",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle civilisation égéenne est connue pour ses citadelles fortifiées et son caractère plus guerrier, souvent associée à la légende de la guerre de Troie ?",
          "explanation": "La civilisation mycénienne, contrairement à la minoenne, était caractérisée par des citadelles imposantes et fortifiées (comme Mycènes, Tirynthe) et une société plus orientée vers la guerre, ce qui est reflété dans les récits homériques.",
          "options": [
            {
              "text": "La civilisation minoenne",
              "correct": false
            },
            {
              "text": "La civilisation mycénienne",
              "correct": true
            },
            {
              "text": "La civilisation cycladique",
              "correct": false
            },
            {
              "text": "La civilisation hellénistique",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle affirmation décrit le mieux la relation chronologique entre les civilisations minoenne et mycénienne ?",
          "explanation": "La civilisation minoenne a fleuri en Crète avant l'apogée de la civilisation mycénienne sur le continent grec. Les Mycéniens ont ensuite dominé la Crète et ont été influencés par la culture minoenne.",
          "options": [
            {
              "text": "La civilisation mycénienne a précédé la civilisation minoenne.",
              "correct": false
            },
            {
              "text": "Les deux civilisations se sont développées simultanément sans interaction.",
              "correct": false
            },
            {
              "text": "La civilisation minoenne a précédé et influencé la civilisation mycénienne.",
              "correct": true
            },
            {
              "text": "Elles étaient deux noms différents pour la même civilisation.",
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