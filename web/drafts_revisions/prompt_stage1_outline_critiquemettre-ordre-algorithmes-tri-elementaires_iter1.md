You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Algorithmes de Tri",
      "description": "Expliquer l'importance du tri en informatique, donner des exemples d'applications concrètes et introduire les concepts de base des algorithmes de tri. Mentionner l'objectif de la leçon : comprendre les tris élémentaires et leur analyse."
    },
    {
      "heading": "## Le Tri par Sélection",
      "description": "Décrire le principe de fonctionnement du tri par sélection. Fournir le pseudo-code détaillé de l'algorithme. Illustrer son exécution avec un exemple pas à pas sur un petit tableau."
    },
    {
      "heading": "## Le Tri par Insertion",
      "description": "Décrire le principe de fonctionnement du tri par insertion. Fournir le pseudo-code détaillé de l'algorithme. Illustrer son exécution avec un exemple pas à pas sur un petit tableau."
    },
    {
      "heading": "## Le Tri à Bulles",
      "description": "Décrire le principe de fonctionnement du tri à bulles. Fournir le pseudo-code détaillé de l'algorithme. Illustrer son exécution avec un exemple pas à pas sur un petit tableau."
    },
    {
      "heading": "## Analyse de Complexité des Tris Élémentaires",
      "description": "Analyser la complexité temporelle (meilleur cas, pire cas, cas moyen) de chacun des trois algorithmes (sélection, insertion, bulles) en utilisant la notation Grand O. Comparer leurs performances théoriques."
    },
    {
      "heading": "## Comparaison et Choix des Algorithmes",
      "description": "Récapituler les caractéristiques principales de chaque algorithme. Discuter de leurs avantages et inconvénients respectifs et des situations où l'un pourrait être préféré à l'autre, en se basant sur la complexité et la nature des données."
    },
    {
      "heading": "## Conclusion",
      "description": "Résumer les points clés abordés dans la leçon. Souligner l'importance de la compréhension des algorithmes élémentaires comme base pour des études plus avancées en algorithmique et introduire brièvement l'existence d'algorithmes de tri plus performants."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des algorithmes de tri par sélection, par insertion et à bulles. Analyse de leur complexité temporelle (meilleur, pire et cas moyen). Implémentation en pseudo-code.".
4. The plan contains EXACTLY between 6 and 8 sections.

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.