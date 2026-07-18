You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction",
      "description": "Présenter l'objectif de cette leçon : réviser et consolider les concepts fondamentaux de la théorie des probabilités et de la mesure, indispensables pour aborder la modélisation stochastique en finance quantitative. Souligner l'importance de ces bases pour la compréhension des processus stochastiques et des instruments financiers complexes."
    },
    {
      "heading": "## Espaces de Probabilité et Tribus",
      "description": "Définir les éléments constitutifs d'un espace de probabilité : l'univers (Ω), la tribu (σ-algèbre F) et la mesure de probabilité (P). Expliquer la notion de tribu comme collection d'événements mesurables et son rôle dans la formalisation des informations disponibles. Présenter des exemples de tribus usuelles."
    },
    {
      "heading": "## Variables Aléatoires et Mesure",
      "description": "Introduire la définition d'une variable aléatoire comme fonction mesurable d'un espace de probabilité vers un espace mesurable. Aborder les différents types de variables aléatoires (discrètes, continues) et leurs lois de probabilité. Expliquer le lien entre l'espérance mathématique et l'intégrale de Lebesgue par rapport à une mesure de probabilité."
    },
    {
      "heading": "## Espérance Conditionnelle",
      "description": "Définir rigoureusement l'espérance conditionnelle d'une variable aléatoire par rapport à une tribu (ou une autre variable aléatoire). Présenter ses propriétés fondamentales (linéarité, positivité, projection, tour de magie, etc.) et son interprétation intuitive comme la meilleure estimation d'une variable aléatoire connaissant une certaine information. Illustrer avec des exemples concrets."
    },
    {
      "heading": "## Conclusion",
      "description": "Récapituler les concepts clés révisés : espaces mesurables, tribus, variables aléatoires et espérance conditionnelle. Mettre en évidence leur rôle central comme prérequis pour les cours avancés de finance quantitative, notamment pour la construction des martingales, des intégrales stochastiques et la valorisation d'options."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Révision des concepts de probabilité, espérance conditionnelle, tribus et espaces mesurables".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.