You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Aux sources de la civilisation grecque",
      "description": "Cette section introduira la Grèce antique comme le berceau d'une civilisation riche et influente, posant les bases de la découverte de ses contributions majeures dans les arts et la pensée."
    },
    {
      "heading": "## Le Théâtre grec : Miroir de la société et de l'âme",
      "description": "Cette section explorera les origines et l'importance du théâtre dans la vie grecque, en présentant les genres principaux (tragédie, comédie) et des exemples d'auteurs et d'œuvres marquantes."
    },
    {
      "heading": "## L'Architecture et la Sculpture : Beauté et harmonie",
      "description": "Cette section se concentrera sur les réalisations architecturales emblématiques (temples, acropoles) et les principes de la sculpture grecque, soulignant leur esthétique et leur symbolisme."
    },
    {
      "heading": "## La Pensée philosophique : Les fondements de la raison",
      "description": "Cette section présentera les figures majeures de la philosophie grecque (Socrate, Platon, Aristote) et leurs contributions essentielles à la pensée, à la logique et à l'éthique."
    },
    {
      "heading": "## L'Héritage grec : Une influence intemporelle",
      "description": "Cette section mettra en lumière la persistance de l'héritage grec dans le monde contemporain, en montrant comment ses concepts artistiques, philosophiques et politiques continuent d'inspirer."
    },
    {
      "heading": "## Conclusion : L'éclat durable de la Grèce antique",
      "description": "Cette section récapitulera les points clés abordés, soulignant l'impact profond et durable de la civilisation grecque antique sur le développement de la culture occidentale et mondiale."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Middle School (secondary_1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Découverte des grandes formes d'expression artistique (théâtre, sculpture, architecture) et des fondements de la pensée philosophique grecque, intégrant une conclusion générale sur l'héritage durable de la civilisation grecque antique dans le monde contemporain.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.