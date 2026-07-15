You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la théorie générale du contrat",
      "description": "Présenter l'importance du contrat en droit civil, sa place dans le Code civil et les objectifs de ce chapitre. Aborder brièvement l'évolution du droit des contrats, notamment la réforme de 2016."
    },
    {
      "heading": "## La formation du contrat : Rencontre des volontés",
      "description": "Détailler le processus de conclusion du contrat. Expliquer les notions d'offre et d'acceptation, leurs caractéristiques et les règles relatives à leur rencontre (moment et lieu de formation du contrat)."
    },
    {
      "heading": "## Les conditions de validité du contrat : Les piliers de l'engagement",
      "description": "Analyser les conditions essentielles à la validité d'un contrat selon la réforme de 2016. Traiter du consentement (intégrité du consentement et vices du consentement : erreur, dol, violence), de la capacité des parties et du contenu licite et certain du contrat (objet et cause, puis licéité et équilibre)."
    },
    {
      "heading": "## L'exécution et les sanctions de l'inexécution contractuelle",
      "description": "Expliquer les principes de l'exécution du contrat (force obligatoire, bonne foi). Aborder les différentes sanctions en cas d'inexécution : l'exécution forcée en nature, la réduction du prix, l'exception d'inexécution, la résolution du contrat et la responsabilité contractuelle (dommages et intérêts)."
    },
    {
      "heading": "## Conclusion : Synthèse et perspectives",
      "description": "Récapituler les points clés abordés dans le chapitre concernant la formation, la validité et l'exécution du contrat. Ouvrir sur les enjeux contemporains du droit des contrats et son application pratique."
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