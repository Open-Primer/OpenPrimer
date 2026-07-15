You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La responsabilité civile extracontractuelle, régie principalement par les articles 1240 et suivants du Code civil, constitue un pilier fondamental du droit des obligations, visant à réparer les dommages causés en dehors de tout lien contractuel.",
      "Son engagement repose sur la réunion de trois conditions cumulatives et essentielles : un fait générateur (faute, fait d'autrui ou fait des choses), un dommage certain et légitime, et un lien de causalité direct entre ce fait et ce dommage.",
      "Le fait générateur peut prendre diverses formes, allant de la faute personnelle prouvée à la responsabilité objective du fait des choses ou d'autrui, illustrant la complexité et la diversité des situations juridiques.",
      "Le dommage, qu'il soit corporel, matériel ou moral, doit être évalué selon le principe de la réparation intégrale, qui vise à replacer la victime dans la situation la plus proche de celle qui aurait été la sienne sans la survenance du préjudice.",
      "La compréhension de ces mécanismes est cruciale pour appréhender les droits des victimes et les obligations des responsables, soulignant l'importance de la preuve et de l'appréciation souveraine des juges dans la mise en œuvre de ce régime."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Explorer la Responsabilité Contractuelle",
        "description": "Après avoir maîtrisé les principes de la responsabilité civile extracontractuelle, la prochaine étape consistera à étudier la responsabilité contractuelle. Nous analyserons les conditions de son engagement, les causes d'exonération et les spécificités de la réparation des dommages résultant de l'inexécution ou de la mauvaise exécution d'un contrat.",
        "slug": "droit-obligations-responsabilite-contractuelle"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Droit civil : Les obligations",
        "type": "book",
        "description": "Ouvrage de référence incontournable pour l'étude approfondie du droit des obligations, incluant une section détaillée sur la responsabilité civile.",
        "author": "François Terré, Philippe Simler, Yves Lequette",
        "url": "https://www.dalloz.fr/documentation/Ouvrage/Droit_civil_Les_obligations-2023.html",
        "year": "2023"
      },
      {
        "title": "Légifrance : Code civil",
        "type": "website",
        "description": "Accès direct et constamment mis à jour aux articles du Code civil français, notamment ceux relatifs à la responsabilité civile (articles 1240 et suivants).",
        "url": "https://www.legifrance.gouv.fr/codes/id/LEGITEXT000006070721/"
      },
      {
        "title": "La responsabilité civile : Fondements et évolutions",
        "type": "article",
        "description": "Analyse des principes fondamentaux et des évolutions jurisprudentielles et doctrinales de la responsabilité civile en droit français.",
        "author": "Geneviève Viney",
        "url": "https://www.cairn.info/revue-droit-et-societe-2006-1-page-13.htm",
        "year": "2006"
      }
    ]
  },
  "glossary": [
    {
      "term": "Responsabilité civile extracontractuelle",
      "definition": "Obligation légale de réparer le dommage causé à autrui en dehors de tout lien contractuel préexistant, fondée sur le principe général de ne pas nuire à autrui."
    },
    {
      "term": "Faute",
      "definition": "Comportement illicite, imprudent ou négligent, volontaire ou non, qui constitue le fait générateur principal de la responsabilité civile extracontractuelle."
    },
    {
      "term": "Dommage",
      "definition": "Atteinte subie par une personne dans son patrimoine (matériel), son intégrité physique (corporel) ou ses affections (moral), qui doit être certaine, directe et légitime pour être réparable."
    },
    {
      "term": "Lien de causalité",
      "definition": "Relation directe et nécessaire entre le fait générateur (faute ou fait objectif) et le dommage subi, sans laquelle la responsabilité ne peut être engagée."
    },
    {
      "term": "Réparation intégrale",
      "definition": "Principe fondamental de la responsabilité civile selon lequel la victime doit être replacée, autant que possible, dans la situation où elle se serait trouvée si le dommage ne s'était pas produit, sans enrichissement ni appauvrissement."
    },
    {
      "term": "Préjudice corporel",
      "definition": "Atteinte à l'intégrité physique ou psychique d'une personne, incluant les blessures, l'incapacité, les souffrances endurées et le préjudice esthétique."
    },
    {
      "term": "Préjudice matériel",
      "definition": "Atteinte aux biens ou au patrimoine de la victime, se traduisant par une perte subie (damnum emergens) ou un gain manqué (lucrum cessans)."
    },
    {
      "term": "Préjudice moral",
      "definition": "Atteinte aux sentiments, à l'honneur, à la réputation, à la tranquillité ou à l'affection d'une personne, souvent difficile à évaluer financièrement."
    },
    {
      "term": "Fait générateur",
      "definition": "Événement ou comportement qui est à l'origine du dommage et qui, selon la loi, peut engager la responsabilité de son auteur (faute, fait d'autrui, fait des choses)."
    },
    {
      "term": "Force majeure",
      "definition": "Événement extérieur, imprévisible et irrésistible qui, en rompant le lien de causalité, exonère totalement ou partiellement le responsable de sa responsabilité."
    },
    {
      "term": "Cas fortuit",
      "definition": "Événement imprévisible et irrésistible, mais interne à l'activité du responsable, dont les effets sont souvent assimilés à ceux de la force majeure en matière de responsabilité."
    },
    {
      "term": "Victime",
      "definition": "Personne physique ou morale ayant subi un dommage direct et certain du fait d'autrui ou d'une chose, et qui est en droit de demander réparation."
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