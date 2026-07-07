You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Structures de Données Linéaires",
      "description": "Présenter l'importance de l'organisation des données en informatique. Introduire le concept de structures de données linéaires et annoncer les deux types principaux qui seront étudiés : les tableaux et les listes chaînées, en soulignant leur rôle fondamental."
    },
    {
      "heading": "## Les Tableaux: Structures Statiques et Dynamiques",
      "description": "Définir ce qu'est un tableau, expliquer la différence entre tableaux statiques et dynamiques. Décrire les opérations de base : accès à un élément par index, insertion et suppression (avec leurs coûts en temps). Aborder les avantages (accès direct, efficacité spatiale) et les inconvénients (taille fixe pour les statiques, coût des insertions/suppressions en milieu de tableau)."
    },
    {
      "heading": "## Les Listes Chaînées Simples",
      "description": "Introduire le concept de liste chaînée comme alternative aux tableaux, en expliquant la notion de nœud (donnée + pointeur vers le suivant). Décrire les opérations fondamentales : insertion en tête/queue/milieu, suppression d'un élément, et parcours de la liste. Mettre en évidence les avantages (taille dynamique, insertions/suppressions efficaces) et les inconvénients (accès séquentiel, surcharge mémoire pour les pointeurs)."
    },
    {
      "heading": "## Les Listes Chaînées Doubles",
      "description": "Présenter les listes doublement chaînées comme une amélioration des listes simples. Expliquer l'ajout d'un pointeur vers le nœud précédent. Décrire comment cela simplifie certaines opérations (parcours bidirectionnel, suppression sans connaître le prédécesseur). Comparer brièvement avec les listes simples en termes de complexité des opérations et d'utilisation mémoire."
    },
    {
      "heading": "## Comparaison et Choix de la Structure",
      "description": "Réaliser une comparaison détaillée des tableaux et des listes chaînées (simples et doubles) sur des critères clés : complexité temporelle des opérations (accès, insertion, suppression), utilisation de la mémoire, facilité d'implémentation et cas d'utilisation typiques. Fournir des lignes directrices pour aider à choisir la structure la plus appropriée selon le contexte et les besoins spécifiques de l'application."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler les concepts clés abordés dans la leçon concernant les tableaux et les listes chaînées, en insistant sur leur complémentarité. Souligner l'importance de bien choisir sa structure de données pour l'efficacité des algorithmes. Ouvrir sur d'autres structures de données linéaires ou non linéaires qui seront étudiées ultérieurement."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des structures de données linéaires de base: tableaux (statiques et dynamiques) et listes chaînées (simples, doubles). Opérations fondamentales (insertion, suppression, accès). Comparaison des avantages et inconvénients.".
4. The plan contains EXACTLY between 6 and 8 sections.

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.