You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
[
  "Le modèle des Cycles Économiques Réels (RBC) propose une explication des fluctuations macroéconomiques basée sur des chocs d'offre réels, principalement des chocs de productivité.",
  "Les agents économiques dans le modèle RBC sont rationnels et optimisent leur consommation et leur travail sur plusieurs périodes, en réponse aux chocs.",
  "Une caractéristique fondamentale du modèle RBC est l'hypothèse de marchés parfaitement concurrentiels et de flexibilité totale des prix et des salaires.",
  "Le calibrage est une méthode clé utilisée dans les modèles RBC pour paramétrer le modèle avec des données empiriques et simuler ses dynamiques.",
  "Bien que le modèle RBC ait contribué à une meilleure compréhension des mécanismes de propagation des chocs, il est souvent critiqué pour son incapacité à expliquer certaines rigidités observées dans l'économie réelle et le rôle de la politique monétaire.",
  "Les chocs stochastiques, en particulier les chocs technologiques, sont considérés comme la principale source des fluctuations économiques dans le cadre RBC."
]

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used. Note that for goingFurther items, omitting the "url" property entirely is perfectly acceptable if a real URL is not known; do not reject items for not having a "url" property, but reject them if they have a dummy/placeholder URL like "example.com" or "placeholder.com".

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'conclusionSummary', 'whatsNext', 'goingFurther', or 'glossary')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.