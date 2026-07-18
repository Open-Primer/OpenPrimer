You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux modèles DSGE",
      "description": "Présenter l'importance des modèles DSGE en macroéconomie moderne, leur rôle dans l'analyse des politiques économiques, et les objectifs d'apprentissage de cette leçon."
    },
    {
      "heading": "## Les fondements microéconomiques: Agents représentatifs et optimisation intertemporelle",
      "description": "Expliquer le concept d'agent représentatif (ménage, firme) et leur problème d'optimisation intertemporelle sous incertitude. Aborder les fonctions d'utilité et de production typiques utilisées dans ces modèles."
    },
    {
      "heading": "## Contraintes budgétaires intertemporelles et conditions d'équilibre",
      "description": "Détailler la formulation des contraintes budgétaires intertemporelles pour les ménages et les firmes. Expliquer comment ces contraintes, combinées aux conditions d'optimalité des agents, définissent l'équilibre général du modèle."
    },
    {
      "heading": "## Méthodes de résolution: La programmation dynamique",
      "description": "Introduire le principe de la programmation dynamique comme outil fondamental de résolution des problèmes d'optimisation intertemporelle dans les modèles DSGE. Expliquer la fonction de valeur et l'équation de Bellman."
    },
    {
      "heading": "## Conclusion et perspectives",
      "description": "Récapituler les concepts clés abordés (agents représentatifs, contraintes intertemporelles, programmation dynamique) et discuter des limites et des extensions possibles des modèles DSGE, ouvrant sur des sujets plus avancés."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Introduction aux agents représentatifs, contraintes budgétaires intertemporelles, et résolution par programmation dynamique.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.