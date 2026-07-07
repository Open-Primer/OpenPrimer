You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette leçon a exploré la genèse et l'évolution des sciences de la Terre et du climat, soulignant comment notre compréhension de la planète a progressé au fil des siècles.",
      "Nous avons retracé les contributions des penseurs antiques aux découvertes révolutionnaires de la Renaissance et de l'ère moderne, qui ont jeté les bases de disciplines comme la géologie et la météorologie.",
      "L'émergence de concepts clés tels que la dérive des continents et la tectonique des plaques a transformé notre vision de la dynamique terrestre, tandis que l'étude des climats a évolué de l'observation locale à une science globale complexe.",
      "L'interconnexion croissante entre les différentes branches des sciences de la Terre et du climat est devenue évidente, permettant une approche holistique des systèmes planétaires.",
      "Enfin, nous avons mis en lumière l'importance de ces sciences pour comprendre les défis environnementaux actuels et futurs, notamment le changement climatique."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Introduction aux grands systèmes terrestres",
        "description": "La prochaine leçon approfondira les interactions complexes entre l'atmosphère, l'hydrosphère, la lithosphère et la biosphère, en s'appuyant sur les fondations historiques établies aujourd'hui.",
        "slug": "introduction-grands-systemes-terrestres"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Histoire de la Géologie",
        "type": "book",
        "description": "Un ouvrage de référence sur le développement historique de la géologie, des premières observations aux théories modernes.",
        "author": "François Ellenberger",
        "url": "https://www.persee.fr/doc/rhs_0048-7952_1990_num_43_1_4589",
        "year": "1988"
      },
      {
        "title": "La Naissance de la Climatologie Moderne",
        "type": "article",
        "description": "Cet article explore les étapes clés et les figures marquantes qui ont contribué à l'établissement de la climatologie comme discipline scientifique à part entière.",
        "author": "Jean-Pierre Javelle",
        "url": "https://www.cairn.info/revue-climat-2004-1-page-11.htm",
        "year": "2004"
      },
      {
        "title": "Le Climat : La Terre et les Hommes",
        "type": "book",
        "description": "Une synthèse complète sur l'histoire du climat, son évolution et son impact sur les sociétés humaines, offrant une perspective historique et prospective.",
        "author": "Emmanuel Le Roy Ladurie",
        "url": "https://www.gallimard.fr/Catalogue/GALLIMARD/Folio-Histoire/Le-climat",
        "year": "1983"
      }
    ]
  },
  "glossary": [
    {
      "term": "Géologie",
      "definition": "Science de la Terre qui étudie la composition, la structure, l'histoire et l'évolution de la Terre, ainsi que les processus qui la façonnent (volcanisme, séismes, érosion, etc.)."
    },
    {
      "term": "Climatologie",
      "definition": "Science qui étudie le climat, c'est-à-dire l'ensemble des conditions météorologiques moyennes et de leurs variations sur de longues périodes et à l'échelle régionale ou globale."
    },
    {
      "term": "Tectonique des plaques",
      "definition": "Théorie scientifique qui décrit les mouvements à grande échelle de la lithosphère terrestre. Elle explique la formation des montagnes, les séismes, le volcanisme et la dérive des continents."
    },
    {
      "term": "Paléoclimatologie",
      "definition": "Branche de la climatologie qui étudie les climats passés de la Terre, en utilisant des indicateurs naturels (carottes de glace, sédiments, fossiles) pour reconstituer les conditions climatiques anciennes."
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