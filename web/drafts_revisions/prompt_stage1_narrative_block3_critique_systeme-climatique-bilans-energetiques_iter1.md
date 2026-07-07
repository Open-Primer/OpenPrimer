You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion: Synthèse et perspectives

Ce parcours à travers les mécanismes du système climatique terrestre a mis en lumière la complexité et la délicatesse du [[WIDGET:ConceptLink:bilan_energetique:bilan énergétique]] planétaire. Nous avons exploré comment l'énergie solaire incidente est absorbée et réémise, et comment cette dynamique est fondamentalement modulée par la [[WIDGET:ConceptLink:composition_atmospherique:composition atmosphérique]]. La présence de certains [[WIDGET:Glossary:gaz_effet_serre:gaz à effet de serre]] (GES) tels que le dioxyde de carbone et la vapeur d'eau est apparue comme un facteur déterminant, permettant à la Terre de maintenir une température moyenne de surface propice à la vie, bien au-delà de la température théorique d'équilibre sans atmosphère [ref2].

L'interdépendance entre ces éléments est cruciale : le rayonnement solaire fournit l'énergie, l'atmosphère régule sa distribution et sa rétention, et les processus terrestres et océaniques redistribuent la chaleur. Toute perturbation de cette harmonie, notamment par une augmentation des concentrations de GES d'origine anthropique, peut entraîner un déséquilibre du bilan énergétique et, par conséquent, un réchauffement global, phénomène au cœur du [[WIDGET:ConceptLink:changement_climatique:changement climatique]] actuel [ref6]. La compréhension approfondie de ces concepts fondamentaux est donc indispensable non seulement pour analyser les défis environnementaux contemporains, mais aussi pour anticiper les évolutions futures et élaborer des stratégies d'atténuation et d'adaptation efficaces. Ces bases constituent un socle essentiel pour toute étude ultérieure en géographie physique, en climatologie et en sciences de l'environnement.

[[WIDGET:Mermaid:climate_system_interdependence]]
mermaid
graph TD
    A[Rayonnement Solaire Incident] --> B(Bilan Énergétique Terrestre)
    C[Composition Atmosphérique] --> B
    B -- Détermine --> D(Température Moyenne de Surface)
    D -- Influence --> E[Cycles Biogéochimiques]
    E -- Modifie --> C
    F[Activités Anthropiques] --> C
    C -- Rôle Clé --> G[Effet de Serre Naturel]
    G -- Régule --> D
    F --> H[Changement Climatique]
    H -- Perturbe --> B

*Diagramme conceptuel illustrant l'interdépendance des composantes du système climatique et l'impact des activités humaines.*

[[WIDGET:conclusionSummary]]
[[WIDGET:whatsNext]]
[[WIDGET:goingFurther]]
[[WIDGET:finalEvaluation]]
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, etc. inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format).
4. No figure prefixes like "Figure 1:" in visual captions.
5. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 1-2 block widgets (Image, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.
6. Valid ## Conclusion section with at least two paragraphs and the required conclusion widgets.

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