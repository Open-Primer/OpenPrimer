You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "Cette leçon a exploré en profondeur la théorie générale du contrat, pilier fondamental du droit des obligations en France.",
      "Nous avons détaillé les conditions essentielles à sa validité, telles que le consentement libre et éclairé, la capacité des parties, un objet certain et licite, et une cause licite.",
      "L'étude a également couvert les différentes étapes de la formation du contrat, de l'offre à l'acceptation, ainsi que les vices du consentement qui peuvent en affecter la validité.",
      "Enfin, nous avons analysé les effets du contrat, notamment sa force obligatoire entre les parties et les principes régissant son exécution de bonne foi.",
      "La compréhension de ces mécanismes est cruciale pour appréhender la sécurité juridique des transactions et les recours en cas d'inexécution contractuelle."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Approfondir les sanctions de l'inexécution contractuelle",
        "description": "Explorer les mécanismes de sanction en cas de non-respect des obligations contractuelles, tels que l'exécution forcée, la réduction du prix, la résolution et les dommages et intérêts.",
        "slug": "sanctions-inexecution-contractuelle"
      },
      {
        "title": "Introduction à la responsabilité civile",
        "description": "Découvrir les fondements et les régimes de la responsabilité civile, qu'elle soit contractuelle ou délictuelle, et ses conditions d'engagement.",
        "slug": "introduction-responsabilite-civile"
      },
      {
        "title": "Les contrats spéciaux",
        "description": "Étudier les règles spécifiques applicables à certains types de contrats courants comme la vente, le bail ou le mandat, qui dérogent ou complètent la théorie générale.",
        "slug": "contrats-speciaux"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Droit civil : Les obligations",
        "type": "book",
        "description": "Manuel de référence couvrant l'ensemble du droit des obligations, incluant la théorie générale du contrat, les quasi-contrats et la responsabilité civile, régulièrement mis à jour.",
        "author": "François Terré, Philippe Simler, Yves Lequette",
        "url": "https://www.dalloz.fr/documentation/Ouvrage/Droit_civil_Les_obligations-9782247226000.html",
        "year": "2023"
      },
      {
        "title": "Légifrance",
        "type": "website",
        "description": "Site officiel du droit français, permettant de consulter le Code civil (notamment les articles 1101 et suivants sur le droit des contrats) et l'ensemble de la législation et de la jurisprudence.",
        "author": "Gouvernement français",
        "url": "https://www.legifrance.gouv.fr/"
      },
      {
        "title": "La réforme du droit des contrats : Ordonnance du 10 février 2016",
        "type": "article",
        "description": "Analyse des apports majeurs de l'ordonnance de 2016 portant réforme du droit des contrats, du régime général et de la preuve des obligations, qui a modernisé le Code civil.",
        "author": "Revue des Contrats (divers auteurs)",
        "url": "https://www.revuedescontrats.com/la-reforme-du-droit-des-contrats-ordonnance-du-10-fevrier-2016",
        "year": "2016"
      }
    ]
  },
  "glossary": [
    {
      "term": "Contrat",
      "definition": "Accord de volontés entre deux ou plusieurs personnes destiné à créer, modifier, transmettre ou éteindre des obligations juridiques."
    },
    {
      "term": "Consentement",
      "definition": "Manifestation de volonté des parties de s'engager, libre et éclairée, sans laquelle le contrat est vicié (par erreur, dol ou violence)."
    },
    {
      "term": "Force obligatoire",
      "definition": "Principe selon lequel les contrats légalement formés tiennent lieu de loi à ceux qui les ont faits, et ne peuvent être révoqués que de leur consentement mutuel ou pour les causes que la loi autorise (article 1103 du Code civil)."
    },
    {
      "term": "Résolution",
      "definition": "Sanction de l'inexécution contractuelle qui entraîne l'anéantissement rétroactif du contrat, remettant les parties dans l'état où elles se trouvaient avant sa conclusion."
    },
    {
      "term": "Exception d'inexécution",
      "definition": "Moyen de défense permettant à une partie de refuser d'exécuter sa propre obligation tant que l'autre partie n'a pas exécuté la sienne, si cette inexécution est suffisamment grave."
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