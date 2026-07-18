You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : L'IA, une Révolution en Marche",
      "description": "Présenter l'objectif du cours, l'importance de l'IA dans le monde contemporain et les questions fondamentales qu'elle soulève. Établir le plan de la leçon et susciter l'intérêt des étudiants."
    },
    {
      "heading": "## Les Racines de l'Intelligence Artificielle : De la Philosophie aux Mathématiques",
      "description": "Expliquer les origines philosophiques de l'IA (ex: Descartes, Leibniz, la question de l'esprit et du corps, la logique) et ses fondements mathématiques (ex: logique formelle, calculabilité, Turing et la machine de Turing). Mettre en évidence la quête millénaire de la reproduction de l'intelligence."
    },
    {
      "heading": "## Les Grands Paradigmes de l'IA : Symbolique vs. Connexionniste",
      "description": "Décrire les deux écoles de pensée majeures qui ont structuré le champ de l'IA : l'IA symbolique (systèmes experts, logique, représentation des connaissances) et l'IA connexionniste (réseaux de neurones, apprentissage par l'exemple). Mettre en lumière leurs principes, leurs forces et leurs limites initiales."
    },
    {
      "heading": "## Jalons Historiques et Évolutions Clés de l'IA",
      "description": "Parcourir les moments décisifs de l'histoire de l'IA, depuis la conférence de Dartmouth (1956) jusqu'aux 'hivers de l'IA' et la renaissance récente, en mentionnant des figures et des réalisations emblématiques sans entrer dans les détails techniques des algorithmes."
    },
    {
      "heading": "## Défis Fondamentaux et Promesses d'une IA Responsable",
      "description": "Aborder les défis éthiques, sociaux, techniques (ex: explicabilité, robustesse, biais) et les limites actuelles de l'IA. Discuter des promesses et du potentiel transformateur de l'IA pour la société et l'économie, en insistant sur la nécessité d'une approche responsable et éthique."
    },
    {
      "heading": "## Conclusion : Vers une Intelligence Artificielle Augmentée",
      "description": "Récapituler les points clés abordés concernant la genèse et les paradigmes de l'IA. Ouvrir la discussion sur les perspectives futures de l'IA, son rôle dans l'évolution technologique et les questions qu'elle continuera de poser, en préparant le terrain pour des cours plus techniques."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des origines philosophiques et mathématiques de l'IA, des grandes écoles de pensée (symbolique vs connexionniste) et des jalons historiques majeurs. Discussion des défis fondamentaux et des promesses de l'IA, sans entrer dans les détails algorithmiques.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.