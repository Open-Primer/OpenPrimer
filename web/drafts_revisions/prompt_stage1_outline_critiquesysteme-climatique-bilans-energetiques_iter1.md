You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction au système climatique terrestre",
      "description": "Présenter le système climatique comme un ensemble complexe d'interactions, définir ses composantes principales (atmosphère, hydrosphère, cryosphère, lithosphère, biosphère) et introduire l'importance des bilans énergétiques et de la composition atmosphérique pour sa régulation. Énoncer les objectifs du cours."
    },
    {
      "heading": "## Les bilans énergétiques du système Terre-atmosphère",
      "description": "Expliquer les sources d'énergie (rayonnement solaire), les mécanismes d'absorption, de réflexion (albédo) et d'émission (rayonnement terrestre). Détailler le bilan radiatif global de la Terre et les flux d'énergie (sensible, latente) entre la surface et l'atmosphère. Inclure des aspects quantitatifs et les lois physiques fondamentales (Stefan-Boltzmann, Wien)."
    },
    {
      "heading": "## Composition et structure de l'atmosphère: rôle des gaz à effet de serre",
      "description": "Décrire la composition chimique de l'atmosphère terrestre (gaz permanents et variables) et sa structure verticale. Se concentrer sur les principaux gaz à effet de serre (vapeur d'eau, CO2, CH4, N2O, O3) : leurs sources, puits, cycles biogéochimiques et leur capacité d'absorption du rayonnement infrarouge."
    },
    {
      "heading": "## L'effet de serre naturel et sa modélisation simplifiée",
      "description": "Expliquer le mécanisme de l'effet de serre naturel et son rôle fondamental dans le maintien d'une température propice à la vie. Présenter des modèles simplifiés (ex: modèle à une couche) pour illustrer quantitativement comment les gaz à effet de serre piègent la chaleur et influencent la température de surface de la planète."
    },
    {
      "heading": "## Conclusion: Dynamique du système climatique et enjeux futurs",
      "description": "Récapituler les points clés abordés (bilans énergétiques, rôle des GES, effet de serre). Souligner l'interconnexion des processus et l'importance de comprendre ces mécanismes pour appréhender les changements climatiques actuels et futurs. Ouvrir sur les implications des perturbations anthropiques et les perspectives de recherche."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Étude quantitative des flux d'énergie solaire et terrestre, analyse des gaz à effet de serre et de leur rôle dans la régulation thermique de la planète, modélisation simplifiée de l'effet de serre.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.