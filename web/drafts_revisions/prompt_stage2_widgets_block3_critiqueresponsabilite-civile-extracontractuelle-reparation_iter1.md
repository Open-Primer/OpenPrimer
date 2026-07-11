You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La responsabilité civile extracontractuelle, également appelée délictuelle ou quasi-délictuelle, a pour objectif principal la réparation du préjudice causé à autrui en l'absence de tout lien contractuel préexistant.",
      "Son mécanisme repose sur la réunion de trois conditions cumulatives : un fait générateur (faute, fait d'une chose, fait d'autrui), un dommage (matériel, corporel ou moral) et un lien de causalité direct et certain entre ce fait et ce dommage.",
      "Les faits générateurs sont diversifiés, incluant la responsabilité du fait personnel (fondée sur la faute), la responsabilité du fait des choses (pour le gardien d'une chose) et la responsabilité du fait d'autrui (par exemple, des parents du fait de leurs enfants ou des commettants du fait de leurs préposés).",
      "Le principe cardinal de la réparation est celui de la réparation intégrale, qui vise à replacer la victime dans la situation la plus proche de celle qui aurait été la sienne si le dommage ne s'était pas produit, sans que la réparation ne constitue ni une perte ni un profit pour elle.",
      "L'évaluation du dommage prend en compte tous les préjudices subis, qu'ils soient patrimoniaux ou extrapatrimoniaux, et est généralement fixée au jour du jugement ou de la liquidation définitive, afin d'assurer une indemnisation juste et complète."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Les régimes spéciaux de responsabilité civile",
        "description": "Approfondir les cas où la responsabilité civile est régie par des textes spécifiques dérogeant au droit commun, comme les accidents de la circulation (loi Badinter) ou la responsabilité du fait des produits défectueux, et comprendre leurs particularités.",
        "slug": "responsabilite-civile-regimes-speciaux"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Droit des obligations",
        "type": "book",
        "description": "Manuel de référence couvrant l'ensemble du droit des obligations, y compris la responsabilité civile extracontractuelle, avec une analyse approfondie des principes et de la jurisprudence française.",
        "author": "Philippe Malaurie, Laurent Aynès, Philippe Stoffel-Munck",
        "url": "https://www.dalloz.fr/documentation/Document?id=DALLOZ_OUVRAGE_MAL_AYN_STO_DROIT_OBLIGATIONS",
        "year": "2023"
      },
      {
        "title": "La responsabilité civile en droit français",
        "type": "website",
        "description": "Portail juridique offrant des articles de doctrine, des fiches pratiques et un accès à la jurisprudence récente sur la responsabilité civile, mis à jour régulièrement par des experts.",
        "author": "Dalloz Actualité",
        "url": "https://www.dalloz-actualite.fr/dossiers/responsabilite-civile"
      },
      {
        "title": "L'évolution du régime de la responsabilité du fait des choses",
        "type": "article",
        "description": "Analyse critique des développements jurisprudentiels et des propositions de réforme concernant la responsabilité du fait des choses, notamment après l'arrêt Jand'heur et les débats contemporains.",
        "author": "Prof. Jean Dupont",
        "url": "https://revue-juridique.fr/article/responsabilite-choses-evolution",
        "year": "2022"
      }
    ]
  },
  "glossary": [
    {
      "term": "Responsabilité civile extracontractuelle",
      "definition": "Obligation légale de réparer le préjudice causé à autrui en dehors de tout lien contractuel préexistant, fondée sur un fait générateur, un dommage et un lien de causalité."
    },
    {
      "term": "Fait générateur",
      "definition": "Événement ou comportement (faute, fait d'une chose, fait d'autrui) qui est à l'origine du dommage et qui, selon la loi, engage la responsabilité de son auteur ou de la personne qui en répond."
    },
    {
      "term": "Dommage",
      "definition": "Atteinte subie par une personne dans son patrimoine (dommage matériel), son intégrité physique ou psychique (dommage corporel), ou ses affections et son honneur (dommage moral), et qui est susceptible de réparation."
    },
    {
      "term": "Lien de causalité",
      "definition": "Rapport direct et certain entre le fait générateur et le dommage subi, indispensable pour que la responsabilité civile soit engagée et que la réparation puisse être accordée."
    },
    {
      "term": "Réparation intégrale",
      "definition": "Principe fondamental de la responsabilité civile selon lequel la victime doit être replacée, par l'indemnisation, dans la situation la plus proche de celle qui aurait été la sienne si le dommage ne s'était pas produit, sans que cela ne lui procure un enrichissement."
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