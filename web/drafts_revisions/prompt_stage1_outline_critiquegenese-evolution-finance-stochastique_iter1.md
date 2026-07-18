You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Finance Stochastique",
      "description": "Présenter la finance stochastique comme un domaine clé de la finance quantitative. Définir ses objectifs et son importance dans la modélisation des marchés financiers. Annoncer le plan du cours qui explorera son évolution historique et épistémologique, des prémices aux développements contemporains."
    },
    {
      "heading": "## Des Théories Classiques aux Premières Intuitions Stochastiques",
      "description": "Aborder les théories financières antérieures à l'approche stochastique (ex: théorie du portefeuille de Markowitz, CAPM). Mettre en lumière les limites de ces modèles face à la complexité et l'incertitude des marchés. Introduire les premières tentatives d'intégration de l'aléatoire, notamment les travaux précurseurs de Louis Bachelier et sa théorie de la spéculation."
    },
    {
      "heading": "## L'Émergence des Modèles Stochastiques Modernes",
      "description": "Détailler la contribution majeure du modèle de Black-Scholes-Merton pour la valorisation des options. Expliquer les hypothèses clés, la méthodologie et l'impact révolutionnaire de ce modèle sur la finance de marché. Discuter des concepts fondamentaux comme la réplication dynamique, l'absence d'opportunité d'arbitrage et les premières extensions ou critiques."
    },
    {
      "heading": "## Évolution et Diversification des Modèles Stochastiques",
      "description": "Explorer les développements post-Black-Scholes. Aborder les modèles de taux d'intérêt (Vasicek, CIR, HJM, Libor Market Model), les modèles de volatilité stochastique (Heston), les modèles à sauts (Merton, Kou) et leur application à la modélisation du risque de crédit (modèles structurels et intensité). Discuter de l'intégration de l'imperfection des marchés et des défis liés à la calibration."
    },
    {
      "heading": "## Conclusion: Enjeux Actuels et Perspectives Futures",
      "description": "Récapituler les grandes étapes de l'évolution de la finance stochastique et son rôle central. Discuter des défis contemporains (crises financières, big data, intelligence artificielle, finance comportementale) et des directions de recherche futures. Souligner l'importance continue de la modélisation stochastique pour la compréhension et la gestion des risques financiers."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Contexte historique et épistémologique des modèles financiers".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.