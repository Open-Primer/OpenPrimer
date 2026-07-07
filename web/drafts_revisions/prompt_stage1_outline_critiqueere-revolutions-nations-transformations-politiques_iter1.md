You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : L'aube d'un monde nouveau",
      "description": "Introduire la période charnière de la fin du XVIIIe et du début du XIXe siècle comme une ère de bouleversements majeurs. Définir le concept d'« ère des révolutions » et de « révolutions atlantiques ». Présenter les objectifs du cours : comprendre les causes, les déroulements et les conséquences de ces transformations politiques et sociales."
    },
    {
      "heading": "## Les prémices des révolutions : Lumières, crises et contestations",
      "description": "Analyser les facteurs intellectuels (philosophie des Lumières), économiques, sociaux et politiques qui ont préparé le terrain aux révolutions. Étudier le cas de la Révolution américaine comme premier modèle de rupture avec l'ordre ancien, en soulignant ses principes fondateurs (indépendance, république, droits)."
    },
    {
      "heading": "## La Révolution française : De la rupture à l'exportation des idéaux",
      "description": "Examiner les causes profondes et les différentes phases de la Révolution française (1789-1799), de la convocation des États généraux au Directoire. Mettre en lumière la radicalisation du processus, l'émergence de nouveaux concepts politiques (nation, citoyenneté, souveraineté populaire) et son impact majeur sur l'Europe."
    },
    {
      "heading": "## L'Empire napoléonien et la reconfiguration de l'Europe",
      "description": "Analyser l'ascension de Napoléon Bonaparte, la mise en place de l'Empire et la diffusion des principes révolutionnaires (Code Civil, réformes administratives) à travers les conquêtes européennes. Discuter des résistances et des réactions suscitées, menant à la chute de l'Empire et au Congrès de Vienne."
    },
    {
      "heading": "## Les indépendances latino-américaines et l'héritage des révolutions",
      "description": "Étudier les processus d'indépendance en Amérique latine, en les reliant à la dynamique des révolutions atlantiques. Analyser les spécificités de ces mouvements, les figures emblématiques et les défis de la construction des nouvelles nations et des modèles politiques émergents dans la région."
    },
    {
      "heading": "## Conclusion : Bilan et héritages de l'ère des révolutions",
      "description": "Synthétiser les principales transformations politiques, sociales et territoriales engendrées par cette période. Discuter des héritages durables sur les concepts de nation, d'État, de souveraineté et de citoyenneté, et ouvrir sur les développements du XIXe siècle."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "University Year 1 / Bachelor 1st Year (L1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Analyse des causes, déroulements et conséquences des grandes révolutions atlantiques. Comparaison des modèles politiques émergents et de leurs impacts sur la souveraineté et la citoyenneté.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.