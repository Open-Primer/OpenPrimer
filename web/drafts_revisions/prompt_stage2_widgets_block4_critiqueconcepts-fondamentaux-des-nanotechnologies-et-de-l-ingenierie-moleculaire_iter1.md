You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est la gamme de taille typique associée aux nanotechnologies?",
          "explanation": "La nanotechnologie opère généralement à l'échelle de 1 à 100 nanomètres, où les propriétés des matériaux peuvent changer de manière significative en raison des effets quantiques et de l'augmentation du rapport surface/volume.",
          "options": [
            {
              "text": "1 à 100 micromètres",
              "correct": false
            },
            {
              "text": "1 à 100 nanomètres",
              "correct": true
            },
            {
              "text": "1 à 100 picomètres",
              "correct": false
            },
            {
              "text": "1 à 100 angströms",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle approche de fabrication nanotechnologique consiste à construire des structures atome par atome ou molécule par molécule?",
          "explanation": "L'approche \"bottom-up\" (ascendante) implique l'assemblage de structures à partir de composants atomiques ou moléculaires, tandis que l'approche \"top-down\" (descendante) réduit des matériaux plus grands.",
          "options": [
            {
              "text": "Approche \"top-down\"",
              "correct": false
            },
            {
              "text": "Approche \"bottom-up\"",
              "correct": true
            },
            {
              "text": "Lithographie",
              "correct": false
            },
            {
              "text": "Gravure",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel scientifique est souvent crédité d'avoir posé les bases conceptuelles des nanotechnologies avec sa conférence \"There's Plenty of Room at the Bottom\"?",
          "explanation": "Richard Feynman a donné la conférence visionnaire \"There's Plenty of Room at the Bottom\" en 1959, décrivant la possibilité de manipuler la matière à l'échelle atomique.",
          "options": [
            {
              "text": "Richard Smalley",
              "correct": false
            },
            {
              "text": "Richard Feynman",
              "correct": true
            },
            {
              "text": "Eric Drexler",
              "correct": false
            },
            {
              "text": "K. Eric Drexler",
              "correct": false
            }
          ]
        },
        {
          "q": "Pourquoi les matériaux peuvent-ils présenter des propriétés optiques, électriques ou mécaniques différentes à l'échelle nanométrique par rapport à leur forme macroscopique?",
          "explanation": "À l'échelle nanométrique, les effets quantiques deviennent prédominants et le rapport surface/volume augmente considérablement, modifiant les propriétés fondamentales des matériaux.",
          "options": [
            {
              "text": "En raison de l'augmentation de la masse volumique.",
              "correct": false
            },
            {
              "text": "En raison de la diminution de la surface spécifique.",
              "correct": false
            },
            {
              "text": "En raison des effets quantiques et de l'augmentation du rapport surface/volume.",
              "correct": true
            },
            {
              "text": "En raison de la stabilité accrue des liaisons chimiques.",
              "correct": false
            }
          ]
        },
        {
          "q": "L'ingénierie moléculaire se concentre principalement sur:",
          "explanation": "L'ingénierie moléculaire est la conception, la caractérisation et la manipulation de structures et de systèmes au niveau atomique et moléculaire pour créer des matériaux et des dispositifs avec des propriétés spécifiques.",
          "options": [
            {
              "text": "La conception de machines à l'échelle macroscopique.",
              "correct": false
            },
            {
              "text": "La manipulation et la conception de structures au niveau atomique et moléculaire.",
              "correct": true
            },
            {
              "text": "L'étude des propriétés des matériaux en vrac.",
              "correct": false
            },
            {
              "text": "La synthèse de polymères à haute masse moléculaire.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel instrument est couramment utilisé pour visualiser et manipuler des atomes individuels à la surface des matériaux?",
          "explanation": "Les microscopes à force atomique (AFM) et à effet tunnel (STM) sont des outils clés qui permettent de visualiser et même de manipuler la matière à l'échelle nanométrique.",
          "options": [
            {
              "text": "Microscope optique",
              "correct": false
            },
            {
              "text": "Microscope électronique à balayage (MEB)",
              "correct": false
            },
            {
              "text": "Microscope à force atomique (AFM) ou Microscope à effet tunnel (STM)",
              "correct": true
            },
            {
              "text": "Chromatographie en phase gazeuse",
              "correct": false
            }
          ]
        },
        {
          "q": "Parmi les applications suivantes, laquelle est un exemple direct de l'utilisation des nanotechnologies?",
          "explanation": "Le développement de médicaments ciblés via des nanoparticules est une application majeure des nanotechnologies en médecine, permettant une meilleure efficacité et moins d'effets secondaires.",
          "options": [
            {
              "text": "La fabrication de puces informatiques avec des transistors de taille micrométrique.",
              "correct": false
            },
            {
              "text": "Le développement de médicaments ciblés utilisant des nanoparticules pour la livraison.",
              "correct": true
            },
            {
              "text": "La production d'acier pour la construction.",
              "correct": false
            },
            {
              "text": "L'utilisation de fibres optiques pour la communication longue distance.",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 600
    }
  },
  "references": [
    "Ratner, M.; Ratner, D. Nanotechnology: A Gentle Introduction to the Next Big Idea, 2nd ed.; Prentice Hall: Upper Saddle River, NJ, 2003.",
    "Drexler, K. E. Engines of Creation: The Coming Era of Nanotechnology; Anchor Books: New York, 1986.",
    "Feynman, R. P. \"There's Plenty of Room at the Bottom,\" Eng. Sci. 23, 22 (1960).",
    "Cao, G.; Wang, Y. Nanostructures and Nanomaterials: Synthesis, Properties, and Applications, 2nd ed.; World Scientific: Singapore, 2011."
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