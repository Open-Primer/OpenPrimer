You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction: Contexte et enjeux de l'étude",
      "description": "Présenter l'objectif du cours, l'importance de l'approche épistémologique et historique pour comprendre les sciences de la Terre et du climat, et la structure générale de la leçon."
    },
    {
      "heading": "## Les fondements historiques des sciences de la Terre",
      "description": "Explorer les origines de la géographie physique, de la géologie et de la géomorphologie, en mettant en lumière les premières observations, les théories pré-scientifiques et l'émergence des paradigmes fondateurs (catastrophisme, uniformitarisme)."
    },
    {
      "heading": "## L'évolution de la pensée climatologique",
      "description": "Tracer l'histoire de la climatologie, depuis les premières descriptions des climats jusqu'à l'établissement de la météorologie scientifique, en passant par les grandes découvertes instrumentales et théoriques (circulation atmosphérique, cycles hydrologiques)."
    },
    {
      "heading": "## Concepts clés et figures emblématiques: Une analyse épistémologique",
      "description": "Analyser les concepts fondamentaux qui ont structuré ces disciplines (ex: temps géologique, dérive des continents, effet de serre) et présenter les contributions majeures de figures scientifiques marquantes (ex: Lyell, Wegener, Arrhenius, Köppen), en soulignant les ruptures et continuités épistémologiques."
    },
    {
      "heading": "## Conclusion: Perspectives et défis contemporains",
      "description": "Récapituler les points clés de l'évolution des sciences de la Terre et du climat, souligner l'importance de cette perspective historique pour les défis actuels (changement climatique, gestion des risques), et ouvrir sur les futures directions de recherche."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Analyse épistémologique des fondements de la géographie physique et de la climatologie, contextualisation historique des concepts clés et des figures emblématiques.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.