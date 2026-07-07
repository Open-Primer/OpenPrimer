You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La géomorphologie est l'étude scientifique des formes du relief terrestre, de leur origine, de leur évolution et des processus qui les façonnent.",
      "Nous avons exploré les processus endogènes, tels que la tectonique des plaques et le volcanisme, qui créent les grandes structures du relief comme les chaînes de montagnes et les fosses océaniques.",
      "Parallèlement, les processus exogènes, incluant l'érosion (fluviale, glaciaire, éolienne, marine) et la sédimentation, modifient et sculptent ces formes initiales, créant vallées, deltas, dunes et falaises.",
      "La compréhension de l'interaction complexe entre ces forces internes et externes est fondamentale pour interpréter les paysages que nous observons et anticiper leurs évolutions.",
      "Enfin, l'impact anthropique sur les formes du relief, de l'urbanisation à l'agriculture, a été souligné comme un facteur géomorphologique de plus en plus prépondérant, modifiant significativement les dynamiques naturelles."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Approfondir la Géomorphologie Climatique et Zonale",
        "description": "Après avoir compris les processus fondamentaux de la géomorphologie, la prochaine étape logique est d'examiner comment les différents climats influencent spécifiquement les processus géomorphologiques et les formes de relief associées, en explorant les zones froides, tempérées, arides et tropicales.",
        "slug": "geomorphologie-climatique-zonale"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Géomorphologie: Reliefs, climats, hommes",
        "type": "book",
        "description": "Un ouvrage de référence complet couvrant les principes fondamentaux de la géomorphologie, les processus et les formes du relief, avec une attention particulière aux interactions entre le climat et l'activité humaine.",
        "author": "Pierre Estienne, Alain Godard",
        "url": "https://www.armand-colin.com/geomorphologie-reliefs-climats-hommes-9782200350461",
        "year": "2007"
      },
      {
        "title": "Géomorphologie - Encyclopédie de l'environnement",
        "type": "website",
        "description": "Une ressource en ligne offrant des articles détaillés et accessibles sur divers aspects de la géomorphologie, ses concepts clés et ses applications, idéale pour consolider les connaissances.",
        "url": "https://www.encyclopedie-environnement.org/geomorphologie/",
        "year": "2023"
      },
      {
        "title": "L'évolution des paysages : une approche géomorphologique",
        "type": "article",
        "description": "Un article explorant les dynamiques à long terme de l'évolution des paysages sous l'influence des processus géomorphologiques et des changements environnementaux, avec des études de cas.",
        "author": "Jean-Pierre Bravard",
        "url": "https://www.cairn.info/revue-geocarrefour-2010-1-page-3.htm",
        "year": "2010"
      }
    ]
  },
  "glossary": [
    {
      "term": "Géomorphologie",
      "definition": "Discipline scientifique qui étudie les formes du relief terrestre, leur origine, leur évolution, leur classification et les processus (endogènes et exogènes) qui les façonnent. Elle est une branche de la géographie physique."
    },
    {
      "term": "Processus endogène",
      "definition": "Ensemble des forces et phénomènes géologiques internes à la Terre (tectonique des plaques, volcanisme, séismes, orogenèse) qui sont responsables de la création des grandes structures du relief (chaînes de montagnes, fosses océaniques, plateaux)."
    },
    {
      "term": "Processus exogène",
      "definition": "Ensemble des phénomènes externes à la Terre (érosion, transport, sédimentation, altération) causés par des agents climatiques (eau, vent, glace, gravité) qui modifient et sculptent les formes du relief créées par les processus endogènes."
    },
    {
      "term": "Relief",
      "definition": "L'ensemble des formes et des inégalités de la surface terrestre, résultant de l'action combinée des processus endogènes et exogènes. Il peut être positif (montagnes, collines) ou négatif (vallées, dépressions) et varie en échelle et en complexité."
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