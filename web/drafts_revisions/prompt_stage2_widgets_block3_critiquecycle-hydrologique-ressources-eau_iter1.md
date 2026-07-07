You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Le cycle hydrologique est un processus fondamental et continu de circulation de l'eau sur, dans et au-dessus de la Terre, essentiel à la vie et au fonctionnement des écosystèmes. Il est alimenté par l'énergie solaire et la gravité, régissant la distribution de l'eau sous ses différentes formes.",
      "Nous avons exploré les principales étapes de ce cycle, incluant l'évaporation, la transpiration, la condensation, les précipitations, le ruissellement de surface, l'infiltration et l'écoulement souterrain. Chacune de ces phases joue un rôle crucial dans le maintien de l'équilibre hydrique global.",
      "Les ressources en eau douce, bien que renouvelables, sont inégalement réparties et soumises à des pressions croissantes dues à l'augmentation démographique, à l'urbanisation, à l'industrialisation et à l'agriculture intensive. La compréhension de la dynamique du cycle est donc primordiale pour leur gestion.",
      "Les enjeux liés à l'eau sont multiples et complexes, englobant la sécurité alimentaire, la santé publique, la production d'énergie et la préservation de la biodiversité. La surexploitation, la pollution et les impacts du changement climatique menacent la disponibilité et la qualité de cette ressource vitale.",
      "Une gestion intégrée et durable des ressources en eau est impérative pour faire face à ces défis, nécessitant une approche multidisciplinaire et une coopération à différentes échelles, de la locale à l'internationale, afin d'assurer un accès équitable et durable à l'eau pour tous."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Impacts du changement climatique sur le cycle hydrologique",
        "description": "Après avoir compris la dynamique du cycle hydrologique, la prochaine étape sera d'analyser comment le changement climatique modifie ses composantes (précipitations, évaporation, fonte des glaciers) et les conséquences sur la disponibilité des ressources en eau à l'échelle mondiale et régionale.",
        "slug": "impacts-changement-climatique-cycle-hydrologique"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "L'eau: Géopolitique, enjeux et stratégies",
        "type": "book",
        "description": "Une analyse approfondie des enjeux géopolitiques liés à l'eau, des conflits potentiels et des stratégies de gestion à l'échelle internationale.",
        "author": "David Blanchon",
        "url": "https://www.armand-colin.com/leau-geopolitique-enjeux-et-strategies-9782200616900",
        "year": "2019"
      },
      {
        "title": "Le cycle de l'eau",
        "type": "website",
        "description": "Un portail éducatif offrant des explications claires et des schémas interactifs sur les différentes phases du cycle hydrologique.",
        "author": "Office International de l'Eau (OIEau)",
        "url": "https://www.oieau.fr/le-cycle-de-leau",
        "year": "N/A"
      },
      {
        "title": "Rapport mondial sur la mise en valeur des ressources en eau",
        "type": "research",
        "description": "Publication annuelle de l'UNESCO offrant un panorama complet des défis et des solutions pour la gestion de l'eau dans le monde.",
        "author": "UNESCO",
        "url": "https://www.unesco.org/fr/water-resources-development-report",
        "year": "Annuel"
      },
      {
        "title": "Water: The Epic Struggle for Wealth, Power, and Civilization",
        "type": "book",
        "description": "Un ouvrage qui retrace l'histoire de l'humanité à travers sa relation avec l'eau, de l'Antiquité aux défis contemporains.",
        "author": "Steven Solomon",
        "url": "https://www.harpercollins.com/products/water-steven-solomon?variant=32207039750178",
        "year": "2010"
      }
    ]
  },
  "glossary": [
    {
      "term": "Cycle hydrologique",
      "definition": "Processus continu de circulation de l'eau sur, dans et au-dessus de la Terre, impliquant des phases d'évaporation, de condensation, de précipitations, de ruissellement et d'infiltration. Il est essentiel pour le renouvellement des ressources en eau douce."
    },
    {
      "term": "Évapotranspiration",
      "definition": "Somme de l'évaporation de l'eau depuis les surfaces terrestres (sols, plans d'eau) et de la transpiration des végétaux. C'est un processus clé du retour de l'eau à l'atmosphère."
    },
    {
      "term": "Nappe phréatique",
      "definition": "Couche d'eau souterraine saturée, située à faible profondeur, dont le niveau supérieur est en contact avec l'atmosphère via les pores du sol. Elle est une source importante d'approvisionnement en eau potable et pour l'irrigation."
    },
    {
      "term": "Bilan hydrique",
      "definition": "Équation qui exprime la conservation de la masse d'eau pour un système donné (bassin versant, région, etc.) sur une période donnée. Il compare les entrées (précipitations) et les sorties (évapotranspiration, ruissellement, infiltration) d'eau, ainsi que les variations de stockage."
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