You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Le théâtre grec, avec ses genres comme la tragédie et la comédie, était une forme d'art essentielle qui reflétait et interrogeait la société et la religion.",
      "L'architecture grecque, caractérisée par ses ordres dorique, ionique et corinthien, a établi des canons de beauté et de proportion qui ont influencé l'art occidental pendant des millénaires.",
      "La philosophie grecque, incarnée par des penseurs tels que Socrate, Platon et Aristote, a jeté les bases de la pensée critique, de la logique et de l'éthique.",
      "Les Jeux Olympiques, bien plus qu'une simple compétition sportive, étaient une célébration religieuse et culturelle unifiant les cités grecques.",
      "L'héritage de la Grèce antique est omniprésent dans notre monde moderne, de la démocratie aux concepts artistiques et philosophiques.",
      "Les mythes et légendes grecs ont profondément marqué la littérature, l'art et la culture populaire à travers les âges."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La vie quotidienne en Grèce antique",
        "description": "Découvre comment les Grecs vivaient, mangeaient, s'habillaient et s'organisaient au quotidien dans leurs cités.",
        "slug": "grece-antique-vie-quotidienne"
      },
      {
        "title": "Les guerres médiques et le siècle de Périclès",
        "description": "Explore les grands conflits qui ont marqué la Grèce antique et l'âge d'or d'Athènes sous la direction de Périclès.",
        "slug": "grece-antique-guerres-mediques-pericles"
      },
      {
        "title": "L'influence grecque sur l'Empire romain",
        "description": "Comprend comment la culture, l'art et la pensée grecque ont profondément façonné la civilisation romaine et son développement.",
        "slug": "grece-antique-influence-romaine"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "La Grèce antique",
        "type": "book",
        "description": "Une introduction complète à la civilisation grecque antique, couvrant l'histoire, la société, la culture et les arts.",
        "author": "Pierre Lévêque"
      },
      {
        "title": "Grèce antique",
        "type": "website",
        "description": "Une encyclopédie en ligne offrant une vue d'ensemble détaillée de la Grèce antique, de son histoire à sa culture.",
        "url": "https://fr.wikipedia.org/wiki/Gr%C3%A8ce_antique"
      },
      {
        "title": "L'Antiquité grecque en 5 minutes",
        "type": "video",
        "description": "Une présentation rapide et pédagogique des aspects clés de la Grèce antique pour une première approche."
      },
      {
        "title": "L'architecture grecque antique",
        "type": "article",
        "description": "Un article détaillé sur les principes, les ordres et l'évolution de l'architecture en Grèce antique.",
        "author": "Encyclopædia Universalis",
        "url": "https://www.universalis.fr/encyclopedie/architecture-grecque/"
      },
      {
        "title": "Département des Antiquités grecques, étrusques et romaines",
        "type": "website",
        "description": "Explorez les collections du Musée du Louvre dédiées à l'art et à la civilisation grecque antique, avec des œuvres majeures.",
        "url": "https://www.louvre.fr/departements/antiquites-grecques-etrusques-et-romaines"
      },
      {
        "title": "Le Théâtre grec",
        "type": "book",
        "description": "Une analyse approfondie du théâtre grec, de ses origines rituelles à sa signification sociale et religieuse dans la cité.",
        "author": "Jean-Pierre Vernant",
        "year": "1968"
      },
      {
        "title": "La philosophie grecque expliquée",
        "type": "video",
        "description": "Une introduction aux grands penseurs et aux courants majeurs de la philosophie grecque antique, de Thalès à Aristote."
      }
    ]
  },
  "glossary": [
    {
      "term": "Démocratie",
      "definition": "Un système de gouvernement où le pouvoir est exercé par le peuple, directement ou par l'intermédiaire de représentants élus, tel qu'il a été inventé à Athènes."
    },
    {
      "term": "Acropole",
      "definition": "Une citadelle située sur une hauteur, servant de refuge et de centre religieux dans les cités grecques antiques, la plus célèbre étant celle d'Athènes."
    },
    {
      "term": "Tragédie",
      "definition": "Un genre théâtral grec antique mettant en scène des personnages nobles confrontés à un destin inéluctable, souvent avec une fin malheureuse et une dimension cathartique."
    },
    {
      "term": "Ordre architectural",
      "definition": "Un ensemble de règles et de proportions définissant le style d'une colonne et de son entablement dans l'architecture grecque, les principaux étant le dorique, l'ionien et le corinthien."
    },
    {
      "term": "Philosophie",
      "definition": "Discipline qui cherche à comprendre le monde, l'existence humaine et la connaissance par la réflexion rationnelle et critique, née en Grèce antique."
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