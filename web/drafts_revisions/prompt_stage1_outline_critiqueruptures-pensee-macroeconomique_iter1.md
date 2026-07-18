You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
{
  "sections": [
    {
      "heading": "## Introduction : Comprendre les dynamiques de la pensée macroéconomique",
      "description": "Présenter l'objectif du cours, définir ce qu'est une 'rupture' en macroéconomie et pourquoi il est crucial d'étudier ces évolutions pour comprendre les débats actuels. Établir le cadre historique et intellectuel de la macroéconomie contemporaine."
    },
    {
      "heading": "## De la Révolution Keynésienne aux Premières Critiques Monétaristes",
      "description": "Expliquer le paradigme classique et ses limites face à la Grande Dépression. Détailler l'apport de Keynes (demande effective, rôle de l'État) et le modèle IS-LM. Présenter ensuite la montée du monétarisme (Friedman, rôle de la monnaie, critique de la courbe de Phillips) comme première rupture majeure du consensus keynésien."
    },
    {
      "heading": "## L'Ère des Anticipations Rationnelles : Nouvelle Macroéconomie Classique et Néo-Keynésianisme",
      "description": "Aborder l'introduction des anticipations rationnelles (Lucas, Sargent) et ses implications pour l'efficacité des politiques économiques (proposition d'inefficacité des politiques). Présenter la théorie des cycles réels (RBC). Expliquer ensuite la réponse néo-keynésienne, cherchant à microfonder les rigidités nominales et réelles pour justifier l'intervention publique."
    },
    {
      "heading": "## Au-delà du Consensus : Crises Financières, Critiques et Nouvelles Perspectives",
      "description": "Analyser les limites des modèles dominants (DSGE) révélées par la crise financière de 2008. Présenter les critiques (e.g., rôle de la finance, hétérogénéité des agents, économie comportementale). Explorer les nouvelles pistes de recherche et les approches hétérodoxes qui émergent en réponse aux défis contemporains."
    },
    {
      "heading": "## Conclusion : Enjeux Actuels et Avenir de la Macroéconomie",
      "description": "Synthétiser les grandes ruptures étudiées et leurs contributions à la compréhension des phénomènes économiques. Discuter des défis méthodologiques et empiriques actuels. Ouvrir sur les perspectives d'évolution de la discipline face aux enjeux globaux (changement climatique, inégalités, etc.)."
    }
  ]
}

Ensure:
1. The progression is pedagogically sound for the level "Master 1st Year (M1)".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "Présentation des paradigmes successifs et des limites des modèles passés, contextualisation des enjeux actuels.".

Return ONLY a valid JSON object matching the outlineAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
```
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.