You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette leçon a mis en lumière l'ampleur et la complexité des changements climatiques, confirmant que le réchauffement global est une réalité incontestable, étayée par des observations scientifiques rigoureuses.",
      "Nous avons exploré les mécanismes sous-jacents, notamment l'augmentation des gaz à effet de serre d'origine anthropique, qui sont les principaux moteurs de cette évolution climatique rapide.",
      "Les projections futures, basées sur divers scénarios d'émissions, indiquent une poursuite du réchauffement et une intensification des phénomènes météorologiques extrêmes, avec des conséquences potentiellement dévastatrices.",
      "Les impacts sont déjà visibles et se feront sentir de manière croissante sur les écosystèmes, les ressources en eau, l'agriculture, la santé humaine et les sociétés à travers le monde.",
      "Il est impératif de comprendre que l'atténuation des émissions et l'adaptation aux changements inévitables sont des stratégies complémentaires et urgentes pour faire face à ce défi global."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Stratégies d'atténuation et d'adaptation face aux changements climatiques",
        "description": "Après avoir compris les observations, projections et impacts, la prochaine étape cruciale est d'explorer les solutions. Cette leçon abordera en détail les différentes stratégies d'atténuation (réduction des émissions) et d'adaptation (ajustement aux impacts) que les sociétés peuvent mettre en œuvre pour faire face aux changements climatiques.",
        "slug": "strategies-attenuation-adaptation-climatiques"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Rapports d'évaluation du GIEC (Groupe d'experts intergouvernemental sur l'évolution du climat)",
        "type": "research",
        "description": "Source scientifique la plus complète et faisant autorité sur les changements climatiques, leurs causes, leurs impacts et les options de réponse. Les rapports sont régulièrement mis à jour.",
        "author": "GIEC",
        "url": "https://www.ipcc.ch/reports/",
        "year": "Depuis 1990"
      },
      {
        "title": "Le Climat à découvert : 100 questions pour comprendre et agir",
        "type": "book",
        "description": "Un ouvrage de référence qui démystifie les concepts clés du climat et des changements climatiques à travers 100 questions-réponses, rédigé par des experts français.",
        "author": "Collectif d'auteurs (CNRS, Météo-France, etc.)",
        "url": "https://www.cnrseditions.fr/catalogue/sciences-de-la-terre-et-de-lunivers/le-climat-a-decouvert/",
        "year": "2020"
      },
      {
        "title": "Notre planète (Our Planet)",
        "type": "video",
        "description": "Série documentaire Netflix narrée par David Attenborough, explorant la beauté naturelle de la Terre et les menaces que les changements climatiques font peser sur les écosystèmes mondiaux.",
        "author": "Alastair Fothergill, Keith Scholey",
        "url": "https://www.netflix.com/title/80049832",
        "year": "2019"
      },
      {
        "title": "The Carbon Brief",
        "type": "website",
        "description": "Un site web primé basé au Royaume-Uni, spécialisé dans l'analyse des dernières avancées de la science du climat, des politiques climatiques et de l'énergie, avec des explications claires et des graphiques.",
        "author": "Leo Hickman et al.",
        "url": "https://www.carbonbrief.org/",
        "year": "Depuis 2011"
      }
    ]
  },
  "glossary": [
    {
      "term": "Effet de serre",
      "definition": "Phénomène naturel par lequel certains gaz présents dans l'atmosphère terrestre (gaz à effet de serre ou GES) retiennent une partie de la chaleur émise par la surface de la Terre, empêchant celle-ci de s'échapper directement vers l'espace et contribuant ainsi à maintenir une température moyenne propice à la vie. L'augmentation anthropique de ces gaz intensifie cet effet, conduisant au réchauffement climatique."
    },
    {
      "term": "Forçage radiatif",
      "definition": "Mesure de l'influence d'un facteur donné sur l'équilibre énergétique du système Terre-atmosphère. Il quantifie le changement net (en watts par mètre carré, W/m²) dans l'énergie absorbée par la Terre par rapport à l'énergie rayonnée vers l'espace, dû à un changement dans un facteur climatique (ex: concentration de GES, aérosols, albédo). Un forçage radiatif positif tend à réchauffer la surface, un forçage négatif à la refroidir."
    },
    {
      "term": "GIEC (Groupe d'experts intergouvernemental sur l'évolution du climat)",
      "definition": "Organisme scientifique intergouvernemental créé en 1988 par l'Organisation météorologique mondiale (OMM) et le Programme des Nations Unies pour l'environnement (PNUE). Son rôle est d'évaluer de manière exhaustive, objective, ouverte et transparente les informations scientifiques, techniques et socio-économiques pertinentes pour comprendre les changements climatiques, leurs impacts et les options de réponse."
    },
    {
      "term": "Point de bascule (Tipping point)",
      "definition": "Seuil critique au-delà duquel un système (climatique, écologique, social) subit un changement irréversible et souvent abrupt, même si la cause initiale du changement est supprimée. Dans le contexte climatique, cela peut concerner la fonte des calottes glaciaires, l'effondrement de courants océaniques majeurs ou la mort massive de forêts tropicales, avec des conséquences en cascade difficiles à prévoir et à contrôler."
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