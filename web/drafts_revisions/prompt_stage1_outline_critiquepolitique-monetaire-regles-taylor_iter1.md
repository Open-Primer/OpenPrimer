You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Politique Monétaire Avancée",
      "description": "Présenter les objectifs de la politique monétaire dans un cadre macroéconomique avancé (stabilité des prix, croissance, emploi). Introduire la nécessité d'une analyse plus fine des mécanismes de transmission et des défis liés aux rigidités nominales."
    },
    {
      "heading": "## Rigidité des Prix et Salaires : Fondements et Conséquences",
      "description": "Expliquer les différentes sources de rigidité des prix et des salaires (contrats, coûts de menu, information imparfaite). Analyser comment ces rigidités affectent l'efficacité de la politique monétaire et la transmission des chocs."
    },
    {
      "heading": "## Le Rôle de la Banque Centrale et ses Instruments",
      "description": "Décrire les fonctions principales d'une banque centrale moderne (émission monétaire, prêteur en dernier ressort, régulateur). Détailler les instruments de politique monétaire conventionnels (taux directeurs, opérations d'open market) et non conventionnels."
    },
    {
      "heading": "## Mécanismes de Transmission des Chocs Monétaires",
      "description": "Analyser les différents canaux par lesquels la politique monétaire affecte l'économie réelle : canal des taux d'intérêt, canal du crédit, canal du taux de change, canal des anticipations. Illustrer avec des exemples concrets."
    },
    {
      "heading": "## Les Règles de Taylor et la Conduite de la Politique Monétaire",
      "description": "Introduire le concept des règles de politique monétaire, en se concentrant sur la règle de Taylor. Expliquer sa formulation, ses composantes (écart d'inflation, écart de production) et son rôle comme guide pour la banque centrale. Discuter de ses limites et de ses extensions."
    },
    {
      "heading": "## Conclusion : Défis et Perspectives de la Politique Monétaire",
      "description": "Récapituler les points clés abordés. Discuter des défis actuels et futurs pour la politique monétaire (limite zéro des taux, nouvelles formes de chocs, coordination budgétaire). Ouvrir sur les débats contemporains en macroéconomie monétaire."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Introduction de la rigidité des prix et salaires, rôle de la banque centrale, transmission des chocs monétaires.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.