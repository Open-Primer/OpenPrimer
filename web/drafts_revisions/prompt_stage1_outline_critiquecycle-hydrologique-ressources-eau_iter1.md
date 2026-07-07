You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction au cycle hydrologique et aux ressources en eau",
      "description": "Présenter l'importance de l'eau douce pour les écosystèmes et les sociétés humaines. Définir le cycle hydrologique comme un processus fondamental et introduire les enjeux liés à sa gestion."
    },
    {
      "heading": "## Les processus fondamentaux du cycle hydrologique",
      "description": "Détailler les différentes phases du cycle: évaporation (transpiration, évapotranspiration), condensation et précipitation, ruissellement (superficiel et hypodermique) et infiltration. Expliquer les facteurs influençant chaque processus."
    },
    {
      "heading": "## Bilan hydrique et dynamique des réserves d'eau douce",
      "description": "Analyser les bilans hydriques à différentes échelles (bassin versant, régionale, globale). Étudier les principales réserves d'eau douce: eaux de surface (lacs, rivières), eaux souterraines (aquifères, nappes phréatiques) et glaces. Mettre en évidence l'interconnexion de ces réservoirs."
    },
    {
      "heading": "## Enjeux contemporains et gestion des ressources en eau",
      "description": "Aborder les problématiques de la disponibilité et de la qualité de l'eau douce. Examiner l'impact des activités humaines (agriculture, industrie, urbanisation) et des changements climatiques sur le cycle hydrologique et les ressources en eau. Présenter les principes et les défis de la gestion intégrée de l'eau."
    },
    {
      "heading": "## Conclusion: Perspectives et défis futurs",
      "description": "Récapituler les points clés abordés sur la dynamique du cycle hydrologique et les enjeux des ressources en eau. Ouvrir sur les perspectives de recherche et les défis à relever pour une gestion durable de l'eau à l'échelle planétaire."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Analyse des processus d'évaporation, de précipitation, de ruissellement et d'infiltration. Étude des bilans hydriques à différentes échelles, des aquifères et des problématiques de gestion de l'eau douce face aux changements globaux.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.