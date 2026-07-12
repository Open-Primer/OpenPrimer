You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux nanotechnologies médicales et à la nanorobotique",
      "description": "Présenter le champ des nanotechnologies appliquées à la médecine et introduire le concept de nanorobotique. Mettre en évidence l'importance de l'ingénierie à l'échelle nanométrique pour ces applications, en lien avec la diffusion cinétique et la biocompatibilité."
    },
    {
      "heading": "## Ingénierie de la diffusion cinétique et biocompatibilité des nanomatériaux",
      "description": "Expliquer les principes de la diffusion cinétique à l'échelle nanométrique dans les systèmes biologiques. Aborder les défis et les solutions liés à la biocompatibilité des nanomatériaux et des nanodispositifs, en se concentrant sur la chimie de surface et les interactions hôte-matériau."
    },
    {
      "heading": "## Conception et applications des nanorobots en médecine",
      "description": "Décrire les architectures et les mécanismes de propulsion des nanorobots. Illustrer leurs applications potentielles en diagnostic, administration de médicaments ciblée et chirurgie minimale invasive, en intégrant les concepts d'ingénierie avancée."
    },
    {
      "heading": "## Enjeux éthiques et seuils de nanotoxicologie",
      "description": "Analyser les implications éthiques, sociétales et réglementaires des nanotechnologies médicales et de la nanorobotique. Discuter des méthodes d'évaluation de la nanotoxicologie et des seuils de sécurité, en soulignant l'importance de la recherche responsable."
    },
    {
      "heading": "## Conclusion et perspectives d'avenir",
      "description": "Récapituler les points clés de la leçon. Projeter les avancées futures dans le domaine des nanotechnologies médicales et de la nanorobotique, tout en soulignant les défis scientifiques, techniques et éthiques restants."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 3 / Bachelor 3rd Year (L3)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "In-depth engineering of kinetic diffusion at the nanoscale, biocompatibility surface chemistry, and nanotoxicology thresholds.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.