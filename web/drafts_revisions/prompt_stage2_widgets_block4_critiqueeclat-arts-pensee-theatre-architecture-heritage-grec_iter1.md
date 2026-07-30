You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Le théâtre grec antique, avec ses genres de tragédie et de comédie, était une forme d'art essentielle qui reflétait et influençait la société, la religion et la politique de l'époque.",
      "L'architecture grecque a établi des principes fondamentaux de beauté, de proportion et de fonctionnalité, notamment à travers les ordres dorique, ionique et corinthien, dont l'influence est encore visible aujourd'hui.",
      "La pensée grecque a donné naissance à la philosophie, à la logique, à la rhétorique et à des concepts politiques comme la démocratie, façonnant durablement la civilisation occidentale.",
      "Des figures emblématiques telles que Sophocle, Phidias, Socrate, Platon et Aristote ont laissé un héritage intellectuel et artistique colossal qui continue d'inspirer et d'être étudié.",
      "L'héritage de la Grèce antique ne se limite pas aux ruines et aux textes, mais imprègne nos institutions, nos arts, notre langage et notre manière de penser le monde."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La vie quotidienne en Grèce antique",
        "description": "Découvrez comment les Grecs vivaient, mangeaient, s'habillaient et organisaient leur société au quotidien, en explorant les coutumes et les traditions.",
        "slug": "la-vie-quotidienne-grece-antique"
      },
      {
        "title": "Les guerres médiques et du Péloponnèse",
        "description": "Plongez dans les conflits majeurs qui ont marqué l'histoire de la Grèce antique, leurs causes, leurs déroulements et leurs conséquences sur les cités-États.",
        "slug": "les-guerres-mediques-peloponnese"
      },
      {
        "title": "Alexandre le Grand et l'ère hellénistique",
        "description": "Explorez l'ascension fulgurante d'Alexandre le Grand, la conquête de son empire et l'impact de la culture grecque sur le monde méditerranéen et oriental.",
        "slug": "alexandre-le-grand-ere-hellenistique"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "L'Art grec",
        "type": "book",
        "description": "Un ouvrage de référence sur l'art et l'architecture de la Grèce antique, couvrant les différentes périodes et les chefs-d'œuvre emblématiques.",
        "author": "Roland Martin",
        "year": "1994"
      },
      {
        "title": "La Cité antique",
        "type": "book",
        "description": "Une étude fondamentale sur les origines et l'évolution des institutions politiques et religieuses des cités grecques et romaines.",
        "author": "Numa Denis Fustel de Coulanges",
        "year": "1864"
      },
      {
        "title": "Le Théâtre grec antique",
        "type": "website",
        "description": "Un dossier complet sur le théâtre grec, ses origines, ses auteurs, ses genres et son rôle dans la société athénienne.",
        "url": "https://www.histoire-pour-tous.fr/dossiers/1932-le-theatre-grec-antique.html"
      },
      {
        "title": "Les Grands Philosophes de la Grèce antique",
        "type": "video",
        "description": "Une introduction aux figures majeures de la philosophie grecque, de Socrate à Aristote, et à leurs contributions essentielles.",
        "url": "https://www.youtube.com/watch?v=1_1_1_1_1_1"
      },
      {
        "title": "L'Architecture grecque",
        "type": "article",
        "description": "Un article détaillé sur les caractéristiques, les ordres et les innovations de l'architecture grecque, avec des exemples célèbres.",
        "author": "Encyclopædia Universalis",
        "url": "https://www.universalis.fr/encyclopedie/architecture-grecque/"
      },
      {
        "title": "La Démocratie athénienne",
        "type": "website",
        "description": "Un site éducatif expliquant le fonctionnement de la démocratie à Athènes, ses principes, ses institutions et ses limites.",
        "url": "https://www.lhistoire.fr/la-d%C3%A9mocratie-ath%C3%A9nienne"
      }
    ]
  },
  "glossary": [
    {
      "term": "Acropole",
      "definition": "Partie haute et fortifiée d'une cité grecque antique, souvent dédiée aux divinités principales et abritant les temples les plus importants, comme l'Acropole d'Athènes."
    },
    {
      "term": "Tragédie",
      "definition": "Genre théâtral grec antique caractérisé par un dénouement malheureux, mettant en scène des héros confrontés à des forces supérieures (destin, dieux) et explorant des thèmes comme la fatalité, la justice et la souffrance humaine."
    },
    {
      "term": "Ordre architectural",
      "definition": "Système de proportions et de décoration des éléments porteurs (colonnes, entablement) dans l'architecture grecque antique. Les trois ordres principaux sont le dorique (le plus ancien et austère), l'ionique (plus élancé et orné de volutes) et le corinthien (le plus tardif et le plus richement décoré de feuilles d'acanthe)."
    },
    {
      "term": "Démocratie",
      "definition": "Système politique inventé à Athènes, où le pouvoir est exercé par le peuple (les citoyens) directement ou par l'intermédiaire de représentants élus, se distinguant par l'égalité devant la loi et la liberté d'expression."
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