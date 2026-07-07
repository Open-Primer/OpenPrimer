You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: L'Algorithmique, une Approche Essentielle",
      "description": "Présenter l'objectif de la leçon et son importance capitale dans le domaine de l'informatique. Introduire l'algorithmique comme une méthode universelle de résolution de problèmes, en soulignant son omniprésence dans le monde numérique actuel."
    },
    {
      "heading": "## Genèse et Évolution Historique des Algorithmes",
      "description": "Explorer les origines historiques de l'algorithmique, des premières traces dans l'Antiquité (Euclide) aux contributions majeures du Moyen Âge (Al-Khwarizmi), jusqu'aux fondations de l'informatique moderne (Ada Lovelace, Alan Turing). Mettre en évidence comment la notion d'algorithme a évolué au fil du temps."
    },
    {
      "heading": "## Concepts Fondamentaux: Problème, Algorithme et Programme",
      "description": "Définir de manière claire et précise les trois concepts clés de la leçon: le 'problème' (ce que l'on cherche à résoudre), l''algorithme' (la séquence d'étapes pour le résoudre) et le 'programme' (l'implémentation concrète de l'algorithme). Insister sur les distinctions et les liens entre ces termes."
    },
    {
      "heading": "## L'Algorithmique au Cœur de l'Informatique et de la Pensée Structurée",
      "description": "Expliquer le rôle central et l'importance de l'algorithmique en informatique (efficacité, optimisation, complexité). Démontrer comment l'algorithmique est une méthode de pensée structurée et logique, applicable bien au-delà de l'informatique, et son impact sur la résolution de problèmes dans divers domaines."
    },
    {
      "heading": "## Conclusion: L'Algorithmique, un Pilier pour l'Avenir",
      "description": "Récapituler les principaux enseignements de la leçon: l'histoire, les définitions fondamentales et l'importance de l'algorithmique. Ouvrir la perspective sur les prochaines étapes de l'apprentissage, en soulignant que la maîtrise de l'algorithmique est une compétence essentielle pour tout informaticien."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des origines historiques de l'algorithmique, de sa place dans l'informatique et de son importance comme méthode de pensée structurée. Définition des concepts clés: problème, algorithme, programme.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.