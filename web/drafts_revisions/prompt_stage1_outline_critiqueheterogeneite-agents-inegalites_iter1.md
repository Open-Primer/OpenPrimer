You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Hétérogénéité et inégalités en macroéconomie",
      "description": "Présenter l'importance croissante de l'hétérogénéité des agents et des inégalités dans l'analyse macroéconomique moderne. Expliquer pourquoi les modèles d'agents représentatifs sont insuffisants pour comprendre certains phénomènes et introduire les objectifs du cours."
    },
    {
      "heading": "## Fondements théoriques et mesure des inégalités",
      "description": "Définir les concepts clés d'hétérogénéité (revenu, richesse, préférences) et d'inégalités. Présenter les principaux outils de mesure des inégalités (coefficient de Gini, ratios de quantiles, courbes de Lorenz) et les modèles macroéconomiques intégrant l'hétérogénéité (ex: modèles Bewley-Aiyagari, OLG)."
    },
    {
      "heading": "## Impact de l'hétérogénéité sur la consommation et l'épargne agrégées",
      "description": "Analyser comment la distribution des revenus et de la richesse affecte les fonctions de consommation et d'épargne agrégées. Discuter des effets de redistribution et des propensions marginales à consommer hétérogènes, et de leurs implications pour la demande agrégée et la croissance."
    },
    {
      "heading": "## Implications pour la politique monétaire et budgétaire",
      "description": "Examiner comment l'hétérogénéité des agents modifie l'efficacité et les canaux de transmission de la politique monétaire (ex: canal du bilan, canal du revenu) et de la politique budgétaire (ex: multiplicateurs budgétaires différenciés). Discuter des politiques visant à réduire les inégalités."
    },
    {
      "heading": "## Conclusion : Enjeux et perspectives",
      "description": "Récapituler les principaux enseignements concernant l'importance de l'hétérogénéité et des inégalités en macroéconomie. Souligner les défis pour les décideurs politiques et ouvrir sur les pistes de recherche futures dans ce domaine."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Impact des inégalités sur la consommation et l'épargne, implications pour la politique monétaire et budgétaire.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.