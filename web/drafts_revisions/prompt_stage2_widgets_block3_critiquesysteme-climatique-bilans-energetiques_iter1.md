You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Le système climatique terrestre est un ensemble complexe et dynamique, résultant des interactions entre l'atmosphère, l'hydrosphère, la cryosphère, la lithosphère et la biosphère.",
      "Le bilan énergétique de la Terre, qui équilibre l'énergie solaire reçue et l'énergie réémise vers l'espace, est le moteur fondamental de notre climat et détermine la température moyenne de la planète.",
      "La composition atmosphérique, en particulier la concentration des gaz à effet de serre, joue un rôle prépondérant dans la régulation thermique de la Terre en piégeant une partie du rayonnement infrarouge.",
      "L'albédo des différentes surfaces terrestres (glace, océans, forêts) influence directement la quantité d'énergie solaire absorbée ou réfléchie, impactant ainsi le bilan énergétique global.",
      "Comprendre ces mécanismes est essentiel pour appréhender les causes et les conséquences des changements climatiques actuels, souvent liés à des perturbations anthropiques de ce bilan naturel."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Explorer les forçages radiatifs",
        "description": "Approfondir la compréhension des facteurs naturels et anthropiques qui modifient le bilan énergétique terrestre et influencent le climat.",
        "slug": "forcages-radiatifs-climatiques"
      },
      {
        "title": "Analyser les boucles de rétroaction climatique",
        "description": "Étudier comment les changements initiaux dans le système climatique peuvent être amplifiés ou atténués par des processus internes complexes.",
        "slug": "boucles-retroaction-climatique"
      },
      {
        "title": "Introduction aux modèles climatiques",
        "description": "Découvrir comment les scientifiques utilisent des modèles numériques pour simuler le climat passé, présent et futur de la Terre.",
        "slug": "introduction-modeles-climatiques"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Climatologie",
        "type": "book",
        "description": "Un ouvrage de référence pour comprendre les bases de la climatologie, incluant les bilans énergétiques, la dynamique atmosphérique et les grands types de climats.",
        "author": "Pierre Pagney, Jean-Pierre Chabin",
        "year": "2002"
      },
      {
        "title": "Rapports d'évaluation du GIEC (IPCC)",
        "type": "website",
        "description": "Source incontournable d'informations scientifiques sur le changement climatique, ses causes, ses impacts et les options d'atténuation, basées sur les dernières recherches.",
        "author": "Groupe d'experts intergouvernemental sur l'évolution du climat",
        "url": "https://www.ipcc.ch/reports/"
      },
      {
        "title": "The Earth's Energy Budget",
        "type": "article",
        "description": "Un article scientifique clé détaillant les composants et les mesures du bilan énergétique global de la Terre, essentiel pour la modélisation climatique.",
        "author": "Kevin E. Trenberth, John T. Fasullo, Jeffrey Kiehl",
        "url": "https://journals.ametsoc.org/view/journals/bams/90/3/2008bams2634_1.xml",
        "year": "2009"
      }
    ]
  },
  "glossary": [
    {
      "term": "Bilan Énergétique Terrestre",
      "definition": "La comptabilité de l'énergie solaire reçue par la Terre, de l'énergie réfléchie et de l'énergie réémise sous forme de rayonnement infrarouge, qui détermine la température moyenne de la planète et sa stabilité thermique."
    },
    {
      "term": "Effet de Serre",
      "definition": "Phénomène naturel par lequel certains gaz présents dans l'atmosphère (gaz à effet de serre) absorbent et réémettent le rayonnement infrarouge terrestre, piégeant ainsi la chaleur et réchauffant la surface de la Terre, la rendant habitable."
    },
    {
      "term": "Albédo",
      "definition": "Mesure de la réflectivité d'une surface ou d'un corps. Il représente la fraction du rayonnement solaire incident qui est réfléchie sans être absorbée. Une surface claire (neige, glace) a un albédo élevé, tandis qu'une surface sombre (océan, forêt) a un albédo faible."
    },
    {
      "term": "Gaz à Effet de Serre (GES)",
      "definition": "Composants gazeux de l'atmosphère, naturels ou anthropiques, qui absorbent et émettent le rayonnement infrarouge, contribuant à l'effet de serre. Les principaux GES sont la vapeur d'eau (H2O), le dioxyde de carbone (CO2), le méthane (CH4) et l'oxyde nitreux (N2O)."
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