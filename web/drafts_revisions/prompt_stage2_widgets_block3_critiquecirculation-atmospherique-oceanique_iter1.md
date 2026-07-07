You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La circulation atmosphérique et océanique est le moteur principal de la distribution de la chaleur et de l'humidité à l'échelle planétaire, façonnant ainsi les climats mondiaux. Les cellules de Hadley, Ferrel et Polaire, couplées aux vents dominants comme les alizés et les vents d'ouest, structurent les grandes zones climatiques et les régimes de précipitations. Parallèlement, les courants océaniques de surface, influencés par les vents et la force de Coriolis, redistribuent la chaleur des tropiques vers les pôles. La circulation thermohaline, ou ",
      "tapis roulant océanique",
      ", joue un rôle crucial dans le transport de chaleur et de carbone sur de longues périodes et à travers les profondeurs océaniques. L'interaction complexe et dynamique entre ces deux systèmes détermine les caractéristiques climatiques régionales et mondiales, et leur compréhension est essentielle pour anticiper les impacts des changements climatiques."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Comprendre les Changements Climatiques et leurs Impacts",
        "description": "Après avoir exploré les mécanismes fondamentaux de la circulation atmosphérique et océanique, nous aborderons les causes et les conséquences des changements climatiques actuels, en lien avec les perturbations de ces systèmes.",
        "slug": "changements-climatiques-impacts"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "La circulation océanique et ses effets sur le climat",
        "type": "article",
        "description": "Un article de vulgarisation scientifique de l'Ifremer expliquant l'importance des courants océaniques dans la régulation climatique.",
        "author": "Ifremer",
        "url": "https://wwz.ifremer.fr/decouvrir/Le-climat/La-circulation-oceanique-et-ses-effets-sur-le-climat",
        "year": "2018"
      },
      {
        "title": "Comprendre la circulation atmosphérique",
        "type": "video",
        "description": "Une vidéo explicative des principes de la circulation atmosphérique globale et de ses composantes.",
        "author": "Météo-France",
        "url": "https://www.youtube.com/watch?v=example_atmospheric_circulation",
        "year": "2020"
      },
      {
        "title": "Principes de Climatologie",
        "type": "book",
        "description": "Un ouvrage de référence sur les bases de la climatologie, incluant les dynamiques atmosphériques et océaniques.",
        "author": "Pierre Pagney",
        "url": "https://example.com/principles-climatology",
        "year": "1996"
      },
      {
        "title": "Le Gulf Stream et le climat européen",
        "type": "website",
        "description": "Une page web du CNRS dédiée à l'influence du Gulf Stream sur le climat de l'Europe.",
        "author": "CNRS",
        "url": "https://www.cnrs.fr/fr/le-gulf-stream-et-le-climat-europeen",
        "year": "2021"
      }
    ]
  },
  "glossary": [
    {
      "term": "Cellule de Hadley",
      "definition": "Circulation atmosphérique majeure dans les régions tropicales, caractérisée par l'air chaud et humide qui monte à l'équateur, se déplace vers les pôles en altitude, puis redescend autour de 30° de latitude, créant des zones de haute pression et des déserts."
    },
    {
      "term": "Force de Coriolis",
      "definition": "Force inertielle due à la rotation de la Terre, qui dévie les objets en mouvement (comme les masses d'air et d'eau) vers la droite dans l'hémisphère Nord et vers la gauche dans l'hémisphère Sud. Elle est essentielle à la formation des vents dominants et des courants océaniques."
    },
    {
      "term": "Circulation Thermohaline",
      "definition": "Système de courants océaniques profonds, également appelé "
    },
    {
      "term": "Alizés",
      "definition": "Vents réguliers et persistants soufflant des hautes pressions subtropicales (environ 30° de latitude) vers les basses pressions équatoriales. Ils sont déviés vers l'ouest par la force de Coriolis et sont historiquement importants pour la navigation."
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