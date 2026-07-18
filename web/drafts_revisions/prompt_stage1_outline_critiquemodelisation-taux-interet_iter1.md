You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Modélisation des Taux d'Intérêt",
      "description": "Présenter l'importance des taux d'intérêt en finance quantitative, les défis de leur modélisation et les objectifs du cours. Introduire brièvement les concepts de taux courts et de courbe des taux."
    },
    {
      "heading": "## Modèles de Taux Courts à un Facteur (Vasicek et CIR)",
      "description": "Détailler les modèles de Vasicek et de Cox-Ingersoll-Ross (CIR). Expliquer leurs équations différentielles stochastiques (EDS), leurs propriétés (retour à la moyenne, positivité pour CIR) et leurs avantages/inconvénients respectifs. Aborder la dérivation des prix d'obligations zéro-coupon sous ces modèles."
    },
    {
      "heading": "## Le Modèle de Hull-White et la Calibration",
      "description": "Présenter le modèle de Hull-White comme une extension du modèle de Vasicek permettant de fitter la courbe des taux initiale. Expliquer son EDS et ses propriétés. Détailler les méthodes de calibration de ces modèles aux données de marché (e.g., calibration des paramètres aux prix des caps/floors ou aux volatilités de taux)."
    },
    {
      "heading": "## Applications et Limites des Modèles de Taux Courts",
      "description": "Illustrer les applications pratiques des modèles de taux courts, telles que la valorisation d'options sur taux (caps, floors, swaptions) et la gestion de portefeuille. Discuter des limites de ces modèles (e.g., non-arbitrage, modélisation de la volatilité stochastique, modèles multi-facteurs)."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler les principaux modèles de taux courts étudiés et leurs applications. Ouvrir sur des sujets plus avancés ou des modèles plus complexes (e.g., modèles de marché comme le LIBOR Market Model) et l'évolution future de la modélisation des taux."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des modèles de taux courts (Vasicek, CIR, Hull-White), calibration et applications".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.