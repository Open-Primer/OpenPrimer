You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux marchés financiers et aux crises",
      "description": "Présenter le cours, ses objectifs pédagogiques et l'importance de comprendre les dynamiques des marchés financiers, la formation des bulles et les mécanismes de crise dans le contexte macroéconomique. Esquisser brièvement les thèmes clés qui seront abordés."
    },
    {
      "heading": "## Le rôle du crédit et de l'effet de levier dans l'instabilité financière",
      "description": "Expliquer comment la création de crédit et l'effet de levier (leverage) peuvent amplifier les cycles économiques et contribuer à l'instabilité financière. Analyser les mécanismes par lesquels un excès de crédit peut mener à des prises de risque excessives et à la fragilisation du système financier."
    },
    {
      "heading": "## Formation des bulles financières et mécanismes de contagion",
      "description": "Définir les bulles financières, leurs caractéristiques et les facteurs économiques et comportementaux qui favorisent leur formation. Examiner les mécanismes de contagion qui permettent aux chocs financiers de se propager rapidement à travers le système, transformant des problèmes localisés en crises systémiques."
    },
    {
      "heading": "## Crises macroéconomiques et l'émergence des politiques macroprudentielles",
      "description": "Analyser les impacts macroéconomiques des crises financières (récessions, chômage, déflation). Introduire le concept de politiques macroprudentielles, leurs objectifs (atténuer les risques systémiques) et leurs principaux instruments (ratios de capital contracycliques, limites de LTV/DTI, surcharges pour institutions systémiques)."
    },
    {
      "heading": "## Conclusion et perspectives",
      "description": "Récapituler les points essentiels abordés concernant les marchés financiers, les bulles, les crises et les réponses politiques. Souligner l'importance d'une régulation financière robuste et de la coopération internationale pour prévenir de futures crises. Ouvrir sur les défis futurs et les pistes de recherche."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Rôle du crédit, effet de levier, mécanismes de contagion, politiques macroprudentielles.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.