You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction au Modèle de Black-Scholes-Merton",
      "description": "Présenter le contexte historique et l'importance du modèle de Black-Scholes-Merton dans la finance quantitative. Expliquer pourquoi ce modèle a révolutionné la valorisation des options et introduire les objectifs d'apprentissage de la leçon."
    },
    {
      "heading": "## Les Hypothèses Fondamentales du Modèle",
      "description": "Détailler les hypothèses clés sous-jacentes au modèle de Black-Scholes-Merton, telles que l'absence d'opportunités d'arbitrage, la dynamique du prix de l'actif sous-jacent (mouvement brownien géométrique), les taux d'intérêt constants, l'absence de dividendes, etc. Expliquer l'impact de chaque hypothèse sur la modélisation."
    },
    {
      "heading": "## Dérivation de l'Équation aux Dérivées Partielles de Black-Scholes",
      "description": "Expliquer la méthodologie de dérivation de l'équation de Black-Scholes. Cela inclura la construction d'un portefeuille sans risque (delta-hedging) et l'application du lemme d'Itô pour obtenir l'équation différentielle stochastique, puis l'équation aux dérivées partielles (EDP) de Black-Scholes."
    },
    {
      "heading": "## La Formule de Valorisation des Options Européennes",
      "description": "Présenter la solution analytique de l'EDP de Black-Scholes pour les options d'achat (call) et de vente (put) européennes. Expliquer chaque terme de la formule et son interprétation économique. Discuter des sensibilités (les 'Grecques') du prix de l'option par rapport aux paramètres du modèle."
    },
    {
      "heading": "## Limites et Critiques du Modèle de Black-Scholes-Merton",
      "description": "Aborder les principales limites et critiques du modèle de Black-Scholes-Merton, notamment l'hypothèse de volatilité constante (phénomène de 'smile' et 'skew' de volatilité), la distribution log-normale des rendements, l'absence de coûts de transaction et la possibilité de trading continu. Introduire brièvement des pistes d'extensions ou de modèles alternatifs."
    },
    {
      "heading": "## Conclusion",
      "description": "Récapituler les points essentiels abordés dans la leçon : les hypothèses, la dérivation de l'EDP, la formule de valorisation et les limites du modèle. Souligner l'importance continue du modèle de Black-Scholes-Merton comme fondation de la finance quantitative et ouvrir sur des perspectives d'approfondissement."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Hypothèses du modèle, dérivation de l'équation aux dérivées partielles, formule de valorisation des options européennes".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.