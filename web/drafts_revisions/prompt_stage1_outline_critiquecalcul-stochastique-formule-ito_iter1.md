You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction au Calcul Stochastique et à la Formule d'Itô",
      "description": "Cette section introduira le concept de calcul stochastique et son importance fondamentale en finance quantitative. Elle présentera la nécessité d'outils spécifiques pour modéliser les phénomènes aléatoires et soulignera le rôle central de la formule d'Itô dans ce domaine. Il s'agira de motiver l'étude de cette formule en expliquant pourquoi le calcul différentiel classique est insuffisant pour les processus stochastiques."
    },
    {
      "heading": "## Rappels et Fondements des Processus Stochastiques",
      "description": "Cette section révisera les concepts clés nécessaires à la compréhension de la formule d'Itô. Elle couvrira les notions de mouvement brownien (standard et généralisé), d'intégrale stochastique (intégrale d'Itô) et de martingales. L'objectif est de s'assurer que les étudiants maîtrisent les prérequis théoriques avant d'aborder la formule elle-même, en insistant sur les propriétés distinctives de ces processus par rapport aux fonctions déterministes."
    },
    {
      "heading": "## La Formule d'Itô: Énoncé et Intuition",
      "description": "Cette section présentera en détail la formule d'Itô pour les fonctions de processus stochastiques. Elle expliquera la différence fondamentale avec la règle de la chaîne du calcul classique, notamment l'apparition du terme de correction d'Itô. L'accent sera mis sur l'énoncé de la formule pour différentes formes de processus (e.g., processus d'Itô) et une intuition de sa dérivation, sans nécessairement entrer dans une preuve formelle complexe, mais en soulignant l'impact de la variance du processus."
    },
    {
      "heading": "## Applications Fondamentales de la Formule d'Itô en Finance",
      "description": "Cette section illustrera l'application pratique de la formule d'Itô à travers des exemples fondamentaux en finance quantitative. Elle couvrira des cas comme la dérivation de l'équation différentielle stochastique (EDS) du mouvement brownien géométrique, la dérivation de l'équation de Black-Scholes pour l'évaluation des options, et l'application à d'autres modèles de taux d'intérêt ou de volatilité. L'objectif est de montrer comment la formule d'Itô permet de transformer des EDS et de résoudre des problèmes concrets."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Cette section récapitulera les points essentiels abordés dans la leçon, en soulignant l'importance et la polyvalence de la formule d'Itô comme outil indispensable en finance quantitative. Elle ouvrira également des perspectives sur des applications plus avancées ou des extensions de la formule (e.g., lemme d'Itô multidimensionnel, applications aux changements de mesure) et son rôle dans des domaines de recherche actuels."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Application de la formule d'Itô aux fonctions de processus stochastiques, exemples fondamentaux".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.