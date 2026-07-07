You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Cadre épistémologique et historique",
      "description": "Présenter l'objectif du cours : retracer la genèse et l'évolution des sciences de la Terre et du climat. Définir les concepts clés de géographie physique et de climatologie. Expliquer l'approche épistémologique et historique adoptée pour analyser les fondements de ces disciplines."
    },
    {
      "heading": "## Des Premières Observations aux Savoirs Antiques et Médiévaux",
      "description": "Explorer les premières tentatives d'explication des phénomènes terrestres et climatiques dans les civilisations antiques (Grèce, Rome, Chine, monde arabe). Mettre en lumière les contributions des penseurs majeurs et les limites des connaissances de l'époque, ainsi que la transmission et l'évolution de ces savoirs durant le Moyen Âge."
    },
    {
      "heading": "## La Révolution Scientifique et l'Émergence de la Géographie Physique et de la Climatologie",
      "description": "Analyser la période de la Renaissance et des Lumières, marquée par l'observation systématique, l'expérimentation et la théorisation. Identifier les figures emblématiques (ex: Buffon, Humboldt, Lyell) et les concepts fondateurs qui ont structuré la géographie physique (géomorphologie, hydrologie) et la climatologie (classification des climats, circulation atmosphérique)."
    },
    {
      "heading": "## Le XXe Siècle : Spécialisation, Intégration et Défis Contemporains",
      "description": "Aborder l'évolution des sciences de la Terre et du climat au XXe siècle, caractérisée par une forte spécialisation (tectonique des plaques, océanographie, glaciologie) et une intégration croissante (modélisation climatique, systèmes Terre). Discuter des enjeux actuels, notamment le changement climatique et le rôle des sciences dans la compréhension et la gestion des risques."
    },
    {
      "heading": "## Conclusion : Bilan et Perspectives d'Avenir",
      "description": "Synthétiser les grandes étapes de l'évolution des sciences de la Terre et du climat. Réfléchir à l'importance de l'approche historique et épistémologique pour comprendre les défis actuels. Ouvrir sur les perspectives futures de ces disciplines face aux enjeux environnementaux et sociétaux."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Analyse épistémologique des fondements de la géographie physique et de la climatologie, contextualisation historique des concepts clés et des figures emblématiques.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.