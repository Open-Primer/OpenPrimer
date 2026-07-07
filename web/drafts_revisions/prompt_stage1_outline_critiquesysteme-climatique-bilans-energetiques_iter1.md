You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction au système climatique terrestre",
      "description": "Présenter le système climatique comme un ensemble complexe d'interactions entre l'atmosphère, l'hydrosphère, la cryosphère, la lithosphère et la biosphère. Introduire l'importance des bilans énergétiques et de la composition atmosphérique pour comprendre le climat de la Terre et ses variations."
    },
    {
      "heading": "## Le bilan énergétique terrestre: flux et transferts",
      "description": "Expliquer les sources d'énergie (principalement solaire) et les mécanismes de son absorption, réflexion et émission par la Terre. Détailler les concepts d'albédo, de rayonnement solaire incident, de rayonnement terrestre émis et de flux de chaleur latente et sensible. Mettre l'accent sur l'équilibre radiatif global."
    },
    {
      "heading": "## Composition atmosphérique et rôle des gaz à effet de serre",
      "description": "Décrire la composition majeure de l'atmosphère terrestre. Identifier les principaux gaz à effet de serre (GES) naturels et anthropiques (vapeur d'eau, CO2, CH4, N2O, O3, CFCs) et expliquer leur capacité à absorber et réémettre le rayonnement infrarouge. Quantifier leur contribution relative à l'effet de serre naturel."
    },
    {
      "heading": "## Modélisation simplifiée de l'effet de serre",
      "description": "Présenter des modèles conceptuels ou simplifiés (par exemple, le modèle de corps noir ou un modèle à une couche) pour illustrer le mécanisme de l'effet de serre et calculer une température d'équilibre théorique de la Terre avec et sans atmosphère. Discuter des limites de ces modèles simplifiés."
    },
    {
      "heading": "## Conclusion: Synthèse et perspectives",
      "description": "Récapituler les points clés abordés concernant les bilans énergétiques et la composition atmosphérique. Souligner l'interdépendance de ces éléments dans la régulation du climat terrestre. Ouvrir sur les enjeux actuels du changement climatique et l'importance de ces concepts pour les études futures."
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