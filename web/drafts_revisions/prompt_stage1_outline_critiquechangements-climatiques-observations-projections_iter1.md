You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Changements Climatiques",
      "description": "Présenter le contexte général du changement climatique, sa définition, son importance en géographie physique et climatologie, et un aperçu des thèmes abordés dans la leçon."
    },
    {
      "heading": "## Observations et Preuves Scientifiques du Changement Climatique",
      "description": "Détailler les indicateurs clés du changement climatique (températures, niveau marin, événements extrêmes, etc.) et présenter les preuves scientifiques de son origine anthropique, en s'appuyant sur les rapports du GIEC."
    },
    {
      "heading": "## Modélisation Climatique, Scénarios et Projections",
      "description": "Expliquer les principes des modèles climatiques, les différents scénarios d'émissions (RCP/SSP), et les projections futures des changements climatiques, en abordant les incertitudes associées à ces modèles."
    },
    {
      "heading": "## Impacts des Changements Climatiques sur les Systèmes Naturels et Humains",
      "description": "Analyser les conséquences des changements climatiques sur les écosystèmes, la biodiversité, les ressources en eau, l'agriculture, la santé humaine, les migrations et les sociétés, avec des exemples géographiques pertinents."
    },
    {
      "heading": "## Stratégies d'Adaptation et d'Atténuation",
      "description": "Présenter les différentes approches pour faire face au changement climatique : les stratégies d'atténuation (réduction des émissions de GES) et les stratégies d'adaptation (ajustement aux impacts inévitables), en discutant de leurs enjeux et de leur mise en œuvre."
    },
    {
      "heading": "## Conclusion Générale et Perspectives d'Avenir",
      "description": "Synthétiser les points clés de la leçon, intégrer les concepts fondamentaux de la géographie physique et climatologie, et discuter des défis futurs et des perspectives de recherche et d'action face au changement climatique."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Synthèse des preuves du changement climatique anthropique, présentation des modèles climatiques et de leurs incertitudes. Discussion des impacts sur les systèmes naturels et humains, et des stratégies d'adaptation et d'atténuation. Intégration des concepts clés du cours et perspectives futures de la discipline.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.