You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Méthodes Numériques en Finance Quantitative",
      "description": "Cette section introduira la nécessité des méthodes numériques en finance quantitative, en particulier pour la valorisation d'options complexes et la résolution d'EDP. Elle présentera les objectifs du cours et un aperçu des méthodes qui seront abordées."
    },
    {
      "heading": "## Simulation de Monte Carlo pour la Valorisation d'Options",
      "description": "Cette section détaillera les principes de la simulation de Monte Carlo, son application à la valorisation d'options (européennes, américaines, exotiques), la génération de nombres aléatoires, la réduction de variance (variables de contrôle, échantillonnage d'importance) et les limites de la méthode."
    },
    {
      "heading": "## Méthodes aux Différences Finies pour les EDP en Finance",
      "description": "Cette section expliquera les fondements des méthodes aux différences finies (MDF) pour la résolution numérique d'équations aux dérivées partielles (EDP) rencontrées en finance (ex: Black-Scholes). Elle couvrira les schémas explicites, implicites et Crank-Nicolson, ainsi que les conditions aux limites."
    },
    {
      "heading": "## Applications Pratiques et Comparaison des Méthodes",
      "description": "Cette section explorera des cas d'étude concrets où les méthodes de Monte Carlo et les MDF sont appliquées. Elle comparera les avantages et inconvénients de chaque approche en termes de précision, vitesse de calcul, flexibilité et complexité d'implémentation pour différents types de problèmes financiers."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Cette section récapitulera les concepts clés abordés dans le cours, soulignera l'importance des méthodes numériques en finance moderne et ouvrira sur des perspectives futures, telles que les méthodes d'éléments finis, les réseaux de neurones ou l'optimisation numérique."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Simulation de Monte Carlo pour la valorisation d'options, méthodes aux différences finies pour les EDP".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.