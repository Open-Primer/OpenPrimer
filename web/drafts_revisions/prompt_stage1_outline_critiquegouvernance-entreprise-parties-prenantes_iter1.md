You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Gouvernance d'Entreprise et aux Parties Prenantes",
      "description": "Présenter le contexte et l'importance de la gouvernance d'entreprise et des théories des parties prenantes dans le management stratégique contemporain. Définir les concepts clés et annoncer la structure du cours."
    },
    {
      "heading": "## Les Fondements et Modèles de la Gouvernance d'Entreprise",
      "description": "Expliquer les origines et les différentes définitions de la gouvernance d'entreprise. Aborder les principaux modèles (anglo-saxon, continental, etc.), les mécanismes de contrôle (conseil d'administration, actionnariat) et les enjeux liés à la séparation propriété-gestion."
    },
    {
      "heading": "## La Théorie des Parties Prenantes: Identification et Gestion",
      "description": "Développer la théorie des parties prenantes, en expliquant qui sont les parties prenantes (internes, externes), comment les identifier et les classer (pouvoir, légitimité, urgence). Analyser les différentes approches de gestion des relations avec les parties prenantes et leur intégration dans la stratégie."
    },
    {
      "heading": "## Intégration de la Gouvernance et des Parties Prenantes: Enjeux Stratégiques",
      "description": "Examiner comment la gouvernance d'entreprise et la prise en compte des parties prenantes s'articulent. Discuter des défis et des opportunités liés à cette intégration, notamment en termes de performance organisationnelle, de responsabilité sociale des entreprises (RSE) et de légitimité."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler les points essentiels abordés dans le cours. Ouvrir sur les tendances actuelles et futures de la gouvernance d'entreprise et de la gestion des parties prenantes, ainsi que sur les questions de recherche émergentes."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Compréhension des différentes approches de la gouvernance et de la prise en compte des intérêts des diverses parties prenantes dans la stratégie.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.