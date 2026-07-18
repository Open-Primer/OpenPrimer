You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction aux Cycles Économiques Réels et Chocs Stochastiques",
      "description": "Présenter le concept des cycles économiques réels (RBC) comme une approche majeure pour comprendre les fluctuations macroéconomiques. Définir les chocs stochastiques comme moteurs de ces cycles et situer l'importance de leur étude dans l'analyse macroéconomique moderne. Énoncer les objectifs du cours."
    },
    {
      "heading": "## Les Fondements Théoriques des Modèles de Cycles Économiques Réels (RBC)",
      "description": "Expliquer les hypothèses clés des modèles RBC (agents rationnels, marchés concurrentiels, chocs de productivité). Décrire le mécanisme de propagation des chocs et le rôle de l'offre agrégée. Présenter un modèle RBC simple (par exemple, un modèle de base avec chocs technologiques) et ses implications."
    },
    {
      "heading": "## Identification et Décomposition des Fluctuations Macroéconomiques",
      "description": "Aborder les méthodes statistiques et économétriques utilisées pour identifier les sources de fluctuations et décomposer les séries temporelles macroéconomiques. Inclure des techniques comme le filtre de Hodrick-Prescott, le filtre de Baxter-King, et l'analyse spectrale pour séparer la tendance, le cycle et le bruit."
    },
    {
      "heading": "## Chocs Stochastiques et Analyse de Réponse Impulsionnelle",
      "description": "Détailler les différents types de chocs stochastiques (technologiques, préférences, fiscaux, etc.) et leur impact potentiel sur l'économie. Expliquer la méthodologie de l'analyse de réponse impulsionnelle (ARI) pour quantifier et visualiser la réaction des variables macroéconomiques à un choc exogène, en utilisant des modèles VAR ou DSGE."
    },
    {
      "heading": "## Critiques et Extensions des Modèles de Cycles Économiques Réels",
      "description": "Discuter les principales critiques adressées aux modèles RBC, notamment concernant la nature des chocs de productivité, l'absence de rôle pour la politique monétaire et fiscale, et la volatilité des variables. Présenter brièvement des extensions ou des modèles alternatifs qui tentent de pallier ces lacunes (par exemple, les modèles DSGE avec rigidités nominales)."
    },
    {
      "heading": "## Conclusion et Perspectives",
      "description": "Récapituler les concepts clés abordés dans le cours : la théorie RBC, l'identification des fluctuations, l'impact des chocs stochastiques et l'analyse de réponse impulsionnelle. Ouvrir sur les limites des modèles et les directions de recherche futures dans l'étude des cycles économiques."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Identification des sources de fluctuations, décomposition des séries temporelles, réponse impulsionnelle.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.