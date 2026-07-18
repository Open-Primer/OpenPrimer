You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Comprendre la Pensée Organisationnelle",
      "description": "Présenter l'objectif du cours, définir la pensée organisationnelle et son importance pour la sociologie et le management. Énoncer le plan du cours."
    },
    {
      "heading": "## Les Paradigmes Fondateurs : Rationalisation et Bureaucratie",
      "description": "Détailler les contributions majeures de Max Weber (bureaucratie, rationalité), Frederick Winslow Taylor (organisation scientifique du travail) et Henri Fayol (principes d'administration). Expliquer le contexte historique et les objectifs de leurs théories."
    },
    {
      "heading": "## Des Ruptures Épistémologiques aux Nouvelles Perspectives",
      "description": "Analyser les critiques et les limites des approches classiques. Présenter les mouvements de rupture (ex: École des Relations Humaines, Théorie des Systèmes, Approche Contingente) et comment ils ont enrichi la compréhension des organisations."
    },
    {
      "heading": "## La Pensée Organisationnelle Face aux Défis Actuels",
      "description": "Mettre en perspective les théories historiques avec les enjeux contemporains (mondialisation, numérique, flexibilité, RSE, nouvelles formes d'organisation). Montrer la pertinence et les limites des cadres classiques pour analyser les organisations modernes."
    },
    {
      "heading": "## Conclusion : Héritages et Avenir de la Pensée Organisationnelle",
      "description": "Récapituler les points clés du cours, souligner l'évolution et la complexité de la pensée organisationnelle. Ouvrir sur les perspectives futures de la recherche et de la pratique managériale."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des paradigmes fondateurs (Weber, Taylor, Fayol) et de leurs ruptures épistémologiques, avec une mise en perspective des enjeux contemporains.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.