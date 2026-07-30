You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : La Grèce Antique et l'Émergence des Cités-États",
      "description": "Présenter brièvement la Grèce antique comme le berceau de la civilisation occidentale. Introduire la notion de cité-État (Polis) comme forme d'organisation politique et sociale fondamentale. Annoncer les objectifs du cours : comprendre la Polis, la citoyenneté, et comparer les modèles d'Athènes et de Sparte."
    },
    {
      "heading": "## La Polis : Définition et Citoyenneté",
      "description": "Expliquer en détail ce qu'est une Polis (ville, territoire, communauté de citoyens). Décrire l'organisation typique d'une cité-État (acropole, agora, murailles). Aborder la notion de citoyenneté en Grèce antique : qui est citoyen, quels sont ses droits et devoirs, et qui en est exclu (femmes, esclaves, métèques)."
    },
    {
      "heading": "## Athènes : Le Berceau de la Démocratie",
      "description": "Présenter Athènes comme un exemple majeur de Polis. Décrire son système politique démocratique (assemblée du peuple, boule, héliée), en soulignant ses principes et son fonctionnement. Évoquer la vie quotidienne, la culture, les arts et la philosophie athénienne, ainsi que le rôle des citoyens dans cette société."
    },
    {
      "heading": "## Sparte : L'Oligarchie Militaire",
      "description": "Présenter Sparte comme un contre-exemple frappant d'Athènes. Décrire son système politique oligarchique et son organisation sociale rigide, centrée sur l'éducation militaire (agogé) et la discipline. Expliquer le rôle des différentes classes sociales (Homoioi, Périèques, Hilotes) et l'importance de l'armée dans la vie spartiate."
    },
    {
      "heading": "## Athènes et Sparte : Deux Modèles, Des Interactions",
      "description": "Comparer les deux cités-États sur des points clés : politique, société, économie, culture et valeurs. Mettre en évidence leurs différences fondamentales et leurs quelques similitudes. Aborder brièvement les périodes de coopération et de conflit (notamment les guerres médiques et la guerre du Péloponnèse) qui ont marqué leurs relations."
    },
    {
      "heading": "## Conclusion : L'Héritage des Cités-États Grecques",
      "description": "Récapituler les points essentiels du cours : l'importance de la Polis, la diversité des modèles politiques (démocratie athénienne, oligarchie spartiate) et la notion de citoyenneté. Souligner l'influence durable de ces concepts et de ces civilisations sur l'histoire et la pensée politique occidentale."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Middle School (secondary_1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Étude de la notion de Polis, de la citoyenneté, et comparaison des modèles athénien (démocratie) et spartiate (oligarchie), en soulignant leurs spécificités et leurs interactions.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.