You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette évaluation terminale a permis de synthétiser les connaissances acquises en géographie physique et climatologie, couvrant les interactions complexes entre l'atmosphère, l'hydrosphère, la lithosphère et la biosphère.",
      "Nous avons exploré les grands systèmes climatiques, les processus géomorphologiques majeurs et la distribution spatiale des écosystèmes, soulignant leur dynamique et leur interdépendance.",
      "L'impact des activités humaines sur ces systèmes naturels, notamment le changement climatique et l'altération des paysages, a été un fil conducteur essentiel tout au long du cours.",
      "La compréhension des mécanismes fondamentaux de la Terre est cruciale pour analyser les défis environnementaux contemporains et proposer des solutions durables.",
      "Ce cours a renforcé la capacité d'analyse critique des phénomènes naturels et la maîtrise des outils conceptuels et méthodologiques propres à la géographie physique."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Application des connaissances et perspectives professionnelles",
        "description": "Maintenant que vous avez consolidé vos bases en géographie physique et climatologie, il est temps d'explorer comment appliquer ces connaissances dans des contextes professionnels ou de recherche. Réfléchissez aux spécialisations possibles en master ou aux carrières dans l'aménagement du territoire, l'environnement, la gestion des risques ou la recherche scientifique.",
        "slug": "application-perspectives"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Changement climatique : Comprendre et agir",
        "type": "book",
        "description": "Un ouvrage de référence pour approfondir les mécanismes du changement climatique et les stratégies d'adaptation et d'atténuation.",
        "author": "Jean Jouzel et Olivier Nouaillac",
        "url": "https://www.pourlascience.fr/sd/livres/changement-climatique-comprendre-et-agir-19800.php",
        "year": "2020"
      },
      {
        "title": "Géographie physique",
        "type": "book",
        "description": "Manuel complet couvrant tous les aspects de la géographie physique, idéal pour une révision ou un approfondissement.",
        "author": "Pierre Pagney et Jean-Pierre Chaline",
        "url": "https://www.armand-colin.com/geographie-physique-9782200617300",
        "year": "2017"
      },
      {
        "title": "Le site du GIEC (IPCC)",
        "type": "website",
        "description": "Accédez aux rapports d'évaluation les plus récents sur le changement climatique, ses impacts et les options d'atténuation.",
        "author": "Groupe d'experts intergouvernemental sur l'évolution du climat",
        "url": "https://www.ipcc.ch/languages/french/",
        "year": ""
      },
      {
        "title": "Cours en ligne sur la télédétection et les SIG",
        "type": "website",
        "description": "Des ressources pour maîtriser les outils essentiels d'analyse spatiale en géographie physique.",
        "author": "Divers contributeurs universitaires",
        "url": "https://www.coursera.org/courses?query=gis%20remote%20sensing",
        "year": ""
      }
    ]
  },
  "glossary": [
    {
      "term": "Climatologie",
      "definition": "Science qui étudie les climats, leurs caractéristiques, leur variabilité spatiale et temporelle, ainsi que les facteurs qui les influencent (rayonnements solaires, circulation atmosphérique, océans, relief, etc.)."
    },
    {
      "term": "Géomorphologie",
      "definition": "Discipline de la géographie physique qui étudie les formes du relief terrestre, leur origine, leur évolution et les processus qui les modèlent (érosion, tectonique, volcanisme, etc.)."
    },
    {
      "term": "Hydrosphère",
      "definition": "Ensemble des eaux présentes sur Terre, qu'elles soient sous forme liquide (océans, mers, lacs, rivières, eaux souterraines), solide (glaciers, calottes polaires) ou gazeuse (vapeur d'eau atmosphérique)."
    },
    {
      "term": "Biogéographie",
      "definition": "Science qui étudie la distribution spatiale des espèces vivantes (animaux et végétaux) et des écosystèmes, ainsi que les facteurs historiques, écologiques et environnementaux qui déterminent cette distribution."
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