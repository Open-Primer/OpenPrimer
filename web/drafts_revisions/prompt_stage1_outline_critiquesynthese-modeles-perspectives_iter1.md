You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction",
      "description": "Présenter l'objectif de cette leçon de synthèse : récapituler les connaissances acquises, évaluer les outils macroéconomiques et anticiper les défis futurs. Rappeler brièvement le parcours du cours et les thématiques abordées."
    },
    {
      "heading": "## Récapitulation des Modèles Macroéconomiques Clés",
      "description": "Passer en revue les principaux modèles étudiés durant le cours (ex: modèles IS-LM, AD-AS, de croissance néoclassique et endogène, RBC, DSGE). Pour chaque modèle, rappeler ses hypothèses fondamentales, ses mécanismes de fonctionnement et les phénomènes économiques qu'il cherche à expliquer."
    },
    {
      "heading": "## Analyse Comparative : Forces et Faiblesses des Modèles",
      "description": "Comparer les différents modèles en termes de leur capacité à expliquer les cycles économiques, la croissance à long terme, l'inflation et le chômage. Discuter de leurs limites, de leurs hypothèses simplificatrices et de leur pertinence pour l'analyse des politiques économiques contemporaines."
    },
    {
      "heading": "## Évolutions et Perspectives Futures de la Macroéconomie",
      "description": "Aborder les pistes de recherche actuelles et futures en macroéconomie. Discuter des évolutions des modèles (ex: intégration des agents hétérogènes, macroéconomie comportementale, macroéconomie climatique, rôle des données massives) et des défis posés par les crises récentes et les nouvelles problématiques mondiales."
    },
    {
      "heading": "## Conclusion Générale du Cours",
      "description": "Synthétiser les principaux enseignements du cours de 'Macroéconomie avancée et politique économique'. Souligner l'importance d'une approche critique et nuancée des modèles et des politiques. Ouvrir sur l'évolution constante de la discipline et l'importance de la recherche continue pour la compréhension des enjeux économiques."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Récapitulation des principaux modèles étudiés, leurs forces et faiblesses, et discussion des pistes de recherche futures, avec une conclusion générale du cours.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.