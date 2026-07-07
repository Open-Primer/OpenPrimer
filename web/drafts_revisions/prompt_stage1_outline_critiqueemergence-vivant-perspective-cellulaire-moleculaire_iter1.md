You are the Outline Critic Agent. Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Aux Origines du Vivant",
      "description": "Présenter l'objectif du cours, son importance dans le cadre de la biologie cellulaire et moléculaire, et un aperçu des thèmes abordés : l'histoire de la théorie cellulaire, les propriétés du vivant et les molécules fondamentales."
    },
    {
      "heading": "## La Théorie Cellulaire : Un Pilier de la Biologie",
      "description": "Expliquer le développement historique de la théorie cellulaire, des premières observations microscopiques aux contributions de Schleiden, Schwann et Virchow. Aborder les principes fondamentaux de cette théorie et son impact épistémologique sur la compréhension du vivant."
    },
    {
      "heading": "## Les Caractéristiques Fondamentales du Vivant",
      "description": "Décrire les propriétés essentielles qui définissent un organisme vivant au niveau cellulaire et moléculaire : organisation, métabolisme, homéostasie, reproduction, croissance, réponse aux stimuli et adaptation. Illustrer ces concepts par des exemples simples."
    },
    {
      "heading": "## Les Molécules du Vivant : Glucides et Lipides",
      "description": "Introduire les deux premières grandes classes de molécules biologiques. Pour les glucides : structure, classification (mono-, di-, polysaccharides) et rôles (énergie, structure). Pour les lipides : structure générale, types (triglycérides, phospholipides, stéroïdes) et fonctions (énergie, membranes, signalisation)."
    },
    {
      "heading": "## Les Molécules du Vivant : Protéines et Acides Nucléiques",
      "description": "Poursuivre avec les deux autres classes majeures. Pour les protéines : structure (acides aminés, niveaux de structure), diversité des fonctions (enzymes, transport, structure, défense). Pour les acides nucléiques (ADN, ARN) : structure (nucléotides), rôles (information génétique, expression génique)."
    },
    {
      "heading": "## Conclusion : L'Unité et la Diversité du Monde Cellulaire",
      "description": "Récapituler les points clés abordés : l'importance de la cellule comme unité fondamentale, les caractéristiques universelles du vivant et le rôle central des molécules biologiques. Ouvrir sur les perspectives des cours futurs en biologie cellulaire et moléculaire."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Vue d'ensemble historique et épistémologique de la théorie cellulaire, introduction aux caractéristiques fondamentales du vivant et aux grandes classes de molécules biologiques (glucides, lipides, protéines, acides nucléiques).".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.