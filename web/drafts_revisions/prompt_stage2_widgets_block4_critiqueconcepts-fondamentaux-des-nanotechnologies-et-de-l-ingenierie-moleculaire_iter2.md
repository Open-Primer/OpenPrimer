You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quelle est la définition la plus appropriée de la nanotechnologie ?",
          "explanation": "La nanotechnologie implique la conception, la caractérisation, la production et l'application de structures, dispositifs et systèmes en contrôlant la forme et la taille à l'échelle nanométrique (généralement entre 1 et 100 nm).",
          "options": [
            {
              "text": "L'étude des matériaux à l'échelle macroscopique.",
              "correct": false
            },
            {
              "text": "La manipulation de la matière à l'échelle atomique et moléculaire (1 à 100 nanomètres).",
              "correct": true
            },
            {
              "text": "La fabrication de composants électroniques de grande taille.",
              "correct": false
            },
            {
              "text": "L'analyse des propriétés des gaz rares.",
              "correct": false
            }
          ]
        },
        {
          "q": "Pourquoi les effets quantiques deviennent-ils significatifs à l'échelle nanométrique ?",
          "explanation": "À l'échelle nanométrique, les propriétés physiques et chimiques des matériaux peuvent différer considérablement de celles des mêmes matériaux à l'échelle macroscopique en raison des effets quantiques de taille, tels que la quantification de l'énergie et l'augmentation du rapport surface/volume.",
          "options": [
            {
              "text": "Parce que les matériaux deviennent plus lourds.",
              "correct": false
            },
            {
              "text": "Parce que les propriétés des matériaux dépendent fortement de leur taille et de leur structure à cette échelle.",
              "correct": true
            },
            {
              "text": "Parce que la gravité est plus forte à petite échelle.",
              "correct": false
            },
            {
              "text": "Parce que les atomes cessent d'interagir.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la principale différence entre les approches 'top-down' et 'bottom-up' en nanotechnologie ?",
          "explanation": "L'approche 'top-down' consiste à réduire des matériaux plus grands à l'échelle nanométrique (ex: lithographie), tandis que l'approche 'bottom-up' implique l'assemblage d'atomes ou de molécules pour construire des structures nanométriques (ex: auto-assemblage).",
          "options": [
            {
              "text": "L'approche 'top-down' construit des structures à partir de zéro, tandis que 'bottom-up' les réduit.",
              "correct": false
            },
            {
              "text": "L'approche 'top-down' réduit les matériaux de grande taille, tandis que 'bottom-up' assemble des atomes ou des molécules.",
              "correct": true
            },
            {
              "text": "Les deux approches sont identiques et interchangeables.",
              "correct": false
            },
            {
              "text": "L'approche 'top-down' est utilisée pour les liquides, 'bottom-up' pour les solides.",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est l'objectif principal de l'ingénierie moléculaire ?",
          "explanation": "L'ingénierie moléculaire vise à concevoir et à synthétiser des molécules avec des fonctions et des propriétés prédéfinies, souvent en exploitant les principes de l'auto-assemblage et de la reconnaissance moléculaire.",
          "options": [
            {
              "text": "Concevoir des molécules pour la production d'énergie nucléaire.",
              "correct": false
            },
            {
              "text": "Manipuler et concevoir des molécules individuelles ou des ensembles moléculaires pour créer des matériaux ou des dispositifs avec des propriétés spécifiques.",
              "correct": true
            },
            {
              "text": "Étudier la structure des planètes.",
              "correct": false
            },
            {
              "text": "Développer de nouveaux algorithmes informatiques.",
              "correct": false
            }
          ]
        },
        {
          "q": "Parmi les domaines suivants, lequel n'est PAS une application courante des nanotechnologies ?",
          "explanation": "Les nanotechnologies ont des applications vastes et croissantes dans des domaines tels que la médecine, l'électronique, l'énergie, l'environnement, les matériaux et l'agroalimentaire. L'astrologie n'est pas un domaine scientifique et n'utilise pas les nanotechnologies.",
          "options": [
            {
              "text": "Médecine (nanomédicaments, diagnostic).",
              "correct": false
            },
            {
              "text": "Électronique (nanotransistors, mémoires).",
              "correct": false
            },
            {
              "text": "Énergie (cellules solaires, batteries).",
              "correct": false
            },
            {
              "text": "Astrologie (prédiction du futur).",
              "correct": true
            }
          ]
        },
        {
          "q": "Qu'est-ce qui distingue un nanomatériau d'un matériau conventionnel ?",
          "explanation": "Les nanomatériaux sont des matériaux dont au moins une dimension externe, ou dont la structure interne ou de surface, est à l'échelle nanométrique (1 à 100 nm). Cette petite taille confère souvent des propriétés physiques, chimiques et biologiques nouvelles et améliorées par rapport à leurs homologues macroscopiques.",
          "options": [
            {
              "text": "Sa couleur est toujours noire.",
              "correct": false
            },
            {
              "text": "Il est composé uniquement d'éléments radioactifs.",
              "correct": false
            },
            {
              "text": "Au moins une de ses dimensions est à l'échelle nanométrique (1-100 nm), ce qui lui confère des propriétés uniques.",
              "correct": true
            },
            {
              "text": "Il est toujours plus cher à produire.",
              "correct": false
            }
          ]
        }
      ]
    }
  },
  "references": []
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