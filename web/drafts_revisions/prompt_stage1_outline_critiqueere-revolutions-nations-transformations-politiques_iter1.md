You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Contexte et enjeux de l'ère des révolutions",
      "description": "Présenter le cadre chronologique (fin XVIIIe - début XIXe siècle) et géographique (espace atlantique). Définir les concepts clés de 'révolution', 'nation', 'souveraineté' et 'citoyenneté'. Exposer la problématique générale du cours : comment les révolutions atlantiques ont-elles transformé les sociétés et les systèmes politiques, donnant naissance à de nouvelles nations et redéfinissant les rapports de pouvoir ?"
    },
    {
      "heading": "## Les racines des bouleversements : Idées, crises et contestations",
      "description": "Analyser les causes profondes des révolutions : l'héritage des Lumières et la diffusion des idées nouvelles (liberté, égalité, droits naturels), les crises économiques et sociales (famines, inégalités), les tensions politiques et fiscales dans les empires coloniaux et les monarchies européennes. Mettre en évidence les prémices des contestations."
    },
    {
      "heading": "## La Révolution américaine : Un modèle républicain et ses limites",
      "description": "Décrire les causes et le déroulement de la Révolution américaine (guerre d'indépendance, Déclaration d'indépendance, Constitution). Analyser la naissance des États-Unis comme première république moderne. Discuter des limites de ce modèle (esclavage, droits des Amérindiens) et de son influence sur les autres mouvements révolutionnaires."
    },
    {
      "heading": "## La Révolution française et l'onde de choc napoléonienne",
      "description": "Expliquer les phases clés de la Révolution française (1789-1799) : de la monarchie constitutionnelle à la Terreur et au Directoire. Analyser la radicalisation politique et sociale, l'abolition des privilèges, la Déclaration des Droits de l'Homme et du Citoyen. Étudier l'expansion des idées révolutionnaires en Europe sous le Consulat et l'Empire napoléonien, et les résistances qu'elles ont suscitées."
    },
    {
      "heading": "## L'émergence des nations et les autres révolutions atlantiques",
      "description": "Aborder la Révolution haïtienne comme cas unique d'indépendance et d'abolition de l'esclavage. Examiner les mouvements d'indépendance en Amérique latine. Comparer les processus de construction nationale et les formes de souveraineté émergentes dans ces différentes régions, en soulignant les spécificités et les interconnexions."
    },
    {
      "heading": "## Conclusion : Héritages et portée des révolutions atlantiques",
      "description": "Synthétiser les apports majeurs de cette période : la fin de l'Ancien Régime, l'affirmation des principes de souveraineté nationale et de citoyenneté, la naissance de nouvelles entités étatiques. Discuter des héritages contradictoires (libertés vs. violences, universalisme vs. exclusions) et de l'impact à long terme de ces révolutions sur l'histoire politique mondiale."
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