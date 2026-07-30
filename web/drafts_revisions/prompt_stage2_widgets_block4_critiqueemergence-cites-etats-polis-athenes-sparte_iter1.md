You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Les cités-États, ou \"polis\", étaient la forme d'organisation politique dominante en Grèce antique, chacune étant une entité indépendante.",
      "Athènes est célèbre pour avoir développé la démocratie, un système où les citoyens participaient directement aux décisions politiques.",
      "Sparte, en revanche, était une cité-État militaire dirigée par une oligarchie, valorisant la discipline et la force.",
      "Les différences fondamentales entre Athènes et Sparte ont souvent conduit à des rivalités et des conflits majeurs dans l'histoire grecque.",
      "La géographie montagneuse de la Grèce a favorisé l'isolement et le développement de nombreuses cités-États distinctes, chacune avec ses propres caractéristiques."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La vie quotidienne dans les cités-États",
        "description": "Explorez comment les citoyens, les femmes, les esclaves et les étrangers vivaient et interagissaient au sein des sociétés athénienne et spartiate.",
        "slug": "vie-quotidienne-cites-etats"
      },
      {
        "title": "Les guerres médiques et le conflit entre Athènes et Sparte",
        "description": "Découvrez les grandes guerres qui ont opposé les Grecs aux Perses, et comment la rivalité entre Athènes et Sparte a culminé dans la guerre du Péloponnèse.",
        "slug": "guerres-mediques-peloponnese"
      },
      {
        "title": "L'héritage de la Grèce antique",
        "description": "Examinez l'impact durable des innovations grecques en matière de philosophie, d'art, de science et de politique sur le monde occidental.",
        "slug": "heritage-grece-antique"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "La Cité grecque",
        "type": "book",
        "description": "Une étude fondamentale sur l'organisation politique et sociale des cités grecques, de leurs origines à leur déclin.",
        "author": "Gustave Glotz",
        "year": "1928"
      },
      {
        "title": "Histoire de la Grèce antique",
        "type": "book",
        "description": "Un ouvrage de référence qui couvre l'ensemble de l'histoire grecque, avec des sections détaillées sur l'émergence et le fonctionnement des cités-États.",
        "author": "Claude Mossé",
        "year": "1992"
      },
      {
        "title": "Polis (Grèce antique)",
        "type": "website",
        "description": "Article détaillé de Wikipédia sur le concept de la polis, son évolution et ses caractéristiques dans le monde grec antique.",
        "url": "https://fr.wikipedia.org/wiki/Polis_(Gr%C3%A8ce_antique)"
      },
      {
        "title": "La Grèce antique : Athènes et Sparte",
        "type": "website",
        "description": "Un dossier éducatif de Lumni avec des explications et des ressources multimédias sur les deux principales cités-États grecques.",
        "url": "https://www.lumni.fr/dossier/la-grece-antique"
      },
      {
        "title": "La démocratie athénienne",
        "type": "website",
        "description": "Un article de l'Encyclopédie Larousse en ligne détaillant les principes et le fonctionnement de la démocratie à Athènes.",
        "url": "https://www.larousse.fr/encyclopedie/divers/d%C3%A9mocratie_ath%C3%A9nienne/115990"
      },
      {
        "title": "La cité grecque",
        "type": "research",
        "description": "Un article de synthèse sur la cité grecque, ses origines et son organisation, publié dans une revue académique.",
        "author": "Pierre Lévêque",
        "year": "1964"
      },
      {
        "title": "Sparte, la cité des guerriers",
        "type": "website",
        "description": "Une page décrivant l'organisation militaire et sociale de Sparte, accessible pour un public large.",
        "url": "https://www.histoire-pour-tous.fr/dossiers/176-grece-antique/371-sparte-la-cite-des-guerriers.html"
      }
    ]
  },
  "glossary": [
    {
      "term": "Polis",
      "definition": "Terme grec désignant la cité-État, une entité politique indépendante comprenant une ville et son territoire environnant, caractéristique de la Grèce antique."
    },
    {
      "term": "Cité-État",
      "definition": "Forme d'organisation politique et sociale autonome, où une ville et sa campagne forment une unité souveraine avec ses propres lois et son propre gouvernement."
    },
    {
      "term": "Démocratie",
      "definition": "Système de gouvernement où le pouvoir est exercé par le peuple, comme à Athènes où les citoyens participaient directement aux décisions politiques."
    },
    {
      "term": "Oligarchie",
      "definition": "Forme de gouvernement où le pouvoir est détenu par un petit groupe de personnes privilégiées, souvent en raison de leur richesse, de leur lignée ou de leur statut militaire, comme à Sparte."
    },
    {
      "term": "Citoyen",
      "definition": "Dans la Grèce antique, un homme libre né de parents citoyens, ayant le droit de participer à la vie politique et religieuse de la cité."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, "N/A", "## Section Name", or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used. Note that for goingFurther items, omitting the "url" property entirely is perfectly acceptable if a real URL is not known; do not reject items for not having a "url" property, but reject them if they have a dummy/placeholder URL like "example.com" or "placeholder.com".
4. CRITICAL WIDGET CONNECTION: The glossary, transition steps (whatsNext), and goingFurther items must be strongly connected to the lesson's topics and highly informative. Glossary definitions must be detailed and context-specific.

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