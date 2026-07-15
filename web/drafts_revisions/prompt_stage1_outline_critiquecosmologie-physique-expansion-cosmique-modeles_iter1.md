You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction à la Cosmologie Physique",
      "description": "Présenter le chapitre, son importance dans le cadre de l'astrophysique moderne, et les grandes questions auxquelles la cosmologie physique tente de répondre. Introduire brièvement les concepts clés qui seront abordés."
    },
    {
      "heading": "## L'Expansion de l'Univers et la Loi de Hubble-Lemaître",
      "description": "Expliquer le concept d'expansion de l'Univers. Détailler la découverte et la signification de la loi de Hubble-Lemaître, incluant la notion de constante de Hubble et ses implications pour l'âge de l'Univers. Aborder les observations qui ont mené à cette loi."
    },
    {
      "heading": "## La Relativité Générale et la Métrique de Friedmann-Lemaître-Robertson-Walker",
      "description": "Introduire les principes fondamentaux de la Relativité Générale nécessaires à la cosmologie. Expliquer comment la métrique FLRW est dérivée des équations d'Einstein pour un Univers homogène et isotrope. Discuter des paramètres clés de la métrique (facteur d'échelle, courbure spatiale)."
    },
    {
      "heading": "## Les Preuves Observationnelles et la Composition de l'Univers",
      "description": "Présenter les principales preuves observationnelles du modèle cosmologique standard. Détailler le fond diffus cosmologique (CMB) : sa découverte, ses propriétés et son rôle crucial. Expliquer les concepts de matière noire et d'énergie sombre, leurs évidences observationnelles et leur rôle dominant dans la composition de l'Univers."
    },
    {
      "heading": "## Modèles Cosmologiques et le Destin de l'Univers",
      "description": "Discuter des différents modèles cosmologiques basés sur la métrique FLRW et la composition de l'Univers. Aborder les scénarios possibles pour le destin futur de l'Univers (Big Crunch, Big Freeze, Big Rip) en fonction des paramètres cosmologiques actuels."
    },
    {
      "heading": "## Conclusion Générale",
      "description": "Synthétiser les points clés abordés dans le chapitre. Récapituler les avancées majeures de la cosmologie physique et les questions ouvertes. Mettre en perspective l'importance de ces connaissances pour notre compréhension de l'Univers."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 2 / Bachelor 2nd Year (L2)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Ce chapitre explore l'Univers à grande échelle. Nous aborderons la loi de Hubble-Lemaître, la métrique de Friedmann-Lemaître-Robertson-Walker (FLRW) issue de la Relativité Générale, le fond diffus cosmologique (CMB), ainsi que la composition de l'Univers (matière noire et énergie sombre). Intègre une conclusion générale synthétisant le cours.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.