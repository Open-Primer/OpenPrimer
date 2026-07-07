You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la circulation atmosphérique et océanique",
      "description": "Présenter l'importance de la circulation atmosphérique et océanique comme moteurs fondamentaux des climats mondiaux. Définir les concepts clés et les objectifs d'apprentissage de la leçon."
    },
    {
      "heading": "## Les mécanismes de la circulation atmosphérique",
      "description": "Expliquer les forces motrices de la circulation atmosphérique: le rôle du rayonnement solaire différentiel, les gradients de pression et de température. Détailler l'effet de Coriolis et ses conséquences sur les vents dominants (alizés, vents d'ouest)."
    },
    {
      "heading": "## La dynamique de la circulation océanique",
      "description": "Décrire les principaux types de courants océaniques (superficiels et profonds). Expliquer les forces qui les animent: vent, salinité, température (circulation thermohaline). Présenter les grandes boucles océaniques."
    },
    {
      "heading": "## Impact sur les zones climatiques et les phénomènes extrêmes",
      "description": "Analyser comment la circulation atmosphérique et océanique détermine la répartition des grandes zones climatiques mondiales. Expliquer la formation et la dynamique de phénomènes météorologiques extrêmes (cyclones, moussons, sécheresses)."
    },
    {
      "heading": "## Les couplages océan-atmosphère: l'exemple d'El Niño",
      "description": "Approfondir l'étude des interactions complexes entre l'océan et l'atmosphère. Utiliser le phénomène El Niño-Oscillation Australe (ENSO) comme cas d'étude pour illustrer ces couplages et leurs impacts climatiques à l'échelle planétaire."
    },
    {
      "heading": "## Conclusion et perspectives",
      "description": "Récapituler les points essentiels de la leçon sur l'interdépendance des circulations atmosphérique et océanique. Souligner leur rôle crucial dans la régulation climatique et ouvrir sur les enjeux futurs liés au changement climatique."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Explication des forces de Coriolis, des gradients de pression et de température, et de leur impact sur la formation des zones climatiques et des phénomènes météorologiques extrêmes. Analyse des couplages océan-atmosphère (ex: El Niño).".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.