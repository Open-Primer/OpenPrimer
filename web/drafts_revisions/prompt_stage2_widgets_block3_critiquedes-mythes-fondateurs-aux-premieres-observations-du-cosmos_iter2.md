You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette leçon a exploré les origines de notre compréhension du cosmos, depuis les mythes fondateurs qui cherchaient à donner un sens à l'univers jusqu'aux premières observations astronomiques. Nous avons vu comment différentes civilisations, telles que les Mésopotamiens, les Égyptiens et les Grecs, ont développé des systèmes complexes pour décrire le mouvement des corps célestes.",
      "L'évolution de la pensée, passant d'explications purement mythologiques à des tentatives d'explication rationnelle et mathématique, a marqué un tournant crucial dans l'histoire de la cosmologie.",
      "Ces premières étapes, bien que souvent erronées selon nos connaissances actuelles, ont jeté les bases de la science cosmologique moderne en introduisant l'observation systématique et la modélisation.",
      "Elles démontrent une quête humaine universelle de compréhension de notre place dans l'univers et la capacité à construire des cadres explicatifs complexes, même sans les outils technologiques avancés d'aujourd'hui.",
      "En somme, cette période est fondamentale pour apprécier le chemin parcouru par la pensée scientifique et la persistance de l'humanité à déchiffrer les mystères du cosmos."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La Révolution Copernicienne et l'Héliocentrisme",
        "description": "Après avoir posé les bases avec les mythes et les premières observations, la prochaine leçon nous plongera dans l'ère de la révolution scientifique. Nous examinerons comment des figures emblématiques comme Copernic, Galilée et Kepler ont bouleversé les modèles géocentriques établis, ouvrant la voie à une nouvelle compréhension héliocentrique de notre système solaire et, par extension, de l'univers. Préparez-vous à découvrir comment l'observation précise et le raisonnement mathématique ont transformé notre vision du cosmos.",
        "slug": "revolution-copernicienne-heliocentrisme"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Histoire de l'astronomie",
        "type": "book",
        "description": "Un ouvrage de référence qui retrace l'évolution de l'astronomie depuis l'Antiquité jusqu'à l'époque moderne, abordant les grandes découvertes et les figures marquantes.",
        "author": "Jean-Pierre Verdet",
        "url": "https://www.puf.com/collections/que-sais-je/histoire-de-lastronomie",
        "year": "1990"
      },
      {
        "title": "Les civilisations antiques et l'astronomie",
        "type": "website",
        "description": "Un article ou une section de site web explorant les contributions des civilisations mésopotamiennes, égyptiennes et grecques à l'astronomie, avec des détails sur leurs observations et leurs systèmes cosmologiques.",
        "author": "Futura Sciences",
        "url": "https://www.futura-sciences.com/sciences/dossiers/astronomie-histoire-astronomie-100/c/221/page/2/",
        "year": "2023"
      }
    ]
  },
  "glossary": [
    {
      "term": "Cosmologie",
      "definition": "Branche de l'astronomie et de la physique qui étudie l'origine, l'évolution, la structure et le destin de l'Univers dans son ensemble, en s'appuyant sur des observations et des modèles théoriques."
    },
    {
      "term": "Mythe cosmogonique",
      "definition": "Récit traditionnel et souvent sacré qui explique l'origine du monde et de l'humanité, souvent par l'intervention de divinités ou de forces primordiales, et qui sert à donner un sens à l'existence."
    },
    {
      "term": "Géocentrisme",
      "definition": "Modèle cosmologique ancien, dominant pendant des siècles, selon lequel la Terre est le centre immobile de l'Univers, autour duquel tournent tous les autres corps célestes (Soleil, Lune, planètes et étoiles)."
    },
    {
      "term": "Héliocentrisme",
      "definition": "Modèle cosmologique, proposé notamment par Copernic, selon lequel le Soleil est le centre du système solaire, et les planètes, y compris la Terre, tournent autour de lui. Ce modèle a révolutionné la compréhension de l'Univers."
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