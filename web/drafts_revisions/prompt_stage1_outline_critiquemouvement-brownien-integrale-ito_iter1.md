You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction au Mouvement Brownien et à l'Intégrale d'Itô",
      "description": "Présenter l'importance du mouvement brownien et de l'intégrale d'Itô en finance quantitative, notamment pour la modélisation des prix d'actifs. Expliquer brièvement les objectifs du cours et son positionnement dans le programme de Master 1."
    },
    {
      "heading": "## Le Mouvement Brownien: Construction et Propriétés Fondamentales",
      "description": "Décrire la construction rigoureuse du mouvement brownien (définition par les propriétés des accroissements indépendants et stationnaires, continuité des trajectoires, etc.). Détailler ses propriétés clés : accroissements gaussiens, trajectoires continues mais nulle part différentiables, variance proportionnelle au temps."
    },
    {
      "heading": "## L'Intégrale d'Itô: Définition et Propriétés Clés",
      "description": "Introduire la nécessité de l'intégrale d'Itô pour les processus stochastiques non différentiables. Définir l'intégrale d'Itô pour des processus simples (processus étagés) puis étendre la définition. Expliquer ses propriétés fondamentales, en insistant sur la différence avec l'intégrale de Riemann-Stieltjes."
    },
    {
      "heading": "## Le Lemme d'Itô et Premières Applications",
      "description": "Présenter le Lemme d'Itô comme un outil fondamental pour la différentiation des fonctions de processus d'Itô. Illustrer son application à des exemples simples pertinents pour la finance quantitative, comme la dérivation du modèle de Black-Scholes pour le prix d'une option."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler les concepts clés abordés (Mouvement Brownien, Intégrale d'Itô, Lemme d'Itô). Ouvrir sur les applications futures et les extensions possibles de ces concepts en finance stochastique (équations différentielles stochastiques, modèles de taux d'intérêt, etc.)."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Construction du mouvement brownien, définition et propriétés de l'intégrale d'Itô".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.