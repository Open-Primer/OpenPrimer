You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quel organite est responsable de la synthèse des protéines destinées à être sécrétées ou insérées dans les membranes?",
          "explanation": "Le réticulum endoplasmique rugueux (RER) est couvert de ribosomes qui synthétisent les protéines destinées à la sécrétion, à l'insertion membranaire ou à d'autres organites du système endomembranaire.",
          "options": [
            {
              "text": "Noyau",
              "correct": false
            },
            {
              "text": "Mitochondrie",
              "correct": false
            },
            {
              "text": "Réticulum endoplasmique rugueux",
              "correct": true
            },
            {
              "text": "Appareil de Golgi",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle est la fonction principale des mitochondries?",
          "explanation": "Les mitochondries sont les 'centrales énergétiques' de la cellule, responsables de la production d'adénosine triphosphate (ATP) via la respiration cellulaire.",
          "options": [
            {
              "text": "Stockage de l'information génétique",
              "correct": false
            },
            {
              "text": "Production d'ATP par respiration cellulaire",
              "correct": true
            },
            {
              "text": "Détoxification des substances nocives",
              "correct": false
            },
            {
              "text": "Digestion des déchets cellulaires",
              "correct": false
            }
          ]
        },
        {
          "q": "Lequel des organites suivants contient des enzymes hydrolytiques et est impliqué dans la dégradation des déchets cellulaires et des macromolécules?",
          "explanation": "Les lysosomes sont des organites contenant des enzymes digestives (hydrolases acides) qui dégradent les déchets cellulaires, les organites usés et les substances étrangères.",
          "options": [
            {
              "text": "Peroxysome",
              "correct": false
            },
            {
              "text": "Ribosome",
              "correct": false
            },
            {
              "text": "Lysosome",
              "correct": true
            },
            {
              "text": "Vacuole",
              "correct": false
            }
          ]
        },
        {
          "q": "Quelle structure cellulaire est composée de microfilaments, de filaments intermédiaires et de microtubules, et joue un rôle crucial dans le maintien de la forme cellulaire et le mouvement?",
          "explanation": "Le cytosquelette est un réseau dynamique de protéines filamenteuses qui fournit un support structurel, permet le mouvement cellulaire et le transport intracellulaire.",
          "options": [
            {
              "text": "Noyau",
              "correct": false
            },
            {
              "text": "Cytosquelette",
              "correct": true
            },
            {
              "text": "Membrane plasmique",
              "correct": false
            },
            {
              "text": "Paroi cellulaire",
              "correct": false
            }
          ]
        },
        {
          "q": "Où se déroule la modification, le tri et l'empaquetage des protéines et des lipides synthétisés dans le RE?",
          "explanation": "L'appareil de Golgi est un organite clé dans le système endomembranaire, responsable de la maturation, du tri et de l'empaquetage des protéines et des lipides pour leur destination finale.",
          "options": [
            {
              "text": "Noyau",
              "correct": false
            },
            {
              "text": "Mitochondrie",
              "correct": false
            },
            {
              "text": "Réticulum endoplasmique lisse",
              "correct": false
            },
            {
              "text": "Appareil de Golgi",
              "correct": true
            }
          ]
        },
        {
          "q": "Quel organite est impliqué dans la détoxification de l'alcool et la synthèse des lipides, mais ne possède pas de ribosomes sur sa surface?",
          "explanation": "Le réticulum endoplasmique lisse (REL) est impliqué dans la synthèse des lipides, le métabolisme des glucides et la détoxification des drogues et des poisons, et il est dépourvu de ribosomes.",
          "options": [
            {
              "text": "Réticulum endoplasmique rugueux",
              "correct": false
            },
            {
              "text": "Réticulum endoplasmique lisse",
              "correct": true
            },
            {
              "text": "Appareil de Golgi",
              "correct": false
            },
            {
              "text": "Peroxysome",
              "correct": false
            }
          ]
        },
        {
          "q": "La membrane plasmique est principalement composée de:",
          "explanation": "La membrane plasmique est une bicouche lipidique composée principalement de phospholipides, avec des protéines intégrées ou associées qui remplissent diverses fonctions.",
          "options": [
            {
              "text": "Glucides et protéines",
              "correct": false
            },
            {
              "text": "Acides nucléiques et lipides",
              "correct": false
            },
            {
              "text": "Phospholipides et protéines",
              "correct": true
            },
            {
              "text": "Polysaccharides et acides aminés",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 600
    }
  },
  "references": [
    "Alberts B, Johnson A, Lewis J, Raff M, Roberts K, Walter P. Molecular Biology of the Cell. 6th ed. New York (NY): Garland Science; 2015.",
    "Lodish H, Berk A, Kaiser CA, Krieger M, Bretscher A, Ploegh H, Amon A, Scott MP. Molecular Cell Biology. 8th ed. New York (NY): W. H. Freeman; 2016.",
    "Campbell NA, Reece JB, Urry LA, Cain ML, Wasserman SA, Minorsky PV, Jackson RB. Biologie. 11e éd. Paris (FR): Pearson France; 2017.",
    "Cooper GM, Hausman RE. The Cell: A Molecular Approach. 8th ed. Washington (DC): ASM Press; 2019."
  ]
}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix, or empty if approved"
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.