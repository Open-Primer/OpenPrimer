You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Fondements de l'Astrophysique",
      "description": "Présenter les objectifs du chapitre, son importance dans le cadre de l'astrophysique moderne et un aperçu des thèmes abordés : lumière, gravitation et évolution stellaire."
    },
    {
      "heading": "## Le Rayonnement Électromagnétique et l'Analyse Spectrale",
      "description": "Expliquer la nature du rayonnement électromagnétique comme vecteur d'information en astrophysique. Détailler le concept de corps noir, les lois de Wien et de Stefan-Boltzmann. Aborder les principes de l'analyse spectrale (spectres d'émission, d'absorption, continu) et leur utilisation pour déterminer la composition, la température et la vitesse des objets célestes."
    },
    {
      "heading": "## Le Diagramme de Hertzsprung-Russell et l'Évolution Stellaire",
      "description": "Introduire le diagramme de Hertzsprung-Russell (HR) comme outil fondamental pour classer les étoiles et comprendre leur évolution. Décrire les différentes régions du diagramme (séquence principale, géantes, naines blanches) et expliquer les grandes étapes de la vie d'une étoile, de sa formation à sa mort, en lien avec sa masse initiale."
    },
    {
      "heading": "## La Gravitation : De Newton à la Relativité Générale",
      "description": "Revoir les principes de la gravitation newtonienne et son application aux systèmes stellaires et galactiques. Introduire les limites de la gravitation newtonienne et présenter les concepts fondamentaux de la relativité générale d'Einstein, en soulignant son importance pour la compréhension des phénomènes astrophysiques extrêmes (trous noirs, ondes gravitationnelles) et la cosmologie."
    },
    {
      "heading": "## Conclusion : Synthèse et Perspectives",
      "description": "Récapituler les concepts clés abordés dans le chapitre (lumière, gravitation, évolution stellaire). Souligner l'interconnexion de ces fondements pour l'étude de l'univers. Ouvrir sur les chapitres suivants et les questions non résolues en astrophysique moderne."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 2 / Bachelor 2nd Year (L2)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Ce chapitre pose les bases de l'astrophysique moderne. Nous étudierons la nature du rayonnement électromagnétique (corps noir, lois de Wien et Stefan-Boltzmann), l'analyse spectrale et le diagramme de Hertzsprung-Russell (HR). Nous analyserons également la dynamique de la gravitation de Newton à la relativité générale.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.