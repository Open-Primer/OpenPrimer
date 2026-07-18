You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Équations Différentielles Stochastiques",
      "description": "Présenter les Équations Différentielles Stochastiques (EDS) comme un outil fondamental en finance quantitative pour modéliser des phénomènes aléatoires. Expliquer pourquoi les modèles déterministes sont insuffisants pour les marchés financiers et introduire la notion de mouvement brownien comme source de stochasticité."
    },
    {
      "heading": "## Fondements Mathématiques et Définitions Clés des EDS",
      "description": "Revoir les concepts nécessaires à la compréhension des EDS, notamment l'intégrale d'Itô et le lemme d'Itô. Définir formellement une EDS, en expliquant ses composantes (terme de dérive, terme de diffusion) et leur interprétation économique et probabiliste."
    },
    {
      "heading": "## Théorèmes d'Existence et d'Unicité des Solutions d'EDS",
      "description": "Détailler les conditions (e.g., conditions de Lipschitz et de croissance linéaire) sous lesquelles une EDS admet une solution unique. Présenter les théorèmes clés garantissant l'existence et l'unicité des solutions, et discuter de leur importance pratique pour la validité des modèles financiers."
    },
    {
      "heading": "## EDS Linéaires et l'Équation de Black-Scholes",
      "description": "Étudier les propriétés et les méthodes de résolution des EDS linéaires, en fournissant des exemples pertinents. Introduire l'EDS de Black-Scholes pour la modélisation du prix des actifs financiers, en expliquant sa dérivation et son rôle central dans la valorisation des options et la gestion des risques."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler l'importance et la polyvalence des EDS en finance quantitative. Discuter des limites des modèles présentés et ouvrir sur des sujets avancés ou des applications plus complexes des EDS (e.g., EDS à sauts, contrôle stochastique, calibration de modèles)."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Existence et unicité des solutions d'EDS, EDS linéaires, EDS de Black-Scholes".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.