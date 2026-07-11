You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la responsabilité civile extracontractuelle",
      "description": "Cette section introduira le concept de la responsabilité civile extracontractuelle, son rôle fondamental en droit français (articles 1240 et suivants du Code civil), et distinguera ce régime de la responsabilité contractuelle. Elle présentera également le plan général du cours."
    },
    {
      "heading": "## Le fait générateur de responsabilité",
      "description": "Cette section détaillera les différentes catégories de faits générateurs de responsabilité. Elle abordera la faute personnelle (responsabilité du fait personnel), la responsabilité du fait d'autrui (parents, commettants, etc.) et la responsabilité du fait des choses (garde de la chose, rôle actif de la chose)."
    },
    {
      "heading": "## Le dommage réparable et le lien de causalité",
      "description": "Cette section analysera les deux autres conditions cumulatives de la responsabilité civile. Elle définira le dommage réparable (préjudice) en explorant ses différentes catégories (matériel, corporel, moral) et ses caractères. Ensuite, elle expliquera le lien de causalité entre le fait générateur et le dommage, en présentant les théories de la causalité (équivalence des conditions, causalité adéquate) et les difficultés d'appréciation."
    },
    {
      "heading": "## Les causes d'exonération de la responsabilité",
      "description": "Cette section examinera les différentes causes permettant d'atténuer ou d'exclure la responsabilité de l'auteur du dommage. Elle traitera de la force majeure, du fait de la victime et du fait d'un tiers, en précisant leurs conditions d'application et leurs effets sur l'indemnisation."
    },
    {
      "heading": "## Conclusion générale",
      "description": "Cette section synthétisera les points clés abordés dans le cours, en rappelant l'importance des trois éléments cumulatifs (fait générateur, dommage, lien de causalité) et des causes d'exonération. Elle pourra également ouvrir sur les enjeux contemporains ou l'évolution future de la responsabilité civile extracontractuelle."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 2 / Bachelor 2nd Year (L2)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Ce chapitre traite du régime de la responsabilité civile extracontractuelle (art. 1240 et suivants du Code civil). Nous analyserons les trois éléments cumulatifs : le fait générateur (faute, fait des choses, fait d'autrui), le dommage réparable et le lien de causalité, ainsi que les causes d'exonération. Intègre une conclusion générale synthétisant le cours.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.