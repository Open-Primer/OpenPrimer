You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5 Quiz:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "durationLimit": 1800,
      "questions": [
        {
          "q": "Quel type de bâtiment était spécifiquement conçu pour les représentations théâtrales dans la Grèce antique ?",
          "explanation": "Les théâtres grecs étaient des structures en plein air, souvent construites à flanc de colline, avec une acoustique remarquable, permettant à un large public d'assister aux pièces.",
          "options": [
            {
              "text": "Un gymnase",
              "correct": false
            },
            {
              "text": "Un stade",
              "correct": false
            },
            {
              "text": "Un théâtre",
              "correct": true
            },
            {
              "text": "Un agora",
              "correct": false
            }
          ]
        },
        {
          "q": "Quels sont les trois principaux ordres architecturaux grecs utilisés pour les colonnes des temples ?",
          "explanation": "Les ordres dorique, ionique et corinthien sont les styles distinctifs des colonnes et de l'entablement dans l'architecture grecque antique, chacun avec ses caractéristiques propres en termes de chapiteau et de proportions.",
          "options": [
            {
              "text": "Égyptien, Romain, Grec",
              "correct": false
            },
            {
              "text": "Dorique, Ionique, Corinthien",
              "correct": true
            },
            {
              "text": "Gothique, Baroque, Classique",
              "correct": false
            },
            {
              "text": "Byzantin, Roman, Renaissance",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel philosophe grec est célèbre pour sa méthode de questionnement (la maïeutique) et a été le maître de Platon ?",
          "explanation": "Socrate est l'un des fondateurs de la philosophie occidentale, connu pour sa méthode socratique (l'art d'accoucher les esprits) et son influence majeure sur ses élèves, notamment Platon.",
          "options": [
            {
              "text": "Aristote",
              "correct": false
            },
            {
              "text": "Socrate",
              "correct": true
            },
            {
              "text": "Périclès",
              "correct": false
            },
            {
              "text": "Homère",
              "correct": false
            }
          ]
        },
        {
          "q": "En plus du divertissement, quel était un rôle important du théâtre dans la société grecque antique ?",
          "explanation": "Le théâtre grec n'était pas seulement un divertissement, mais aussi un moyen d'explorer des questions morales, éthiques et politiques, et de renforcer les valeurs civiques et religieuses de la cité.",
          "options": [
            {
              "text": "Un lieu de commerce",
              "correct": false
            },
            {
              "text": "Un centre d'entraînement militaire",
              "correct": false
            },
            {
              "text": "Un moyen d'éducation civique et morale",
              "correct": true
            },
            {
              "text": "Un tribunal de justice",
              "correct": false
            }
          ]
        },
        {
          "q": "À quoi servaient principalement les grands temples comme le Parthénon dans la Grèce antique ?",
          "explanation": "Les temples grecs étaient principalement dédiés aux divinités et servaient de lieux de culte, de sanctuaires pour les statues des dieux et de trésors pour les offrandes.",
          "options": [
            {
              "text": "Des habitations pour les citoyens",
              "correct": false
            },
            {
              "text": "Des écoles publiques",
              "correct": false
            },
            {
              "text": "Des lieux de culte et des sanctuaires pour les dieux",
              "correct": true
            },
            {
              "text": "Des bibliothèques",
              "correct": false
            }
          ]
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