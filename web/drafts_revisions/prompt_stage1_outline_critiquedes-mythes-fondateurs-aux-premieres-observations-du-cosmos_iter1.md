You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Le cosmos, de l'imaginaire à la science",
      "description": "Présenter l'objectif du cours : retracer l'évolution de notre compréhension du cosmos, des récits mythologiques aux premières approches scientifiques. Souligner l'importance de cette transition pour la cosmologie moderne."
    },
    {
      "heading": "## Les premières visions du cosmos : Mythes et modèles géocentriques",
      "description": "Décrire les cosmologies des civilisations antiques (Égypte, Mésopotamie, Grèce) et leur nature mythologique ou philosophique. Expliquer le modèle géocentrique d'Aristote et Ptolémée, dominant durant l'Antiquité et le Moyen Âge, et ses limites."
    },
    {
      "heading": "## Le tournant héliocentrique : Nicolas Copernic",
      "description": "Expliquer le contexte et les motivations de Copernic pour proposer le modèle héliocentrique. Décrire les principes de ce nouveau modèle et ses implications initiales, en soulignant qu'il s'agissait encore d'un modèle mathématique sans preuve observationnelle directe."
    },
    {
      "heading": "## L'ère des observations et des lois empiriques : Kepler et Galilée",
      "description": "Présenter les travaux de Tycho Brahe et l'importance de ses observations précises. Expliquer les trois lois de Kepler sur le mouvement planétaire et leur rôle dans la description quantitative du système solaire. Aborder les découvertes de Galilée avec la lunette astronomique et leur impact sur la validation du modèle héliocentrique et la remise en question des dogmes aristotéliciens."
    },
    {
      "heading": "## La naissance de la cosmologie scientifique : L'unification newtonienne",
      "description": "Expliquer comment Isaac Newton, avec sa loi de la gravitation universelle, a unifié les lois de Kepler et la physique terrestre. Montrer comment cette loi a permis de comprendre les mécanismes sous-jacents aux mouvements célestes et a posé les bases d'une cosmologie basée sur des principes physiques universels et vérifiables."
    },
    {
      "heading": "## Conclusion : Héritage et prélude à la cosmologie moderne",
      "description": "Récapituler les étapes clés de la transition des mythes à la science. Souligner l'importance de cette période pour l'établissement de la méthode scientifique en astronomie et en cosmologie. Ouvrir sur les questions qui émergeront après Newton et qui mèneront à la cosmologie moderne."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 2 / Bachelor 2nd Year (L2)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des cosmologies antiques et médiévales, révolution copernicienne, lois de Kepler, et la naissance de la cosmologie scientifique.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.