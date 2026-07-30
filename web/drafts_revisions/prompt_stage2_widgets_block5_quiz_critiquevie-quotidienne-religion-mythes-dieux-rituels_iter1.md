You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5 Quiz:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "durationLimit": 1800,
      "questions": [
        {
          "q": "Quelle était la principale fonction de l'agora dans les cités grecques antiques ?",
          "explanation": "L'agora était le cœur de la vie publique dans les cités grecques. C'était un lieu de marché où l'on échangeait des biens, mais aussi un espace de rassemblement pour les discussions politiques, les débats philosophiques et les rencontres sociales. C'était un centre névralgique de la vie civique.",
          "options": [
            {
              "text": "Un temple dédié à Zeus",
              "correct": false
            },
            {
              "text": "Un lieu de spectacle théâtral",
              "correct": false
            },
            {
              "text": "Un marché et un lieu de rassemblement public",
              "correct": true
            },
            {
              "text": "Une caserne militaire",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel dieu grec était le souverain de l'Olympe et le dieu du ciel et du tonnerre ?",
          "explanation": "Zeus était le roi des dieux et le maître de l'Olympe. Il était vénéré comme le dieu du ciel, du tonnerre et de la foudre, et était le garant de l'ordre et de la justice parmi les dieux et les hommes.",
          "options": [
            {
              "text": "Poséidon",
              "correct": false
            },
            {
              "text": "Hadès",
              "correct": false
            },
            {
              "text": "Zeus",
              "correct": true
            },
            {
              "text": "Apollon",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel était le but principal des mythes dans la Grèce antique ?",
          "explanation": "Les mythes grecs n'étaient pas de simples histoires. Ils servaient à expliquer l'origine du monde, les phénomènes naturels, la généalogie des dieux et des héros, et à transmettre des valeurs morales et des leçons de vie aux générations. Ils donnaient un sens à l'existence et à l'ordre du cosmos.",
          "options": [
            {
              "text": "Divertir les enfants uniquement",
              "correct": false
            },
            {
              "text": "Expliquer le monde et les phénomènes naturels",
              "correct": true
            },
            {
              "text": "Enseigner l'agriculture",
              "correct": false
            },
            {
              "text": "Préparer les soldats à la guerre",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel événement sportif et religieux majeur était célébré tous les quatre ans en l'honneur de Zeus à Olympie ?",
          "explanation": "Les Jeux Olympiques étaient la plus célèbre des fêtes panhelléniques. Organisés tous les quatre ans à Olympie en l'honneur de Zeus, ils rassemblaient des athlètes de toutes les cités grecques pour des compétitions sportives et des rituels religieux, instaurant une trêve sacrée.",
          "options": [
            {
              "text": "Les Jeux Pythiques",
              "correct": false
            },
            {
              "text": "Les Jeux Néméens",
              "correct": false
            },
            {
              "text": "Les Jeux Olympiques",
              "correct": true
            },
            {
              "text": "Les Jeux Isthmiques",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Comment la religion influençait-elle la vie quotidienne des Grecs antiques ?",
          "explanation": "La religion était omniprésente dans la vie des Grecs antiques. Elle dictait de nombreuses coutumes, influençait les décisions politiques, les fêtes, les rituels familiaux et civiques, l'art, l'architecture et même la morale. Les dieux étaient invoqués pour presque toutes les activités importantes.",
          "options": [
            {
              "text": "Elle n'avait d'importance que pour les prêtres",
              "correct": false
            },
            {
              "text": "Elle dictait les lois et les coutumes, et était présente dans tous les aspects de la vie",
              "correct": true
            },
            {
              "text": "Elle était limitée aux cérémonies funéraires",
              "correct": false
            },
            {
              "text": "Elle était une affaire purement privée et personnelle",
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