You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Contexte et Enjeux de la Dimension Humaine au Travail",
      "description": "Présenter le contexte historique et intellectuel de l'émergence de la dimension humaine et sociale dans l'étude des organisations. Définir les objectifs du cours et introduire les concepts clés de l'École des Relations Humaines et de la Sociologie du Travail."
    },
    {
      "heading": "## L'École des Relations Humaines : Origines, Concepts et Critiques",
      "description": "Expliquer la naissance de l'École des Relations Humaines en réaction au Taylorisme et au Fordisme. Détailler les expériences de Hawthorne, les contributions d'Elton Mayo et les principaux postulats. Aborder également les critiques majeures adressées à cette école."
    },
    {
      "heading": "## De l'École des Relations Humaines à la Sociologie du Travail : Élargissement des Perspectives",
      "description": "Analyser comment les travaux de l'École des Relations Humaines ont ouvert la voie à la Sociologie du Travail. Présenter les thèmes centraux de la sociologie du travail (conditions de travail, identité professionnelle, pouvoir, conflits, culture d'entreprise) et les principales figures (Friedmann, Crozier, Touraine, etc.) qui ont approfondi ces questions."
    },
    {
      "heading": "## Impact sur le Management Stratégique et les Organisations Contemporaines",
      "description": "Évaluer l'influence durable de l'École des Relations Humaines et de la Sociologie du Travail sur les théories et pratiques du management. Discuter de l'évolution des approches managériales (management participatif, qualité de vie au travail, gestion des compétences) et de la prise en compte des facteurs humains et sociaux dans la stratégie des organisations actuelles."
    },
    {
      "heading": "## Conclusion : Bilan et Perspectives de la Dimension Humaine en Organisation",
      "description": "Récapituler les apports fondamentaux de l'École des Relations Humaines et de la Sociologie du Travail. Souligner la pertinence continue de ces approches pour comprendre les défis actuels des organisations et du management, et ouvrir sur des pistes de réflexion futures."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Compréhension de l'émergence de la dimension humaine et sociale dans l'organisation, et de son impact sur le management.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.