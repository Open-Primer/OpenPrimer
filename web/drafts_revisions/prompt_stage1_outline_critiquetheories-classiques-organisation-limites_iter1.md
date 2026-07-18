You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Théories Classiques de l'Organisation",
      "description": "Présenter le contexte historique et intellectuel de l'émergence des théories classiques. Définir ce qu'est une 'théorie classique' de l'organisation et annoncer le plan de la leçon."
    },
    {
      "heading": "## Le Taylorisme et le Fordisme : L'Organisation Scientifique du Travail",
      "description": "Expliquer les principes fondamentaux du Taylorisme (OST) et du Fordisme. Décrire leurs apports majeurs à la productivité et à la gestion des entreprises, ainsi que leurs premières critiques."
    },
    {
      "heading": "## L'Administration Classique (Fayol) et la Bureaucratie (Weber)",
      "description": "Analyser les principes de l'administration classique de Fayol (fonctions, principes de gestion) et la théorie de la bureaucratie de Weber (rationalité, légitimité). Mettre en évidence leurs contributions à la structuration des organisations."
    },
    {
      "heading": "## Les Limites et Critiques des Approches Classiques",
      "description": "Détailler les principales critiques adressées aux théories classiques, notamment sur les plans humain (déshumanisation), social (conflits), et structurel (rigidité, inadaptation au changement). Aborder les premières remises en question."
    },
    {
      "heading": "## Héritage et Insuffisances Actuelles des Théories Classiques",
      "description": "Évaluer la pertinence des principes classiques dans les organisations contemporaines. Identifier les situations où ils sont encore appliqués et, inversement, leurs insuffisances face aux défis actuels (flexibilité, innovation, bien-être au travail)."
    },
    {
      "heading": "## Conclusion : Au-delà des Classiques",
      "description": "Récapituler les points clés de la leçon. Souligner l'importance historique des théories classiques comme fondement, tout en ouvrant sur la nécessité d'approches plus complexes et adaptées aux réalités modernes de l'organisation."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Analyse des principes, des apports et des critiques des approches classiques, en soulignant leur pertinence et leurs insuffisances actuelles.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.