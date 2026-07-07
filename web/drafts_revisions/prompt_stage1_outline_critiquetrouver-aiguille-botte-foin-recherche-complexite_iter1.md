You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: L'art de trouver l'aiguille dans la botte de foin",
      "description": "Présenter le problème fondamental de la recherche d'informations dans de grands ensembles de données. Introduire l'importance des algorithmes efficaces pour résoudre ce problème et annoncer les objectifs du cours : comprendre les méthodes de recherche et évaluer leur efficacité."
    },
    {
      "heading": "## La Recherche Séquentielle: Pas à pas",
      "description": "Expliquer le principe de l'algorithme de recherche séquentielle (ou linéaire). Décrire son fonctionnement étape par étape, ses avantages (simplicité, pas de prérequis sur les données) et ses inconvénients (performance sur de grands ensembles)."
    },
    {
      "heading": "## La Recherche Dichotomique: Diviser pour régner",
      "description": "Présenter l'algorithme de recherche dichotomique (ou binaire). Insister sur la condition préalable des données triées. Expliquer le mécanisme de division de l'intervalle de recherche et la réduction rapide de l'espace de recherche."
    },
    {
      "heading": "## Mesurer l'efficacité: Introduction à la Complexité Algorithmique",
      "description": "Définir la notion de complexité algorithmique (temporelle et spatiale). Introduire la notation Grand O (O-notation) comme outil standard pour caractériser la croissance du temps d'exécution en fonction de la taille des données. Donner des exemples simples (O(1), O(n), O(n²))."
    },
    {
      "heading": "## Performance Comparée: Séquentielle vs. Dichotomique",
      "description": "Appliquer la notation Grand O aux algorithmes de recherche séquentielle (O(n)) et dichotomique (O(log n)). Comparer leurs performances théoriques et pratiques, en soulignant l'impact du tri préalable pour la recherche dichotomique et les scénarios où l'un est préférable à l'autre."
    },
    {
      "heading": "## Cas Pratiques et Limitations",
      "description": "Discuter des scénarios d'application concrets pour chaque algorithme. Aborder les compromis (coût du tri vs. rapidité de recherche). Mentionner les limitations de ces algorithmes et les situations où d'autres approches ou structures de données seraient plus appropriées."
    },
    {
      "heading": "## Conclusion: L'importance du bon algorithme",
      "description": "Récapituler les concepts clés abordés : les deux principaux algorithmes de recherche et l'importance de la complexité algorithmique pour évaluer et choisir l'algorithme le plus adapté. Ouvrir sur des perspectives futures (autres algorithmes de recherche, structures de données optimisées, etc.)."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Algorithmes de recherche séquentielle et dichotomique. Introduction à la notion de complexité algorithmique (notation Grand O). Comparaison des performances des algorithmes étudiés. Synthèse des concepts clés du cours et conclusion générale.".
4. The plan contains EXACTLY between 6 and 8 sections.

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.