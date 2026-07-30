You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5 Quiz:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "durationLimit": 1800,
      "questions": [
        {
          "q": "Quelle guerre a opposé les cités grecques à l'Empire perse au début du 5e siècle avant J.-C. ?",
          "explanation": "Les Guerres médiques sont le nom donné aux conflits qui ont opposé les cités grecques, notamment Athènes et Sparte, à l'immense Empire perse au début du 5e siècle avant J.-C. Ces guerres sont célèbres pour des batailles comme Marathon et Salamine.",
          "options": [
            {
              "text": "La Guerre du Péloponnèse",
              "correct": false
            },
            {
              "text": "Les Guerres médiques",
              "correct": true
            },
            {
              "text": "La Guerre de Troie",
              "correct": false
            },
            {
              "text": "Les Guerres puniques",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelles étaient les deux principales cités-États grecques qui se sont affrontées pendant la Guerre du Péloponnèse ?",
          "explanation": "La Guerre du Péloponnèse fut un conflit dévastateur qui opposa la Ligue de Délos, menée par Athènes, à la Ligue du Péloponnèse, dirigée par Sparte. Ces deux puissances cherchaient l'hégémonie sur le monde grec.",
          "options": [
            {
              "text": "Thèbes et Corinthe",
              "correct": false
            },
            {
              "text": "Athènes et Sparte",
              "correct": true
            },
            {
              "text": "Milet et Éphèse",
              "correct": false
            },
            {
              "text": "Argos et Mégare",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel événement majeur a marqué la fin de l'hégémonie athénienne et le début de la domination spartiate en Grèce antique ?",
          "explanation": "La défaite d'Athènes face à Sparte lors de la Guerre du Péloponnèse a mis fin à l'âge d'or athénien et à sa domination maritime et politique, inaugurant une période d'hégémonie spartiate, bien que de courte durée.",
          "options": [
            {
              "text": "La victoire à la bataille de Marathon",
              "correct": false
            },
            {
              "text": "La signature de la Paix de Nicias",
              "correct": false
            },
            {
              "text": "La défaite d'Athènes dans la Guerre du Péloponnèse",
              "correct": true
            },
            {
              "text": "La fondation de la Ligue de Délos",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quel roi macédonien a profité de l'affaiblissement des cités grecques après des décennies de conflits pour étendre son pouvoir sur la Grèce ?",
          "explanation": "Après les Guerres du Péloponnèse et d'autres conflits internes, les cités grecques étaient épuisées. Philippe II de Macédoine a su exploiter cette faiblesse pour conquérir la Grèce et jeter les bases de l'empire de son fils, Alexandre le Grand.",
          "options": [
            {
              "text": "Léonidas",
              "correct": false
            },
            {
              "text": "Périclès",
              "correct": false
            },
            {
              "text": "Philippe II",
              "correct": true
            },
            {
              "text": "Darius Ier",
              "correct": false
            }
          ],
          "multiple": false
        },
        {
          "q": "Quelle bataille célèbre des Guerres médiques est associée à la résistance héroïque de 300 Spartiates face à l'armée perse ?",
          "explanation": "La bataille des Thermopyles est l'un des épisodes les plus célèbres des Guerres médiques, où un petit contingent grec, mené par le roi spartiate Léonidas, a tenu tête à l'immense armée perse pendant plusieurs jours, permettant aux autres cités grecques de se préparer.",
          "options": [
            {
              "text": "La bataille de Salamine",
              "correct": false
            },
            {
              "text": "La bataille de Marathon",
              "correct": false
            },
            {
              "text": "La bataille des Thermopyles",
              "correct": true
            },
            {
              "text": "La bataille de Platées",
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