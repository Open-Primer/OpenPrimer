You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Pourquoi étudier l'Histoire contemporaine ?",
      "description": "Présenter le cours et les objectifs de la leçon. Expliquer la pertinence et les défis spécifiques de l'étude de l'histoire la plus récente, en soulignant la nécessité d'une approche critique et réflexive. Annoncer la structure de la leçon."
    },
    {
      "heading": "## Définir l'Histoire contemporaine : Objets et spécificités",
      "description": "Explorer les différentes acceptions du terme 'contemporain' en histoire. Discuter des caractéristiques propres à cette période (proximité avec les événements, abondance des sources, rôle de la mémoire, etc.) et des objets d'étude privilégiés par les historiens du temps présent."
    },
    {
      "heading": "## Les enjeux de la périodisation : Quand commence le 'contemporain' ?",
      "description": "Analyser les débats autour des dates charnières marquant le début de l'époque contemporaine (1789, 1815, 1914, 1945, etc.). Examiner les critères et les implications de ces choix chronologiques sur la compréhension des processus historiques."
    },
    {
      "heading": "## Courants historiographiques et débats épistémologiques",
      "description": "Présenter les principales écoles et approches historiographiques qui ont marqué l'étude de l'histoire contemporaine (Annales, histoire culturelle, histoire globale, etc.). Aborder les questions épistémologiques fondamentales : objectivité, rapport au présent, rôle de l'historien, usage des témoignages."
    },
    {
      "heading": "## Textes fondateurs sur la notion de contemporanéité",
      "description": "Analyser des extraits de textes clés qui ont contribué à définir ou à problématiser la notion de contemporanéité et la pratique de l'histoire du temps présent. Mettre en lumière les apports de penseurs majeurs à la réflexion sur cette période."
    },
    {
      "heading": "## Conclusion : Perspectives et défis de l'historien du temps présent",
      "description": "Récapituler les principaux points abordés concernant la définition, la périodisation et les enjeux de l'histoire contemporaine. Ouvrir sur les défis actuels et futurs de la discipline et l'importance de son rôle dans la compréhension du monde actuel."
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