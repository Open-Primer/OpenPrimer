You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: Le miroir de l'algorithme",
      "description": "Présenter le concept de la récursivité comme une technique de résolution de problèmes où une fonction s'appelle elle-même. Expliquer l'importance de la récursivité en informatique et donner un aperçu des sujets qui seront abordés dans la leçon."
    },
    {
      "heading": "## Principes Fondamentaux de la Récursivité",
      "description": "Définir formellement la récursivité. Expliquer les deux composants essentiels: le cas de base (condition d'arrêt) et l'appel récursif (étape récursive). Utiliser des analogies simples pour illustrer le concept."
    },
    {
      "heading": "## Exemples Classiques de Récursivité",
      "description": "Illustrer la récursivité avec des exemples fondamentaux. Détailler l'implémentation et le fonctionnement de la fonction factorielle et de la suite de Fibonacci en utilisant la récursivité. Mettre en évidence le cas de base et l'appel récursif pour chaque exemple."
    },
    {
      "heading": "## La Récursivité en Action: Les Tours de Hanoï",
      "description": "Présenter un exemple plus complexe et visuel de la récursivité avec le problème des Tours de Hanoï. Expliquer comment la récursivité permet de résoudre ce problème de manière élégante et concise, en détaillant les étapes logiques."
    },
    {
      "heading": "## Récursivité vs Itération: Conversion et Comparaison",
      "description": "Comparer les approches récursives et itératives pour la résolution de problèmes. Montrer comment convertir un algorithme itératif en récursif et vice-versa. Discuter des avantages et inconvénients de chaque approche en termes de lisibilité et de performance."
    },
    {
      "heading": "## Analyse des Coûts et Optimisation",
      "description": "Analyser les coûts associés aux algorithmes récursifs, notamment en termes de complexité temporelle et spatiale (pile d'appels). Aborder les problèmes potentiels comme le débordement de pile (stack overflow) et introduire des techniques d'optimisation comme la mémoïsation ou la récursivité terminale (si pertinent pour le niveau L1)."
    },
    {
      "heading": "## Conclusion: Maîtriser le miroir",
      "description": "Récapituler les points clés de la leçon sur la récursivité. Souligner son utilité et sa puissance dans la conception d'algorithmes. Encourager la pratique et la reconnaissance des problèmes récursifs."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Définition de la récursivité, cas de base et appel récursif. Exemples classiques (factorielle, Fibonacci, tours de Hanoï). Conversion d'algorithmes itératifs en récursifs et vice-versa. Analyse des coûts.".
4. The plan contains EXACTLY between 6 and 8 sections.

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.