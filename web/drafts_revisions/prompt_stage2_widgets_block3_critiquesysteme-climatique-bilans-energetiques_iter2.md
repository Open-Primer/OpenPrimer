You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Ce cours a exploré les fondements du système climatique terrestre, en mettant en lumière l'importance cruciale des bilans énergétiques.",
      "Nous avons analysé comment l'énergie solaire est reçue, réfléchie et réémise par la Terre, soulignant le rôle de l'albédo et du rayonnement infrarouge.",
      "La composition atmosphérique, notamment la présence des gaz à effet de serre, a été identifiée comme un facteur déterminant dans la régulation de la température planétaire.",
      "La compréhension de ces mécanismes est essentielle pour appréhender la stabilité et les variations du climat.",
      "En somme, le système climatique est un équilibre dynamique complexe, où chaque composant joue un rôle vital dans la distribution de l'énergie et la maintenance des conditions propices à la vie."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Dynamiques Océaniques et Atmosphériques",
        "description": "Après avoir établi les bases du système climatique et de ses bilans énergétiques, la prochaine leçon approfondira les dynamiques océaniques et atmosphériques. Nous examinerons comment les courants marins et les circulations atmosphériques redistribuent la chaleur et l'humidité à l'échelle globale, influençant ainsi les climats régionaux et les phénomènes météorologiques extrêmes. Cette exploration nous permettra de comprendre les interactions complexes entre l'océan et l'atmosphère, éléments clés de la variabilité climatique.",
        "slug": "dynamiques-oceaniques-atmospheriques"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Introduction à la climatologie",
        "type": "book",
        "description": "Un ouvrage de référence pour comprendre les bases de la climatologie, incluant les bilans énergétiques et la composition atmosphérique.",
        "author": "Jean-Paul Amat, Robert Caralp, Maurice Lussault",
        "url": "https://www.armand-colin.com/introduction-la-climatologie-9782200617658",
        "year": "2017"
      },
      {
        "title": "Le bilan radiatif de la Terre",
        "type": "article",
        "description": "Explication détaillée du bilan radiatif terrestre, de l'effet de serre et de l'influence des gaz atmosphériques.",
        "author": "Météo-France",
        "url": "https://www.meteofrance.com/comprendre-le-climat/le-bilan-radiatif-de-la-terre",
        "year": "2023"
      },
      {
        "title": "Rapport de synthèse du GIEC (AR6)",
        "type": "research",
        "description": "Le dernier rapport d'évaluation du Groupe d'experts intergouvernemental sur l'évolution du climat, offrant une synthèse des connaissances scientifiques sur le changement climatique, y compris les bases physiques.",
        "author": "Groupe d'experts intergouvernemental sur l'évolution du climat (GIEC)",
        "url": "https://www.ipcc.ch/report/ar6/syr/",
        "year": "2023"
      }
    ]
  },
  "glossary": [
    {
      "term": "Bilan énergétique terrestre",
      "definition": "Représente l'équilibre entre l'énergie solaire reçue par la Terre et l'énergie réémise vers l'espace. Il détermine la température moyenne de la planète et est influencé par l'albédo et l'effet de serre."
    },
    {
      "term": "Effet de serre",
      "definition": "Phénomène naturel par lequel certains gaz présents dans l'atmosphère (gaz à effet de serre) absorbent et réémettent le rayonnement infrarouge terrestre, piégeant ainsi une partie de la chaleur et maintenant une température propice à la vie."
    },
    {
      "term": "Albédo",
      "definition": "Mesure de la réflectivité d'une surface ou d'un corps. Il s'agit du rapport entre l'énergie lumineuse réfléchie et l'énergie lumineuse incidente. Un albédo élevé signifie une forte réflexion (ex: neige), un albédo faible une forte absorption (ex: océan)."
    },
    {
      "term": "Forçage radiatif",
      "definition": "Mesure de l'influence d'un facteur donné (ex: augmentation d'un gaz à effet de serre, changement d'albédo) sur l'équilibre énergétique du système Terre-atmosphère. Un forçage radiatif positif tend à réchauffer le système, un forçage négatif à le refroidir."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'conclusionSummary', 'whatsNext', 'goingFurther', or 'glossary')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.