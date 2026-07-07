You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La circulation atmosphérique et océanique sont des systèmes interdépendants et fondamentaux qui régulent le climat mondial en redistribuant la chaleur et l'humidité sur la planète.",
      "La circulation atmosphérique, mue par les différences de pression et la force de Coriolis, est responsable des grands régimes de vents et du transport de chaleur des tropiques vers les pôles.",
      "La circulation océanique, incluant les courants de surface et la circulation thermohaline profonde, joue un rôle tout aussi crucial dans le transport de chaleur, de nutriments et de gaz dissous, influençant les climats régionaux et mondiaux.",
      "Ces dynamiques complexes sont à l'origine des variations climatiques naturelles, telles que les phénomènes El Niño, et sont également sensibles aux perturbations anthropiques.",
      "Une compréhension approfondie de ces mécanismes est essentielle pour modéliser et anticiper les impacts du changement climatique sur notre environnement."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Interactions Climat-Système et Variabilité Climatique",
        "description": "Après avoir exploré les moteurs physiques des climats mondiaux, la prochaine leçon se penchera sur les interactions complexes entre l'atmosphère, l'océan, la cryosphère et la biosphère, et comment ces interactions modulent la variabilité climatique à différentes échelles de temps, des cycles saisonniers aux oscillations décennales.",
        "slug": "interactions-climat-systeme-variabilite"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Climatologie",
        "type": "book",
        "description": "Un ouvrage de référence pour les étudiants en géographie et sciences de l'environnement, couvrant les bases de la climatologie et les grands systèmes climatiques.",
        "author": "Pierre Pagney et Jean-Pierre Chabin",
        "url": "https://www.armand-colin.com/climatologie-9782200269094",
        "year": "2006"
      },
      {
        "title": "NOAA Physical Sciences Laboratory",
        "type": "website",
        "description": "Accès à des données, des outils de recherche et des publications sur l'atmosphère et l'océan, essentiels pour la compréhension des processus climatiques et de la circulation globale.",
        "url": "https://psl.noaa.gov/"
      },
      {
        "title": "The Ocean's Role in Climate",
        "type": "article",
        "description": "Un article scientifique expliquant l'importance cruciale de l'océan dans la régulation du climat terrestre et sa réponse aux changements climatiques, avec un focus sur la circulation océanique.",
        "author": "Stefan Rahmstorf",
        "url": "https://www.pik-potsdam.de/~stefan/Publications/Nature/rahmstorf_nature_2002.pdf",
        "year": "2002"
      },
      {
        "title": "Atmosphere, Ocean and Climate Dynamics: An Introductory Text",
        "type": "book",
        "description": "Un manuel complet et pédagogique pour les étudiants avancés, détaillant la dynamique de l'atmosphère, de l'océan et leurs interactions dans le système climatique.",
        "author": "John Marshall and R. Alan Plumb",
        "url": "https://press.princeton.edu/books/paperback/9780691125545/atmosphere-ocean-and-climate-dynamics",
        "year": "2007"
      }
    ]
  },
  "glossary": [
    {
      "term": "Force de Coriolis",
      "definition": "Force inertielle due à la rotation de la Terre, qui dévie les objets en mouvement (masses d'air, courants océaniques) vers la droite dans l'hémisphère Nord et vers la gauche dans l'hémisphère Sud. Elle est fondamentale pour la formation des systèmes météorologiques et des gyres océaniques."
    },
    {
      "term": "Cellule de Hadley",
      "definition": "Cellule de circulation atmosphérique tropicale caractérisée par l'air chaud et humide qui monte à l'équateur, se déplace vers les pôles en altitude, descend vers 30° de latitude (zones de hautes pressions subtropicales) et retourne vers l'équateur en surface sous forme d'alizés."
    },
    {
      "term": "Circulation Thermohaline",
      "definition": "Circulation océanique profonde, également appelée \"tapis roulant océanique\", mue par les différences de densité de l'eau, elles-mêmes influencées par la température (thermo) et la salinité (haline). Elle joue un rôle crucial dans la redistribution globale de la chaleur, du carbone et des nutriments sur des milliers d'années."
    },
    {
      "term": "El Niño-Oscillation Australe (ENSO)",
      "definition": "Phénomène climatique naturel caractérisé par des variations périodiques de la température de surface de l'océan dans le Pacifique équatorial, couplées à des changements de pression atmosphérique. Il a des répercussions climatiques mondiales significatives, affectant les régimes de précipitations et de températures."
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