You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Plongée au cœur de la Grèce antique",
      "description": "Présenter le contexte géographique et temporel de la Grèce antique. Introduire les thèmes principaux de la leçon : l'importance de la religion et de la mythologie dans la vie quotidienne des Grecs, et comment ces éléments façonnaient leur société et leur mentalité."
    },
    {
      "heading": "## Les Mythes et le Panthéon Grec : Un Monde de Dieux et de Héros",
      "description": "Expliquer ce qu'est la mythologie grecque et son rôle fondamental. Présenter les principaux dieux et déesses de l'Olympe (Zeus, Héra, Poséidon, Athéna, etc.) et leurs attributs. Aborder quelques mythes célèbres pour illustrer les valeurs, les croyances et la vision du monde des Grecs."
    },
    {
      "heading": "## Culte et Rituels : Honorer les Dieux au Quotidien",
      "description": "Décrire les différentes formes de culte et de pratiques religieuses (prières, offrandes, sacrifices). Expliquer le rôle des oracles (ex: Delphes) et des sanctuaires. Aborder les grandes fêtes religieuses et les jeux panhelléniques (ex: Jeux Olympiques) comme expressions de la piété et de l'unité grecque."
    },
    {
      "heading": "## La Vie Quotidienne des Grecs : Famille, Éducation et Loisirs",
      "description": "Décrire l'organisation de la famille grecque (rôle des hommes, des femmes, des enfants). Expliquer le système éducatif et les lieux d'apprentissage. Aborder les aspects des loisirs (théâtre, banquets, sports) et l'importance de la cité dans la vie des citoyens, montrant comment la religion et les mythes imprégnaient ces aspects."
    },
    {
      "heading": "## Conclusion : L'Héritage de la Grèce Antique",
      "description": "Récapituler l'importance de la religion et de la mythologie dans la structuration de la société grecque antique et leur influence sur la vie quotidienne. Souligner l'héritage durable de ces aspects sur la culture occidentale (art, littérature, philosophie, sport) et ouvrir sur des questions de réflexion ou des liens avec le monde contemporain."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Middle School (secondary_1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Exploration de la mythologie grecque, du panthéon, des pratiques religieuses et de l'organisation de la vie quotidienne (famille, éducation, loisirs) pour comprendre la mentalité de l'époque.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.