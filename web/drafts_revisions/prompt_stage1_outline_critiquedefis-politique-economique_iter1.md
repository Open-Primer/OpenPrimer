You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: Les Nouveaux Horizons de la Politique Économique",
      "description": "Présenter le contexte actuel des défis macroéconomiques (inflation persistante, croissance ralentie, urgence climatique). Introduire les trois axes majeurs de la leçon: les arbitrages entre objectifs, la nécessité de coordination des politiques, et l'intégration des contraintes environnementales comme paradigme central de la politique économique moderne."
    },
    {
      "heading": "## Les Arbitrages Fondamentaux: Inflation et Croissance à l'Épreuve",
      "description": "Analyser les relations complexes et souvent conflictuelles entre la maîtrise de l'inflation et la stimulation de la croissance économique dans le contexte actuel. Revoir les modèles théoriques pertinents (courbe de Phillips, limites des politiques de demande) et discuter des dilemmes auxquels sont confrontées les banques centrales et les gouvernements."
    },
    {
      "heading": "## L'Intégration des Contraintes Environnementales dans la Politique Macroéconomique",
      "description": "Expliquer comment les objectifs environnementaux (décarbonation, économie circulaire) deviennent des contraintes et des opportunités pour la politique économique. Examiner les instruments spécifiques (fiscalité carbone, subventions vertes, régulations) et leurs impacts sur l'inflation, la croissance et la compétitivité. Discuter des concepts d'économie verte et de croissance soutenable."
    },
    {
      "heading": "## Coordination des Politiques et Gouvernance Économique Globale",
      "description": "Aborder la nécessité d'une meilleure coordination entre les politiques monétaires, budgétaires et structurelles, tant au niveau national qu'international, pour faire face aux défis multidimensionnels. Examiner les enjeux de la coopération internationale face aux chocs globaux et aux biens publics mondiaux (climat, stabilité financière)."
    },
    {
      "heading": "## Conclusion: Vers une Politique Économique Intégrée et Résiliente",
      "description": "Récapituler les principaux défis et les approches proposées. Souligner l'importance d'une vision holistique et adaptative de la politique économique, capable de gérer les arbitrages complexes et d'intégrer les dimensions sociales et environnementales pour une croissance durable et inclusive."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Arbitrages entre objectifs, coordination des politiques, intégration des contraintes environnementales.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.