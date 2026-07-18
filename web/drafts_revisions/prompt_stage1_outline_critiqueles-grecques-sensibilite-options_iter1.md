You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Grecques et à la Sensibilité des Options",
      "description": "Présenter le concept des options financières et leur rôle sur les marchés. Expliquer pourquoi la compréhension de leur sensibilité aux différents facteurs de marché (les Grecques) est cruciale pour l'évaluation, la gestion des risques et la couverture. Introduire brièvement les principales Grecques qui seront abordées."
    },
    {
      "heading": "## Delta et Gamma: Mesures de la Sensibilité au Prix de l'Actif Sous-Jacent",
      "description": "Définir le Delta comme la sensibilité du prix de l'option au prix de l'actif sous-jacent. Expliquer son interprétation (probabilité d'expiration in-the-money pour les options binaires, équivalent actions pour les options vanilles) et son utilisation dans la couverture. Définir le Gamma comme la sensibilité du Delta au prix de l'actif sous-jacent, en soulignant son rôle dans la convexité et la gestion du risque de Delta."
    },
    {
      "heading": "## Vega, Theta et Rho: Sensibilités aux Autres Facteurs de Marché",
      "description": "Définir Vega comme la sensibilité du prix de l'option à la volatilité implicite. Expliquer Theta comme la sensibilité au passage du temps (décroissance temporelle ou 'time decay'). Définir Rho comme la sensibilité aux taux d'intérêt sans risque. Pour chaque Grecque, fournir son interprétation, son impact sur la valeur de l'option et les facteurs qui l'influencent."
    },
    {
      "heading": "## Stratégies de Couverture et Gestion du Risque avec les Grecques",
      "description": "Expliquer comment les différentes Grecques sont utilisées pour construire et gérer des stratégies de couverture (ex: couverture en Delta, couverture en Gamma, couverture multi-Grecques). Discuter des concepts de portefeuille Delta-neutre, Gamma-neutre, Vega-neutre. Aborder les défis et les limites de ces stratégies dans un environnement de marché réel (coûts de transaction, volatilité, sauts de prix)."
    },
    {
      "heading": "## Conclusion: Importance des Grecques en Finance Quantitative",
      "description": "Récapituler l'importance fondamentale des Grecques pour les professionnels de la finance quantitative, les traders et les gestionnaires de risques. Souligner leur rôle indispensable dans l'évaluation des options, la gestion des risques, la mise en œuvre de stratégies de trading sophistiquées et la compréhension de la dynamique des marchés dérivés."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Définition et interprétation des Delta, Gamma, Vega, Theta, Rho; stratégies de couverture".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.