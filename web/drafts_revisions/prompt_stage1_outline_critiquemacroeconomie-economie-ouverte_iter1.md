You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Macroéconomie en Économie Ouverte",
      "description": "Présenter l'importance de l'étude des économies ouvertes, définir les concepts clés de base (taux de change nominal et réel, régimes de taux de change) et introduire les thèmes majeurs qui seront abordés dans la leçon."
    },
    {
      "heading": "## La Parité des Taux d'Intérêt (PTI)",
      "description": "Expliquer en détail le concept de la parité des taux d'intérêt non couverte (PTINC) et couverte (PTIC). Dériver la formule, analyser ses hypothèses et ses implications pour les mouvements de capitaux et la détermination du taux de change. Discuter des écarts par rapport à la PTI et de leurs causes."
    },
    {
      "heading": "## La Balance des Paiements et le Taux de Change",
      "description": "Décrire la structure de la balance des paiements (compte courant, compte de capital et financier). Expliquer comment les déséquilibres de la balance des paiements influencent la demande et l'offre de devises et, par conséquent, le taux de change. Analyser la relation entre la balance courante et l'épargne/investissement."
    },
    {
      "heading": "## Effets des Chocs et des Politiques sur le Taux de Change",
      "description": "Analyser l'impact des chocs externes (ex: variations des prix des matières premières, crises financières internationales) et des politiques économiques (monétaire et budgétaire) sur le taux de change dans différents régimes (fixes et flottants). Utiliser des modèles pertinents (ex: modèle Mundell-Fleming) pour illustrer ces effets."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler les concepts fondamentaux abordés (PTI, balance des paiements, déterminants du taux de change). Souligner l'interdépendance des économies et l'importance de la gestion du taux de change pour la stabilité macroéconomique. Ouvrir sur des questions contemporaines ou des défis futurs."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Parité des taux d'intérêt, balance des paiements, effets des chocs externes et des politiques sur le taux de change.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.