You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Processus Stochastiques et à la Finance Quantitative",
      "description": "Cette section introduira le contexte du cours de Finance Quantitative et modélisation stochastique. Elle présentera l'importance des processus stochastiques en finance, les objectifs de la leçon sur les processus discrets et les martingales, et un aperçu de la structure du cours."
    },
    {
      "heading": "## Fondements des Processus Stochastiques Discrets",
      "description": "Cette section définira les processus stochastiques en temps discret, la notion de filtration, d'adaptabilité et de prévisibilité. Elle couvrira également les concepts fondamentaux d'espérance conditionnelle et ses propriétés, qui sont des prérequis essentiels pour la compréhension des martingales."
    },
    {
      "heading": "## Martingales Discrètes : Définition et Propriétés Fondamentales",
      "description": "Cette section se concentrera sur la définition formelle des martingales, sous-martingales et sur-martingales en temps discret. Elle explorera leurs propriétés clés, telles que l'inégalité de Doob et le théorème d'arrêt optionnel, en fournissant des exemples concrets pour illustrer ces concepts."
    },
    {
      "heading": "## Application aux Marchés Financiers : Le Modèle Binomial de Cox-Ross-Rubinstein",
      "description": "Cette section appliquera les concepts de martingales à la modélisation des marchés financiers. Elle détaillera la construction du modèle binomial de Cox-Ross-Rubinstein (CRR), expliquera l'absence d'opportunité d'arbitrage et introduira la mesure de probabilité risque-neutre. L'utilisation des martingales pour l'évaluation des options dans ce cadre sera un point central."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Cette section récapitulera les concepts clés abordés dans la leçon, notamment les processus stochastiques discrets, les martingales et leur application au modèle CRR. Elle soulignera l'importance de ces outils en finance quantitative et ouvrira sur des perspectives d'extension vers des modèles plus complexes ou en temps continu."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Construction et propriétés des martingales discrètes, application au modèle binomial de Cox-Ross-Rubinstein".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.