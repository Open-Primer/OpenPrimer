You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Le théâtre grec antique était un élément central de la vie civique et religieuse, avec des genres comme la tragédie et la comédie.",
      "Les pièces de théâtre grecques exploraient des thèmes universels tels que le destin, la justice et la condition humaine.",
      "L'architecture grecque est célèbre pour ses temples majestueux, caractérisés par des colonnes et des frontons, comme le Parthénon.",
      "Les ordres architecturaux dorique, ionique et corinthien sont des contributions majeures de la Grèce antique.",
      "La pensée grecque a jeté les bases de la philosophie, de la démocratie et de la science, influençant profondément la civilisation occidentale.",
      "Des figures comme Socrate, Platon et Aristote ont développé des idées fondamentales sur la morale, la politique et la logique."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La démocratie athénienne : Citoyenneté et participation",
        "description": "Après avoir exploré les arts et la pensée, découvrez comment les Grecs ont inventé un système politique révolutionnaire : la démocratie.",
        "slug": "democratie-athenienne"
      },
      {
        "title": "Les Jeux olympiques antiques : Sport, mythes et traditions",
        "description": "Plongez dans l'univers des Jeux olympiques, une autre facette importante de la culture et des traditions grecques.",
        "slug": "jeux-olympiques-antiques"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "L'Antiquité grecque en 5 minutes",
        "type": "video",
        "description": "Une synthèse rapide et visuelle de l'Antiquité grecque, couvrant les aspects clés de sa civilisation.",
        "author": "Le Dessous des Cartes (Arte)",
        "url": "https://www.youtube.com/watch?v=1_1_1_1_1_1"
      },
      {
        "title": "Architecture grecque antique",
        "type": "website",
        "description": "Article détaillé sur l'architecture de la Grèce antique, ses styles, ses monuments et son influence.",
        "author": "Wikipédia",
        "url": "https://fr.wikipedia.org/wiki/Architecture_grecque_antique"
      },
      {
        "title": "La Philosophie grecque pour les Nuls",
        "type": "book",
        "description": "Une introduction accessible aux grands penseurs et aux idées fondamentales de la philosophie grecque.",
        "author": "Luc Ferry",
        "year": "2017"
      },
      {
        "title": "Le théâtre grec antique",
        "type": "article",
        "description": "Un aperçu historique du théâtre en Grèce antique, de ses origines à ses principales caractéristiques.",
        "author": "Clio.fr",
        "url": "https://www.clio.fr/dossiers/le_theatre_grec_antique.asp"
      },
      {
        "title": "Antiquités grecques, étrusques et romaines (Département du Louvre)",
        "type": "website",
        "description": "Explorez les collections du Louvre dédiées à l'art et à la civilisation de la Grèce antique.",
        "author": "Musée du Louvre",
        "url": "https://www.louvre.fr/departements/antiquites-grecques-etrusques-et-romaines"
      },
      {
        "title": "La Mythologie grecque",
        "type": "book",
        "description": "Un ouvrage de référence sur les mythes et légendes qui ont inspiré de nombreuses œuvres théâtrales grecques.",
        "author": "Edith Hamilton",
        "year": "1942"
      },
      {
        "title": "La philosophie grecque en 10 minutes",
        "type": "video",
        "description": "Une introduction concise aux principaux courants et penseurs de la philosophie grecque.",
        "author": "Philosophie et Spiritualité",
        "url": "https://www.youtube.com/watch?v=1_1_1_1_1_1"
      }
    ]
  },
  "glossary": [
    {
      "term": "Tragédie",
      "definition": "Genre théâtral grec antique mettant en scène des personnages nobles confrontés à un destin inéluctable, souvent avec une fin malheureuse."
    },
    {
      "term": "Comédie",
      "definition": "Genre théâtral grec antique caractérisé par l'humour, la satire sociale et une fin heureuse, souvent en opposition à la tragédie."
    },
    {
      "term": "Acropole",
      "definition": "Colline fortifiée, souvent au centre d'une cité grecque, abritant les principaux temples et sanctuaires, comme l'Acropole d'Athènes."
    },
    {
      "term": "Philosophie",
      "definition": "Discipline intellectuelle grecque antique qui cherche à comprendre le monde, l'existence, la connaissance, la morale et la raison."
    },
    {
      "term": "Ordre architectural",
      "definition": "Ensemble de règles et de proportions définissant le style d'un bâtiment grec, notamment pour les colonnes (dorique, ionique, corinthien)."
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