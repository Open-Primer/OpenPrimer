You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: Pourquoi découper pour mieux régner?",
      "description": "Présenter le problème de la complexité des grands programmes et introduire les fonctions (ou procédures) comme une solution fondamentale pour organiser le code, améliorer la lisibilité et faciliter la collaboration. Énoncer les objectifs d'apprentissage de la leçon, en soulignant l'importance de la modularité."
    },
    {
      "heading": "## Les Fondamentaux des Fonctions et Procédures",
      "description": "Définir ce qu'est une fonction (ou procédure) en algorithmique. Expliquer les concepts de signature de fonction, de paramètres (formels et actuels) et de valeur de retour. Illustrer avec des exemples simples de fonctions sans et avec paramètres, et avec ou sans valeur de retour, en mettant l'accent sur leur rôle d'abstraction."
    },
    {
      "heading": "## L'Importance de la Modularité et de la Réutilisabilité",
      "description": "Expliquer pourquoi la modularité est cruciale en développement logiciel. Aborder les avantages comme la simplification du débogage, la facilité de maintenance, la réutilisabilité du code et la collaboration en équipe. Utiliser des exemples concrets pour montrer l'impact d'un code modulaire versus un code monolithique."
    },
    {
      "heading": "## Mécanismes de Passage de Paramètres",
      "description": "Détailler les deux principaux mécanismes de passage de paramètres: par valeur et par référence. Expliquer la différence fondamentale entre les deux, leurs implications sur la modification des données originales et quand utiliser l'un ou l'autre. Fournir des exemples illustratifs pour chaque mécanisme, en soulignant les pièges potentiels."
    },
    {
      "heading": "## Concevoir des Algorithmes Modulaires",
      "description": "Guider l'étudiant sur la manière de décomposer un problème complexe en sous-problèmes gérables, chacun pouvant être résolu par une fonction. Présenter des principes de bonne conception de fonctions (cohérence, faible couplage, forte cohésion). Proposer une méthodologie pour la conception d'algorithmes modulaires et leur intégration."
    },
    {
      "heading": "## Conclusion: Maîtriser l'Art du Découpage",
      "description": "Récapituler les points clés abordés dans la leçon: la définition et l'utilité des fonctions, l'importance de la modularité et de la réutilisabilité, les mécanismes de passage de paramètres et les principes de conception. Souligner l'impact de ces concepts sur la qualité, l'efficacité et la maintenabilité du code. Ouvrir sur les prochaines étapes ou des concepts plus avancés liés à l'organisation du code."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Concept de fonction/procédure, paramètres, valeur de retour. Importance de la modularité et de la réutilisabilité du code. Passage de paramètres par valeur et par référence. Conception d'algorithmes modulaires.".
4. The plan contains EXACTLY between 6 and 8 sections.

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.