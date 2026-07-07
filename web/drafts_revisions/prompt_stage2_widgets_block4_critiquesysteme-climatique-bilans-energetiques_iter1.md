You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "questions": [
        {
          "q": "Quel est le principal moteur du système climatique terrestre?",
          "explanation": "L'énergie solaire est la source d'énergie quasi exclusive qui alimente le système climatique terrestre, déterminant les températures et les mouvements atmosphériques et océaniques.",
          "options": [
            {
              "text": "Énergie géothermique",
              "correct": false
            },
            {
              "text": "Énergie solaire",
              "correct": true
            },
            {
              "text": "Énergie marémotrice",
              "correct": false
            },
            {
              "text": "Énergie éolienne",
              "correct": false
            }
          ]
        },
        {
          "q": "Quels sont les deux gaz les plus abondants dans l'atmosphère terrestre sèche?",
          "explanation": "L'atmosphère terrestre est composée d'environ 78% d'azote (N2) et 21% d'oxygène (O2), les autres gaz ne représentant qu'environ 1%.",
          "options": [
            {
              "text": "Oxygène et dioxyde de carbone",
              "correct": false
            },
            {
              "text": "Azote et oxygène",
              "correct": true
            },
            {
              "text": "Argon et azote",
              "correct": false
            },
            {
              "text": "Vapeur d'eau et oxygène",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est le rôle principal des gaz à effet de serre dans le bilan énergétique terrestre?",
          "explanation": "Les gaz à effet de serre (GES) absorbent et réémettent le rayonnement infrarouge terrestre, ce qui réchauffe la basse atmosphère et la surface de la Terre, un phénomène essentiel à la vie.",
          "options": [
            {
              "text": "Refléter toute l'énergie solaire incidente",
              "correct": false
            },
            {
              "text": "Absorber le rayonnement ultraviolet",
              "correct": false
            },
            {
              "text": "Piéger une partie du rayonnement infrarouge émis par la Terre",
              "correct": true
            },
            {
              "text": "Produire de l'oxygène",
              "correct": false
            }
          ]
        },
        {
          "q": "Qu'est-ce que l'albédo terrestre?",
          "explanation": "L'albédo est la mesure de la réflectivité d'une surface. Un albédo élevé signifie qu'une grande partie du rayonnement solaire est réfléchie, tandis qu'un albédo faible signifie qu'une grande partie est absorbée.",
          "options": [
            {
              "text": "La quantité de chaleur émise par la Terre",
              "correct": false
            },
            {
              "text": "La proportion de rayonnement solaire absorbée par la Terre",
              "correct": false
            },
            {
              "text": "La proportion de rayonnement solaire réfléchie par la Terre",
              "correct": true
            },
            {
              "text": "La température moyenne de la surface terrestre",
              "correct": false
            }
          ]
        },
        {
          "q": "Comment le forçage radiatif est-il défini dans le contexte du système climatique?",
          "explanation": "Le forçage radiatif est une mesure de l'influence d'un facteur donné sur la modification du bilan énergétique Terre-atmosphère. Un forçage radiatif positif tend à réchauffer la surface, tandis qu'un forçage négatif tend à la refroidir.",
          "options": [
            {
              "text": "La quantité d'énergie solaire atteignant la surface terrestre",
              "correct": false
            },
            {
              "text": "Le changement net dans le bilan énergétique de la Terre dû à un facteur externe",
              "correct": true
            },
            {
              "text": "La capacité de l'atmosphère à retenir la chaleur",
              "correct": false
            },
            {
              "text": "La vitesse à laquelle les océans absorbent le CO2",
              "correct": false
            }
          ]
        },
        {
          "q": "Quel est le rôle principal des océans dans le cycle global du carbone?",
          "explanation": "Les océans absorbent une grande quantité de CO2 atmosphérique (puits) mais peuvent aussi en relâcher (source), jouant un rôle crucial dans la régulation de sa concentration atmosphérique.",
          "options": [
            {
              "text": "Émettre principalement du méthane",
              "correct": false
            },
            {
              "text": "Agir comme un puits et une source de dioxyde de carbone",
              "correct": true
            },
            {
              "text": "Produire de l'oxygène par photosynthèse",
              "correct": false
            },
            {
              "text": "Refléter le rayonnement solaire",
              "correct": false
            }
          ]
        }
      ],
      "durationLimit": 600
    }
  },
  "references": [
    "Barry, Roger G., and Richard J. Chorley. 2009. *Atmosphere, Weather and Climate*. 9th ed. London: Routledge.",
    "Boucher, Olivier. 2017. *Le Climat: La Terre et les hommes*. Paris: Dunod.",
    "IPCC (Intergovernmental Panel on Climate Change). 2021. *Climate Change 2021: The Physical Science Basis. Contribution of Working Group I to the Sixth Assessment Report of the Intergovernmental Panel on Climate Change*. Edited by V. Masson-Delmotte et al. Cambridge, UK and New York, NY, USA: Cambridge University Press.",
    "Peixoto, José P., and Abraham H. Oort. 1992. *Physics of Climate*. New York: American Institute of Physics.",
    "Wallace, John M., and Peter V. Hobbs. 2006. *Atmospheric Science: An Introductory Survey*. 2nd ed. Burlington, MA: Academic Press."
  ]
}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.

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