You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette leçon a exploré les fondements de l'Histoire contemporaine, soulignant la complexité de sa définition et de sa problématisation.",
      "Nous avons vu que cette période, bien que souvent délimitée par la Révolution française de 1789 ou le Congrès de Vienne de 1815, est avant tout caractérisée par des ruptures profondes et des transformations majeures.",
      "L'Histoire contemporaine n'est pas une simple chronologie, mais un champ d'étude dynamique qui interroge les continuités et les discontinuités avec le passé.",
      "Elle se distingue par l'abondance et la diversité de ses sources, ainsi que par l'émergence de nouvelles méthodes historiographiques.",
      "Comprendre ses enjeux est essentiel pour décrypter les racines de notre monde actuel et les défis qu'il présente."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Explorer les grandes transformations du XIXe siècle",
        "description": "Après avoir défini le cadre et les enjeux de l'Histoire contemporaine, la prochaine leçon se penchera sur les grandes transformations politiques et sociales qui ont marqué le XIXe siècle, en commençant par l'héritage de la Révolution française et l'ère napoléonienne.",
        "slug": "histoire-contemporaine-xixe-siecle-transformations"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Introduction à l'histoire de notre temps",
        "type": "book",
        "description": "Un ouvrage classique et fondamental pour appréhender les grandes lignes de l'histoire contemporaine française et européenne, par un historien majeur.",
        "author": "René Rémond",
        "url": "https://www.google.com/search?q=Ren%C3%A9+R%C3%A9mond+Introduction+%C3%A0+l%27histoire+de+notre+temps",
        "year": "1974"
      },
      {
        "title": "Histoire du XIXe siècle",
        "type": "book",
        "description": "Manuel de référence couvrant en détail les événements et les dynamiques du XIXe siècle, période clé de l'Histoire contemporaine.",
        "author": "Serge Berstein, Pierre Milza",
        "url": "https://www.google.com/search?q=Serge+Berstein+Pierre+Milza+Histoire+du+XIXe+si%C3%A8cle",
        "year": "1996"
      },
      {
        "title": "Comprendre l'historiographie",
        "type": "website",
        "description": "Une ressource en ligne offrant une introduction claire aux concepts et aux méthodes de l'historiographie, essentielle pour tout étudiant en histoire.",
        "author": "Non spécifié",
        "url": "https://www.historiographie.net",
        "year": ""
      }
    ]
  },
  "glossary": [
    {
      "term": "Histoire contemporaine",
      "definition": "Période historique dont les bornes chronologiques sont débattues, mais qui débute généralement avec la Révolution française (1789) ou le Congrès de Vienne (1815) et s'étend jusqu'à nos jours. Elle se caractérise par des transformations politiques, sociales, économiques et culturelles profondes, et par l'émergence de la société de masse."
    },
    {
      "term": "Historiographie",
      "definition": "L'étude de la manière dont l'histoire est écrite et interprétée au fil du temps. Elle analyse les méthodes, les approches, les biais et les évolutions des pratiques des historiens, ainsi que la production des savoirs historiques."
    },
    {
      "term": "Périodisation",
      "definition": "Opération intellectuelle qui consiste à découper le temps historique en périodes distinctes, définies par des ruptures ou des continuités significatives. La périodisation est un outil essentiel pour l'historien, mais elle est toujours une construction interprétative et non une donnée objective."
    },
    {
      "term": "Source historique",
      "definition": "Tout document, vestige matériel, témoignage oral ou écrit, qui fournit des informations sur le passé et que l'historien utilise pour construire son récit et son analyse. Les sources peuvent être primaires (contemporaines des faits) ou secondaires (analyses postérieures)."
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