You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la politique budgétaire et à la dette publique",
      "description": "Présenter les objectifs du cours, définir la politique budgétaire et la dette publique, et introduire les enjeux de leur gestion dans une économie moderne."
    },
    {
      "heading": "## Les mécanismes de financement des dépenses publiques",
      "description": "Expliquer les différentes sources de financement des dépenses publiques (impôts, emprunts, création monétaire) et analyser leurs implications économiques et sociales. Aborder les concepts de déficit et d'excédent budgétaire."
    },
    {
      "heading": "## Impact des impôts et de la dette sur l'activité économique",
      "description": "Analyser les effets macroéconomiques des impôts (distorsions, incitations) et de la dette publique (effet d'éviction, richesse nette, transmission intergénérationnelle) sur la croissance, l'investissement et la consommation."
    },
    {
      "heading": "## La soutenabilité de la dette publique",
      "description": "Définir la soutenabilité budgétaire et présenter les critères et indicateurs permettant de l'évaluer. Discuter les risques associés à une dette non soutenable et les stratégies de consolidation budgétaire."
    },
    {
      "heading": "## Conclusion et perspectives",
      "description": "Récapituler les points clés abordés, souligner les défis actuels de la politique budgétaire et de la gestion de la dette, et ouvrir sur les débats contemporains et les pistes de recherche."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Financement des dépenses publiques, effets des impôts et de la dette sur l'activité économique, soutenabilité budgétaire.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.