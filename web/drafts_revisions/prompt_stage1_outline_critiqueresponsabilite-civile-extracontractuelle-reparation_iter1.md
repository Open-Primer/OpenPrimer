You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la responsabilité civile extracontractuelle",
      "description": "Présenter la notion de responsabilité civile extracontractuelle, sa distinction avec la responsabilité contractuelle, son fondement légal (articles 1240 et suivants du Code civil) et l'objectif de la réparation des dommages."
    },
    {
      "heading": "## Le fait générateur de responsabilité",
      "description": "Détailler les différentes catégories de faits générateurs : la responsabilité du fait personnel (faute), la responsabilité du fait des choses (garde d'une chose), et la responsabilité du fait d'autrui (parents, commettants, etc.). Expliquer les conditions propres à chaque type de fait générateur."
    },
    {
      "heading": "## Le dommage réparable et le lien de causalité",
      "description": "Analyser la notion de dommage réparable (matériel, corporel, moral), ses caractères (certain, direct, légitime). Expliquer ensuite le lien de causalité entre le fait générateur et le dommage, et les différentes théories de la causalité (équivalence des conditions, causalité adéquate)."
    },
    {
      "heading": "## Les causes d'exonération de responsabilité",
      "description": "Présenter les principales causes d'exonération de responsabilité : la force majeure, le fait d'un tiers et la faute de la victime. Expliquer leurs conditions d'application et leurs effets sur l'obligation de réparation."
    },
    {
      "heading": "## Conclusion générale",
      "description": "Synthétiser les points clés du cours sur la responsabilité civile extracontractuelle, rappeler l'importance de ses trois éléments cumulatifs et des causes d'exonération, et ouvrir sur les enjeux contemporains ou les évolutions jurisprudentielles en la matière."
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