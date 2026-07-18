You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction au Comportement des Ménages et Consommation Intertemporelle",
      "description": "Présenter le concept de consommation intertemporelle et son importance fondamentale en macroéconomie. Expliquer pourquoi les ménages doivent prendre des décisions d'allocation de ressources sur plusieurs périodes. Introduire les objectifs du cours et les principaux thèmes abordés (optimisation, équation d'Euler, effets de richesse et de substitution)."
    },
    {
      "heading": "## Le Modèle d'Optimisation Intertemporelle des Ménages",
      "description": "Détailler le cadre théorique de l'optimisation intertemporelle. Définir la fonction d'utilité intertemporelle (avec le facteur d'actualisation), la contrainte budgétaire intertemporelle des ménages (revenus, épargne, taux d'intérêt). Expliquer comment les ménages maximisent leur utilité sous cette contrainte, en posant le problème de maximisation formel."
    },
    {
      "heading": "## L'Équation d'Euler et ses Implications",
      "description": "Dériver l'équation d'Euler à partir des conditions de premier ordre du problème d'optimisation. Expliquer l'intuition économique de l'équation d'Euler comme la condition d'égalisation des utilités marginales actualisées de la consommation entre deux périodes. Analyser les implications de l'équation d'Euler pour le lissage de la consommation et la réponse des ménages aux chocs de revenu ou de taux d'intérêt."
    },
    {
      "heading": "## Analyse des Effets de Richesse et de Substitution",
      "description": "Expliquer en détail comment une variation du taux d'intérêt réel affecte les décisions de consommation intertemporelle. Distinguer et analyser séparément l'effet de substitution (changement du prix relatif de la consommation présente par rapport à la consommation future) et l'effet de richesse (changement de la valeur actualisée des ressources totales du ménage). Illustrer ces effets sur la consommation présente et future."
    },
    {
      "heading": "## Conclusion",
      "description": "Récapituler les concepts clés abordés dans la leçon : le modèle d'optimisation intertemporelle, la signification et la dérivation de l'équation d'Euler, et la distinction entre les effets de richesse et de substitution. Souligner l'importance de ces outils pour l'analyse des politiques économiques et la compréhension des agrégats macroéconomiques comme l'épargne et l'investissement."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Optimisation de l'utilité intertemporelle, équations d'Euler, effets de richesse et de substitution.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.