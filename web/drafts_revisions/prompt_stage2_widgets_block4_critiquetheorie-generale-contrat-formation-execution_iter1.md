You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelles sont les conditions essentielles de validité d'un contrat en droit français, telles qu'énoncées par le Code civil ?",
          "explanation": "L'article 1128 du Code civil dispose que sont nécessaires à la validité d'un contrat : 1° Le consentement des parties ; 2° Leur capacité de contracter ; 3° Un contenu licite et certain.",
          "options": [
            {
              "text": "Le consentement des parties, leur capacité de contracter, un contenu licite et certain.",
              "correct": true
            },
            {
              "text": "L'accord des volontés, la signature d'un acte authentique, un prix déterminé.",
              "correct": false
            },
            {
              "text": "La bonne foi des parties, l'absence de vices du consentement, l'enregistrement fiscal.",
              "correct": false
            },
            {
              "text": "La présence de témoins, un délai de rétractation, une clause pénale.",
              "correct": false
            }
          ]
        },
        {
          "q": "Parmi les propositions suivantes, laquelle ne constitue PAS un vice du consentement susceptible d'entraîner la nullité relative du contrat ?",
          "explanation": "L'erreur, le dol et la violence sont les trois vices du consentement prévus par le Code civil (articles 1130 et suivants). La lésion n'est un vice du consentement que dans des cas exceptionnels et limitativement énumérés par la loi (ex: vente d'immeuble, partage), elle n'est pas une cause générale de nullité.",
          "options": [
            {
              "text": "L'erreur.",
              "correct": false
            },
            {
              "text": "Le dol.",
              "correct": false
            },
            {
              "text": "La violence.",
              "correct": false
            },
            {
              "text": "La lésion.",
              "correct": true
            }
          ]
        },
        {
          "q": "Quel principe fondamental du droit des contrats est exprimé par l'adage 'Pacta sunt servanda' ?",
          "explanation": "'Pacta sunt servanda' signifie 'les conventions doivent être respectées'. C'est le principe de la force obligatoire du contrat, désormais codifié à l'article 1103 du Code civil, selon lequel les contrats légalement formés tiennent lieu de loi à ceux qui les ont faits.",
          "options": [
            {
              "text": "Le principe de la liberté contractuelle.",
              "correct": false
            },
            {
              "text": "Le principe de la force obligatoire du contrat.",
              "correct": true
            },
            {
              "text": "Le principe de la bonne foi.",
              "correct": false
            },
            {
              "text": "Le principe de l'effet relatif des contrats.",
              "correct": false
            }
          ]
        },
        {
          "q": "En cas d'inexécution contractuelle, quelle sanction permet au créancier d'obtenir l'exécution de la prestation due par le débiteur, si celle-ci est possible ?",
          "explanation": "L'exécution forcée en nature (article 1221 du Code civil) est la sanction qui vise à contraindre le débiteur à réaliser la prestation promise. La résolution met fin au contrat, la réduction du prix est une sanction spécifique, et la clause pénale est une évaluation forfaitaire des dommages-intérêts.",
          "options": [
            {
              "text": "La résolution du contrat.",
              "correct": false
            },
            {
              "text": "La réduction du prix.",
              "correct": false
            },
            {
              "text": "L'exécution forcée en nature.",
              "correct": true
            },
            {
              "text": "La clause pénale.",
              "correct": false
            }
          ]
        },
        {
          "q": "À quel stade de la vie du contrat le principe de bonne foi doit-il impérativement être respecté en droit français ?",
          "explanation": "L'article 1104 du Code civil dispose que 'Les contrats doivent être négociés, formés et exécutés de bonne foi.' Le principe de bonne foi est donc transversal à toutes les étapes de la vie contractuelle.",
          "options": [
            {
              "text": "Uniquement lors de la formation du contrat.",
              "correct": false
            },
            {
              "text": "Uniquement lors de l'exécution du contrat.",
              "correct": false
            },
            {
              "text": "Uniquement lors de la rupture du contrat.",
              "correct": false
            },
            {
              "text": "Lors de la négociation, de la formation et de l'exécution du contrat.",
              "correct": true
            }
          ]
        }
      ],
      "durationLimit": 300
    }
  },
  "references": [
    "Bénabent, Alain. Droit des obligations. 18e éd., LGDJ, 2020.",
    "Terré, François, Philippe Simler et Yves Lequette. Droit civil : Les obligations. 12e éd., Dalloz, 2019.",
    "Malaurie, Philippe, Laurent Aynès et Pierre-Yves Gautier. Droit des contrats. 13e éd., LGDJ, 2021."
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