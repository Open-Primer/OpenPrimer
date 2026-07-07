You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à l'Évaluation Terminale",
      "description": "Présenter l'objectif de l'évaluation terminale, son importance dans le parcours académique de L3, et le format général de l'examen (durée, types de questions, barème). Expliquer comment cette évaluation synthétise les apprentissages du cours de Géographie physique et climatologie."
    },
    {
      "heading": "## Rappel des Concepts Fondamentaux et Thématiques Clés",
      "description": "Décrire les grandes thématiques et concepts essentiels de la géographie physique (géomorphologie, hydrologie, biogéographie) et de la climatologie (dynamique atmosphérique, climats, changements climatiques) qui seront évalués. Insister sur les interconnexions entre ces notions pour une approche systémique."
    },
    {
      "heading": "## Méthodologie d'Analyse et de Résolution de Problèmes",
      "description": "Détailler les compétences spécifiques que l'évaluation vise à mesurer, telles que l'analyse critique de documents géographiques et climatiques (cartes, graphiques, données), la synthèse d'informations complexes, et l'application de modèles théoriques pour résoudre des problèmes concrets. Expliquer les méthodes d'argumentation attendues."
    },
    {
      "heading": "## Scénarios d'Application et Études de Cas Complexes",
      "description": "Expliquer comment les connaissances et compétences seront testées à travers des études de cas concrètes ou des scénarios problématiques. Ces cas nécessiteront l'intégration de plusieurs concepts et l'utilisation de méthodes d'analyse pour une compréhension et une explication approfondie de situations géographiques et climatiques complexes."
    },
    {
      "heading": "## Consignes Finales et Critères d'Évaluation",
      "description": "Fournir les dernières instructions pratiques pour l'examen (matériel autorisé, gestion du temps, présentation des réponses, structure attendue des dissertations ou analyses). Expliciter les critères de notation (précision des connaissances, rigueur de l'argumentation, clarté de l'expression, capacité à mobiliser des exemples pertinents)."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Évaluation sommative des connaissances acquises et de la capacité à appliquer les concepts et méthodes étudiés pour analyser des situations géographiques et climatiques complexes.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.