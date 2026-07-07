You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Qu'est-ce que l'Histoire contemporaine ?",
      "description": "Présenter l'objectif du cours, introduire la notion d'Histoire contemporaine comme champ d'étude spécifique et problématiser d'emblée la difficulté de sa définition et de ses limites chronologiques."
    },
    {
      "heading": "## Définir l'Histoire contemporaine : Enjeux et spécificités",
      "description": "Expliquer les raisons de l'émergence de l'Histoire contemporaine comme discipline autonome. Aborder les premières tentatives de définition et les critères distinctifs (proximité temporelle, abondance des sources, rôle du témoin, etc.)."
    },
    {
      "heading": "## Les débats de périodisation et les enjeux épistémologiques",
      "description": "Analyser les différentes propositions de périodisation de l'Histoire contemporaine (Révolution française, 1848, 1870, 1914, 1945, etc.) et leurs implications. Discuter des défis méthodologiques et épistémologiques liés à l'étude du 'temps présent' (objectivité, recul critique, rapport au politique)."
    },
    {
      "heading": "## Courants historiographiques et textes fondateurs de la contemporanéité",
      "description": "Présenter les principaux courants historiographiques qui ont marqué l'étude de l'Histoire contemporaine (Annales, histoire sociale, histoire culturelle, histoire globale, etc.). Examiner des extraits de textes fondateurs qui ont contribué à penser la notion de contemporanéité et ses ruptures."
    },
    {
      "heading": "## Conclusion : L'Histoire contemporaine, un chantier permanent",
      "description": "Récapituler les points clés abordés, souligner la nature évolutive et constamment redéfinie de l'Histoire contemporaine. Ouvrir sur les perspectives de recherche actuelles et l'importance d'une approche critique et réflexive."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des enjeux épistémologiques de l'histoire contemporaine, discussion des périodisations et des grands courants historiographiques. Examen de textes fondateurs sur la notion de contemporanéité.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.