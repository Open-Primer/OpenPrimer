You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux concepts fondamentaux",
      "description": "Présenter le contexte général des nanotechnologies et de l'ingénierie moléculaire, définir les objectifs d'apprentissage de la leçon et souligner l'importance des concepts abordés pour la compréhension des phénomènes à l'échelle nanométrique."
    },
    {
      "heading": "## La dualité onde-particule à l'échelle nanométrique",
      "description": "Expliquer le concept de dualité onde-particule, en se concentrant sur les preuves expérimentales et les implications pour les systèmes à l'échelle nanométrique (par exemple, microscopie électronique, confinement quantique). Aborder les équations fondamentales (De Broglie, Schrödinger simplifiée) sans entrer dans des résolutions complexes."
    },
    {
      "heading": "## Densité d'états dans les systèmes de basse dimensionnalité",
      "description": "Définir la densité d'états (DOS) et expliquer son importance pour les propriétés électroniques et optiques des matériaux. Comparer la DOS en 3D, 2D (puits quantiques), 1D (fils quantiques) et 0D (points quantiques), en illustrant comment la réduction de dimensionnalité modifie les propriétés physiques."
    },
    {
      "heading": "## Le potentiel de Lennard-Jones et les interactions intermoléculaires",
      "description": "Introduire le potentiel de Lennard-Jones comme modèle fondamental pour décrire les interactions attractives et répulsives entre atomes et molécules. Expliquer les termes du potentiel, son application dans la modélisation des matériaux nanostructurés et son rôle dans l'auto-assemblage et la stabilité des nanostructures."
    },
    {
      "heading": "## Conclusion et perspectives",
      "description": "Récapituler les concepts clés abordés (dualité onde-particule, DOS, potentiel de Lennard-Jones) et leur interconnexion. Ouvrir sur les applications concrètes de ces concepts en nanotechnologie et ingénierie moléculaire, et suggérer des pistes pour des études plus avancées."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Rigorous undergraduate treatment of wave-particle duality, density of states in low-dimensional systems, and Lennard-Jones potential.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.