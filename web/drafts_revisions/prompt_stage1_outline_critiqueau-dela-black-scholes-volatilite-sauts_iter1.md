You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Au-delà des Hypothèses Simplificatrices",
      "description": "Présenter le contexte du cours de Finance Quantitative et Modélisation Stochastique. Introduire le modèle de Black-Scholes comme pierre angulaire de la valorisation d'options, puis souligner la nécessité d'explorer des modèles plus sophistiqués pour adresser ses limitations observées sur les marchés réels, notamment la volatilité non constante et les mouvements de prix discontinus. Annoncer les thèmes principaux de la leçon : volatilité stochastique et modèles à sauts."
    },
    {
      "heading": "## Les Limites du Modèle de Black-Scholes",
      "description": "Expliquer en détail les hypothèses clés du modèle de Black-Scholes (volatilité constante, mouvements de prix continus, absence de sauts, etc.). Démontrer comment ces hypothèses sont contredites par les observations empiriques des marchés financiers, en particulier le phénomène du 'smile' ou 'skew' de volatilité et la présence de sauts dans les séries temporelles de prix. Mettre en évidence les conséquences de ces limites sur la valorisation et la gestion des risques."
    },
    {
      "heading": "## Modèles de Volatilité Stochastique : Le Modèle de Heston",
      "description": "Introduire le concept de volatilité stochastique, où la volatilité du sous-jacent n'est plus constante mais suit un processus stochastique. Présenter le modèle de Heston comme un exemple emblématique, en détaillant son processus pour le prix de l'actif et pour sa variance. Expliquer les avantages du modèle de Heston (gestion du smile de volatilité, forme fermée pour les options européennes) et ses paramètres clés. Discuter des méthodes de calibration et des applications pratiques."
    },
    {
      "heading": "## Modèles à Sauts : Intégrer les Mouvements Discontinus",
      "description": "Aborder les modèles à sauts comme une alternative ou un complément aux modèles de volatilité stochastique pour capturer les mouvements brusques et discontinus des prix. Expliquer la nature des processus de Poisson et comment ils sont utilisés pour modéliser la fréquence et l'amplitude des sauts. Présenter des exemples de modèles à sauts (par exemple, Merton ou Kou) et discuter de leur impact sur la valorisation des options et la gestion des risques, notamment les options exotiques."
    },
    {
      "heading": "## Synthèse et Comparaison des Approches",
      "description": "Réaliser une synthèse comparative des modèles de Black-Scholes, de volatilité stochastique (Heston) et à sauts. Mettre en lumière leurs forces et faiblesses respectives, ainsi que les situations de marché où chaque type de modèle est le plus pertinent. Discuter des défis liés à la calibration et à l'implémentation de ces modèles plus complexes. Souligner l'importance de choisir le modèle approprié en fonction de l'instrument financier et des caractéristiques du marché."
    },
    {
      "heading": "## Conclusion et Perspectives Futures",
      "description": "Récapituler les concepts clés abordés dans la leçon : les limites de Black-Scholes et la nécessité des modèles avancés. Souligner l'apport des modèles de volatilité stochastique et à sauts pour une modélisation plus réaliste des marchés. Ouvrir sur les perspectives futures de la modélisation en finance quantitative, incluant les modèles hybrides, les modèles non-paramétriques, l'apprentissage automatique et l'impact des nouvelles technologies sur la valorisation et la gestion des risques."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Introduction aux limites du modèle de Black-Scholes, présentation des modèles de volatilité stochastique (Heston) et des modèles à sauts, synthèse des concepts clés du cours et perspectives futures.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.