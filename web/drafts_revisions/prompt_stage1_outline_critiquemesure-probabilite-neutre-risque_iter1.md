You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Mesure Neutre au Risque",
      "description": "Présenter le contexte de la finance quantitative et la problématique de la valorisation des actifs dérivés. Introduire intuitivement la notion de mesure neutre au risque comme un concept fondamental pour la valorisation sans arbitrage, en soulignant son importance théorique et pratique."
    },
    {
      "heading": "## Fondements: Mesure Équivalente et Densité de Radon-Nikodym",
      "description": "Expliquer formellement ce qu'est une mesure de probabilité équivalente. Introduire la notion de densité de Radon-Nikodym et son rôle dans le changement de mesure. Démontrer pourquoi un changement de mesure est nécessaire pour passer d'une mesure historique (réelle) à une mesure neutre au risque."
    },
    {
      "heading": "## Le Théorème de Girsanov et le Changement de Drift",
      "description": "Présenter le théorème de Girsanov comme l'outil mathématique clé permettant de transformer les processus stochastiques (notamment les mouvements browniens) lors d'un changement de mesure. Expliquer comment le théorème modifie le drift d'un processus tout en préservant sa volatilité, ce qui est crucial pour la neutralité au risque."
    },
    {
      "heading": "## Valorisation des Actifs Dérivés sous Mesure Neutre au Risque",
      "description": "Détailler le principe de valorisation des actifs dérivés par espérance sous la mesure neutre au risque. Expliquer le lien avec l'absence d'opportunité d'arbitrage et la formule de Black-Scholes comme un cas particulier. Illustrer avec des exemples simples de valorisation d'options européennes."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler les concepts clés abordés (mesure équivalente, Girsanov, valorisation neutre au risque). Souligner l'importance pratique de ces outils en finance quantitative et ouvrir sur des applications plus avancées ou des limites du modèle."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Concept de mesure équivalente, théorème de Girsanov, valorisation sous mesure neutre au risque".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.