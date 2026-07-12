You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction : Le cosmos, de l'imaginaire à la science

Depuis l'aube de l'humanité, le ciel étoilé a suscité émerveillement, crainte et interrogation. Comment interpréter ces lumières lointaines ? Quelle est la place de l'homme dans cet univers infini ? Ce cours d'[[WIDGET:ConceptLink:cosmologie:Cosmologie]] moderne se propose de retracer l'extraordinaire voyage de notre compréhension du cosmos, depuis les récits fondateurs de la [[WIDGET:Glossary:mythologie:mythologie]] jusqu'aux modèles scientifiques les plus sophistiqués. Nous explorerons comment l'humanité est passée d'une vision du monde imprégnée de divinités et de symboles à une approche rationnelle et empirique, jetant les bases de la cosmologie contemporaine. Cette transition, marquée par des révolutions intellectuelles et des avancées technologiques, est fondamentale pour appréhender les défis et les découvertes actuelles de cette discipline fascinante, comme l'illustre si bien l'œuvre de chercheurs tels que [[WIDGET:RealPerson:luminet:Jean-Pierre Luminet]] [[WIDGET:Reference:1]].

[[WIDGET:Mermaid:evolution_cosmology_timeline:Frise chronologique simplifiée de l'évolution de la compréhension du cosmos, des mythes aux théories modernes]]

## Les premières visions du cosmos : Mythes et modèles géocentriques

Les civilisations antiques ont développé des cosmologies riches et variées, souvent inextricablement liées à leurs systèmes religieux et philosophiques. En Égypte ancienne, le cosmos était perçu comme un ensemble ordonné, né du chaos primordial, où la déesse du ciel, Nout, s'arquant au-dessus de Geb, le dieu de la terre, symbolisait la voûte céleste. Les Mésopotamiens, quant à eux, concevaient un univers en forme de disque plat flottant sur un océan cosmique, avec des cieux solides abritant les dieux et les astres. Ces visions, bien que poétiques et structurantes pour leurs sociétés, étaient principalement narratives et symboliques, cherchant à donner un sens à l'existence plutôt qu'à décrire la réalité physique de manière objective.

C'est en Grèce antique que les premières tentatives de modélisation rationnelle du cosmos émergent. Des philosophes comme Thalès de Milet ou Anaximandre proposèrent des explications basées sur des principes naturels plutôt que sur des interventions divines. Cependant, c'est avec [[WIDGET:RealPerson:aristote:Aristote]] (IVe siècle av. J.-C.) que le modèle [[WIDGET:ConceptLink:geocentrisme:géocentrique]] prend une forme structurée et influente. Pour Aristote, la Terre, imparfaite et corruptible, était immobile au centre de l'univers, entourée de sphères célestes parfaites et immuables, portant les planètes et les étoiles. Ce modèle, en accord avec l'intuition humaine et la philosophie de l'époque, fut affiné et mathématisé par [[WIDGET:RealPerson:ptolemee:Ptolémée]] d'Alexandrie au IIe siècle de notre ère dans son œuvre majeure, l'*Almageste*. Ptolémée introduisit des concepts complexes comme les épicycles et les déférents pour expliquer les mouvements rétrogrades apparents des planètes, permettant ainsi de prédire leurs positions avec une précision remarquable pour l'époque.

[[WIDGET:Image:ptolemaic_system:Représentation schématique du système ptolémaïque, illustrant les épicycles et les déférents]]

Le modèle géocentrique d'Aristote et Ptolémée, soutenu par l'Église chrétienne et la pensée scolastique, domina la pensée cosmologique pendant près de quatorze siècles, de l'Antiquité jusqu'à la fin du Moyen Âge. Sa longévité s'explique par sa cohérence philosophique, sa capacité à rendre compte des observations (même si de manière complexe) et son adéquation avec la vision théologique de l'homme au centre de la création. Cependant, malgré ses raffinements, ce modèle présentait des limites intrinsèques : sa complexité croissante pour expliquer de nouvelles observations et son incapacité à fournir une explication physique satisfaisante aux mouvements célestes, ouvrant la voie aux révolutions cosmologiques ultérieures [[WIDGET:Reference:2]].
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 1-2 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.


Your audit must be in dual-mode:
- **"isGlobalRevision" MUST ONLY be set to true if the issues are widespread and catastrophic** (completely unparseable structure, severe length deficiency, or total failure of the block narrative requiring a complete full-text rewrite). If so, provide a comprehensive "globalCritique".
- **For standard, localized, or section-specific mistakes, you MUST set "isGlobalRevision": false**, and list ONLY the rejected sections requiring localized repair in the "sections" array.

Return ONLY a valid JSON object matching blockNarrativeAuditSchema:
```json
{
  "approved": boolean,
  "isGlobalRevision": boolean,
  "globalCritique": "detailed feedback explaining what to fix globally, or empty if approved/local repair",
  "sections": [
    // If approved is false and isGlobalRevision is false, list ONLY the specific sections that are rejected. Do NOT include approved sections.
    {
      "heading": "heading of the rejected section",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific section"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, isGlobalRevision MUST be false, globalCritique MUST be "", and sections MUST be empty.
2. If isGlobalRevision is true: approved MUST be false, isGlobalRevision MUST be true, globalCritique MUST describe the global issues, and sections MUST be empty.
3. If approved is false and isGlobalRevision is false: sections MUST ONLY contain sections that are rejected (with approved set to false). Any approved section MUST be strictly omitted from the array.