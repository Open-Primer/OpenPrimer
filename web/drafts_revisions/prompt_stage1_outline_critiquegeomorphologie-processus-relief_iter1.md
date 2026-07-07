You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Géomorphologie",
      "description": "Définir la géomorphologie comme science du relief terrestre. Présenter son objet d'étude, son importance en géographie physique et les objectifs du cours. Introduire brièvement les grands types de processus (endogènes et exogènes) et les formes de relief qui seront abordés."
    },
    {
      "heading": "## Les Processus Endogènes et la Construction du Relief",
      "description": "Expliquer les mécanismes internes de la Terre qui créent et modifient le relief. Aborder la tectonique des plaques (subduction, divergence, collision) et ses manifestations (orogenèse, failles, séismes). Décrire le volcanisme (types d'éruptions, formes volcaniques) et son rôle dans la formation des paysages."
    },
    {
      "heading": "## Les Processus Exogènes et l'Évolution des Paysages",
      "description": "Détailler les forces externes qui modèlent le relief. Inclure l'altération (physique, chimique, biologique), l'érosion (fluviale, glaciaire, éolienne, marine) et le transport des sédiments. Expliquer comment ces processus interagissent pour sculpter les formes terrestres."
    },
    {
      "heading": "## Les Principales Formes du Relief Terrestre",
      "description": "Présenter les caractéristiques et la genèse des grandes formes de relief. Inclure les montagnes (chaînes de montagnes, massifs), les plaines et plateaux, les littoraux (plages, falaises, deltas) et les déserts (dunes, regs). Illustrer avec des exemples concrets et discuter de leur dynamique évolutive."
    },
    {
      "heading": "## Conclusion: Synthèse et Perspectives",
      "description": "Récapituler les concepts clés abordés dans le cours concernant les processus endogènes et exogènes, et leur impact sur la diversité des formes de relief. Souligner l'interdépendance de ces processus et l'évolution constante des paysages. Ouvrir sur les enjeux actuels de la géomorphologie (changement climatique, gestion des risques)."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Description des processus endogènes (tectonique, volcanisme) et exogènes (érosion, altération, transport) qui sculptent le relief. Étude des formes géomorphologiques majeures (montagnes, plaines, littoraux, déserts) et de leur évolution.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.