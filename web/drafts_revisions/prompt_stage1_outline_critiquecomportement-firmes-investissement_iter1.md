You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: Le rôle central de l'investissement dans l'économie",
      "description": "Présenter l'importance de l'investissement des firmes pour la croissance économique et l'accumulation de capital. Introduire les objectifs du cours : comprendre la maximisation du profit, la décision d'investissement et l'impact des coûts d'ajustement."
    },
    {
      "heading": "## La Maximisation du Profit et la Décision d'Investissement des Firmes",
      "description": "Expliquer le cadre de la maximisation du profit des firmes en concurrence parfaite et imparfaite. Détailler comment cette maximisation conduit à la détermination du stock de capital optimal et à la décision d'investissement brute et nette. Aborder le rôle du coût d'usage du capital."
    },
    {
      "heading": "## Les Coûts d'Ajustement et la Dynamique de l'Investissement",
      "description": "Introduire le concept de coûts d'ajustement (internes et externes) et leur impact sur la flexibilité des décisions d'investissement. Expliquer comment ces coûts lissent la réponse de l'investissement aux chocs et introduisent une dimension dynamique dans la décision d'investissement."
    },
    {
      "heading": "## Modèles d'Investissement: Q de Tobin et Approches Néoclassiques",
      "description": "Présenter les principaux modèles théoriques de l'investissement, notamment le modèle néoclassique de l'investissement (Jorgenson) et le modèle de la Q de Tobin. Discuter leurs hypothèses, leurs mécanismes et leurs implications pour la politique économique."
    },
    {
      "heading": "## Conclusion: Synthèse et Perspectives Macroéconomiques",
      "description": "Récapituler les concepts clés abordés : maximisation du profit, décision d'investissement, rôle crucial des coûts d'ajustement. Ouvrir sur les implications macroéconomiques de ces comportements des firmes pour la croissance, les cycles économiques et l'efficacité des politiques économiques."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Maximisation du profit des firmes, décision d'investissement, rôle des coûts d'ajustement.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.