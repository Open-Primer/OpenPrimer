You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: Contexte et Enjeux de l'Organisation",
      "description": "Présenter le cours, situer l'importance de comprendre les dynamiques organisationnelles. Introduire brièvement les deux concepts centraux – l'approche contingente et la rationalité limitée – comme des cadres d'analyse fondamentaux pour la sociologie des organisations et le management stratégique. Expliquer pourquoi ces deux perspectives, bien que distinctes, sont complémentaires pour appréhender la complexité des organisations modernes."
    },
    {
      "heading": "## L'Approche Contingente: Structure et Environnement",
      "description": "Expliquer les origines de l'approche contingente en réaction aux théories classiques et bureaucratiques. Détailler ses principes fondamentaux : l'absence de 'one best way' et l'idée que la structure organisationnelle est fonction de facteurs environnementaux et internes (taille, technologie, stratégie). Présenter les travaux majeurs (Lawrence & Lorsch, Burns & Stalker, Woodward) et leurs contributions à la compréhension de l'adéquation structure-environnement."
    },
    {
      "heading": "## La Rationalité Limitée: Les Limites Cognitives des Décideurs",
      "description": "Introduire le concept de rationalité limitée développé par Herbert Simon. Expliquer comment les capacités cognitives des individus, le temps disponible et l'accès à l'information limitent la rationalité parfaite dans la prise de décision organisationnelle. Décrire les mécanismes de 'satisficing' (satisfaction) et les heuristiques. Illustrer avec des exemples concrets les biais cognitifs et les contraintes qui influencent les choix stratégiques et opérationnels au sein des organisations."
    },
    {
      "heading": "## Articulation, Complémentarité et Critiques des Deux Approches",
      "description": "Analyser comment l'approche contingente et la rationalité limitée peuvent s'articuler pour offrir une vision plus nuancée des organisations. Discuter des points de convergence (ex: l'environnement complexe limite la rationalité et impose des structures adaptées) et des divergences. Présenter les principales critiques adressées à chacune des approches (déterminisme pour la contingence, sous-estimation de l'action stratégique pour la rationalité limitée) et leurs évolutions."
    },
    {
      "heading": "## Conclusion: Perspectives pour le Management Stratégique",
      "description": "Récapituler les apports majeurs de l'approche contingente et de la rationalité limitée pour l'analyse des organisations et la pratique managériale. Souligner leur pertinence continue dans un monde complexe et incertain. Ouvrir sur les défis actuels et futurs pour les organisations, notamment en termes d'agilité, d'innovation et de gestion de la complexité, en lien avec les concepts étudiés."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Exploration de l'idée que la structure organisationnelle dépend de son environnement et que la rationalité des acteurs est bornée.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.