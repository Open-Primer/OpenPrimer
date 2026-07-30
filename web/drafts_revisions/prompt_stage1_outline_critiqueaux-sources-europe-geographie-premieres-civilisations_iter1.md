You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Aux sources de l'Europe",
      "description": "Présenter l'objectif de la leçon, l'importance de la Grèce antique comme berceau de la civilisation européenne et les thèmes abordés : géographie, premières civilisations et mythes fondateurs."
    },
    {
      "heading": "## La Grèce antique : Un carrefour géographique et temporel",
      "description": "Décrire la géographie de la Grèce (montagnes, mer, îles), son influence sur le développement des sociétés et des échanges, et situer chronologiquement la période étudiée (de l'âge du bronze à l'émergence des cités)."
    },
    {
      "heading": "## Les civilisations égéennes : Minoens et Mycéniens",
      "description": "Présenter les caractéristiques principales de la civilisation minoenne (Crète, palais de Knossos, écriture linéaire A, thalassocratie) et de la civilisation mycénienne (Grèce continentale, citadelles fortifiées, écriture linéaire B, influence militaire), leurs différences, leurs interactions et leur déclin."
    },
    {
      "heading": "## Les mythes fondateurs : Récits et héritages",
      "description": "Expliquer le rôle des mythes dans la société grecque antique (explications du monde, valeurs morales, héros) et présenter quelques mythes clés liés aux origines ou à des figures emblématiques de cette période (ex: Thésée et le Minotaure, la guerre de Troie)."
    },
    {
      "heading": "## Conclusion : Un héritage durable",
      "description": "Récapituler les points clés de la leçon (importance de la géographie, richesse des premières civilisations, rôle des mythes) et ouvrir sur la suite de l'histoire grecque (âge obscur, naissance des cités-États)."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Middle School (secondary_1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des cadres spatio-temporels de la Grèce antique, des civilisations minoenne et mycénienne, et des mythes fondateurs comme point de départ de l'histoire grecque.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.