You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Une Grèce en ébullition",
      "description": "Présenter le contexte géographique et politique de la Grèce antique avant les grands conflits. Introduire les Guerres Médiques et la Guerre du Péloponnèse comme des événements majeurs ayant profondément transformé le monde grec, et annoncer les thèmes abordés dans la leçon."
    },
    {
      "heading": "## Les Guerres Médiques : La menace perse et l'unité grecque",
      "description": "Expliquer les causes des Guerres Médiques (expansion perse, révolte ionienne). Décrire les principales batailles (Marathon, Thermopyles, Salamine, Platées) et leurs héros. Analyser les conséquences immédiates : victoire grecque, affirmation d'Athènes et de Sparte, création de la Ligue de Délos."
    },
    {
      "heading": "## L'entre-deux-guerres : L'hégémonie athénienne et les tensions croissantes",
      "description": "Décrire l'apogée d'Athènes (siècle de Périclès, démocratie, puissance maritime) et la transformation de la Ligue de Délos en empire athénien. Expliquer la montée des tensions avec Sparte et la Ligue du Péloponnèse, les causes profondes de la Guerre du Péloponnèse (rivalités économiques, politiques, idéologiques)."
    },
    {
      "heading": "## La Guerre du Péloponnèse : Le déchirement du monde grec",
      "description": "Présenter les phases principales du conflit (guerre archidamique, paix de Nicias, expédition de Sicile, guerre de Décélie). Mettre en lumière les stratégies des belligérants (Athènes maritime, Sparte terrestre). Analyser les conséquences dévastatrices pour les cités grecques : affaiblissement général, pertes humaines, instabilité politique, fin de l'hégémonie athénienne."
    },
    {
      "heading": "## Bilan et héritage : Une Grèce transformée",
      "description": "Synthétiser les impacts à long terme des deux guerres sur la Grèce antique : déclin des cités-États, émergence de nouvelles puissances (Thèbes, Macédoine), changements sociaux et culturels. Souligner l'héritage de ces conflits dans l'histoire et la pensée politique occidentale (Thucydide)."
    },
    {
      "heading": "## Conclusion : Les leçons des conflits grecs",
      "description": "Récapituler les points clés de la leçon concernant les causes, le déroulement et les conséquences des Guerres Médiques et du Péloponnèse. Ouvrir la réflexion sur la fragilité de l'équilibre politique et l'impact durable des conflits sur les sociétés, en lien avec l'histoire ultérieure de la Grèce."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Middle School (secondary_1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Analyse des causes et conséquences des guerres médiques et du Péloponnèse, et leur impact sur l'évolution politique, sociale et culturelle des cités grecques.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.