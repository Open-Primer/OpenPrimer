You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la théorie générale du contrat",
      "description": "Présenter l'importance du contrat en droit civil français, définir la notion de contrat et situer le chapitre dans le cadre de la réforme du droit des obligations de 2016. Annoncer les points clés qui seront abordés : la formation, les conditions de validité et les sanctions de l'inexécution contractuelle."
    },
    {
      "heading": "## La formation du contrat : Rencontre des volontés",
      "description": "Expliquer le processus de conclusion du contrat. Détailler les notions d'offre et d'acceptation, leurs caractéristiques (fermeté, précision) et les règles relatives à leur rencontre (moment et lieu de formation du contrat, contrats entre absents)."
    },
    {
      "heading": "## Les conditions de validité du contrat : Une protection des parties et de l'ordre public",
      "description": "Aborder les conditions essentielles de validité du contrat issues de la réforme de 2016 : le consentement (intégrité du consentement, vices du consentement : erreur, dol, violence), la capacité des parties, et le contenu licite et certain du contrat. Mettre en lumière les sanctions en cas de non-respect de ces conditions (nullité relative et absolue)."
    },
    {
      "heading": "## L'exécution et les sanctions de l'inexécution contractuelle",
      "description": "Décrire les principes de l'exécution forcée en nature, de la résolution du contrat (unilatérale, judiciaire, clause résolutoire), de l'exception d'inexécution et des dommages et intérêts. Expliquer les conditions de mise en œuvre de ces différentes sanctions et leurs effets."
    },
    {
      "heading": "## Conclusion : Synthèse et perspectives",
      "description": "Récapituler les points essentiels abordés concernant la formation, la validité et l'exécution du contrat. Ouvrir sur les enjeux contemporains du droit des contrats et son évolution, notamment face aux nouvelles formes de contractualisation."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 2 / Bachelor 2nd Year (L2)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Ce chapitre étudie le processus de conclusion du contrat (offre et acceptation), les conditions de validité posées par la réforme de 2016 (consentement non vicié, capacité, contenu licite et certain) et les sanctions de l'inexécution contractuelle (résolution, exécution forcée).".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.