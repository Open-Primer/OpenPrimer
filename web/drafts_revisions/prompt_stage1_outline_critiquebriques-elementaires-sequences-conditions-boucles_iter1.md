You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux structures de contrôle",
      "description": "Présenter l'objectif du cours : comprendre les fondations de la logique algorithmique. Définir ce qu'est un algorithme et pourquoi les structures de contrôle sont essentielles pour diriger son exécution. Établir le contexte de l'algorithmique comme base de la programmation."
    },
    {
      "heading": "## La séquence d'instructions",
      "description": "Expliquer la structure de contrôle la plus simple : la séquence. Décrire comment les instructions sont exécutées les unes après les autres, dans l'ordre où elles sont écrites. Fournir des exemples simples d'algorithmes séquentiels (ex: calcul de surface, échange de valeurs)."
    },
    {
      "heading": "## Les structures conditionnelles (Si-Alors-Sinon)",
      "description": "Introduire la notion de prise de décision dans un algorithme. Expliquer les structures 'Si-Alors' et 'Si-Alors-Sinon'. Aborder les opérateurs de comparaison et logiques. Illustrer avec des exemples concrets (ex: déterminer le plus grand de deux nombres, vérifier une condition)."
    },
    {
      "heading": "## Les boucles 'Tant que'",
      "description": "Présenter les structures itératives pour la répétition d'instructions. Expliquer le fonctionnement de la boucle 'Tant que' (While), en insistant sur la condition d'arrêt et le risque de boucle infinie. Fournir des exemples (ex: compter jusqu'à N, saisir une valeur valide)."
    },
    {
      "heading": "## Les boucles 'Pour'",
      "description": "Décrire la boucle 'Pour' (For) comme une structure itérative adaptée aux répétitions avec un nombre connu d'itérations ou pour parcourir des séquences. Comparer 'Pour' et 'Tant que'. Illustrer avec des exemples (ex: somme des N premiers entiers, affichage d'une table de multiplication)."
    },
    {
      "heading": "## Exercices de conception d'algorithmes",
      "description": "Proposer une série d'exercices pratiques où les étudiants devront combiner les séquences, conditions et boucles pour résoudre des problèmes algorithmiques simples. Mettre l'accent sur la décomposition du problème et la logique de construction."
    },
    {
      "heading": "## Conclusion et perspectives",
      "description": "Récapituler les concepts clés abordés : séquences, conditions et boucles comme les 'briques élémentaires' de tout algorithme. Souligner leur importance fondamentale en programmation et ouvrir sur les prochaines étapes de l'apprentissage de l'algorithmique."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Introduction aux structures de contrôle fondamentales: séquence d'instructions, structures conditionnelles (si-alors-sinon) et structures itératives (tant que, pour). Exercices de conception de petits algorithmes.".
4. The plan contains EXACTLY between 6 and 8 sections.

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.