You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette leçon a exploré les origines de notre compréhension du cosmos, depuis les mythes fondateurs des civilisations anciennes jusqu'aux premières observations astronomiques.",
      "Nous avons vu comment les premières cosmologies étaient intrinsèquement liées aux croyances religieuses et philosophiques, cherchant à donner un sens à l'existence humaine et à l'ordre du monde.",
      "L'émergence de l'astronomie observationnelle, notamment avec les Babyloniens, les Égyptiens et les Grecs, a marqué un tournant vers une approche plus systématique et mathématique du ciel.",
      "Des figures comme Aristote et Ptolémée ont développé des modèles géocentriques sophistiqués qui ont dominé la pensée occidentale pendant plus d'un millénaire.",
      "Ces premières tentatives de cartographier et d'expliquer l'univers, bien que souvent erronées selon nos connaissances actuelles, ont jeté les bases de la science cosmologique moderne."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La Révolution Copernicienne et l'avènement de la science moderne",
        "description": "Dans la prochaine leçon, nous plongerons dans la période charnière de la Renaissance, où des penseurs audacieux comme Copernic, Galilée et Kepler ont remis en question les dogmes établis, ouvrant la voie à une nouvelle ère de la cosmologie héliocentrique et à l'application rigoureuse de la méthode scientifique.",
        "slug": "revolution-copernicienne"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Cosmos",
        "type": "book",
        "description": "Un voyage fascinant à travers l'histoire de la science et de l'univers, de l'Antiquité à l'ère spatiale.",
        "author": "Carl Sagan",
        "url": "https://www.amazon.fr/Cosmos-Carl-Sagan/dp/2253043819",
        "year": "1980"
      },
      {
        "title": "L'Univers dans une coquille de noix",
        "type": "book",
        "description": "Stephen Hawking explore les théories modernes de la physique et de la cosmologie, rendant accessibles des concepts complexes.",
        "author": "Stephen Hawking",
        "url": "https://www.amazon.fr/Lunivers-dans-coquille-noix-Hawking/dp/208120731X",
        "year": "2001"
      },
      {
        "title": "Histoire de l'astronomie",
        "type": "website",
        "description": "Un site complet offrant un aperçu détaillé de l'évolution de l'astronomie à travers les âges.",
        "url": "https://www.astronomes.com/histoire-astronomie/",
        "year": "N/A"
      }
    ]
  },
  "glossary": [
    {
      "term": "Cosmologie",
      "definition": "Branche de l'astronomie et de la physique qui étudie l'origine, l'évolution, la structure à grande échelle et le destin final de l'Univers."
    },
    {
      "term": "Géocentrisme",
      "definition": "Modèle cosmologique selon lequel la Terre est le centre de l'Univers et tous les autres corps célestes (Soleil, Lune, planètes, étoiles) tournent autour d'elle. Ce modèle a été dominant pendant l'Antiquité et le Moyen Âge."
    },
    {
      "term": "Héliocentrisme",
      "definition": "Modèle cosmologique selon lequel le Soleil est le centre du système solaire et les planètes, y compris la Terre, tournent autour de lui. Ce modèle a été proposé par Aristarque de Samos et popularisé par Nicolas Copernic."
    },
    {
      "term": "Éphémérides",
      "definition": "Tables astronomiques qui donnent les positions des corps célestes (planètes, étoiles, etc.) à des instants précis. Elles étaient cruciales pour la navigation et l'astrologie dans l'Antiquité."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used.

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