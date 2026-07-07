You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La fin du XVIIIe et le début du XIXe siècle ont été marqués par des bouleversements politiques et sociaux sans précédent, initiés par la Révolution française.",
      "Cette période a vu l'effondrement de l'Ancien Régime et l'émergence de nouvelles idéologies politiques, telles que le libéralisme et le nationalisme, qui ont profondément transformé les sociétés européennes.",
      "Les guerres napoléoniennes ont exporté ces idées à travers le continent, redessinant les cartes et les mentalités, et défiant les structures monarchiques traditionnelles.",
      "Bien que le Congrès de Vienne ait tenté de restaurer un ordre conservateur, les graines des nations modernes et des systèmes politiques basés sur la souveraineté populaire étaient semées de manière irréversible.",
      "Ces transformations profondes ont jeté les bases du monde contemporain, influençant durablement les structures étatiques, les relations internationales et la conception même de la citoyenneté."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "La Restauration et les nouvelles vagues révolutionnaires (1815-1848)",
        "description": "Après les bouleversements de l'ère napoléonienne, l'Europe tente de retrouver un équilibre lors du Congrès de Vienne. Cependant, les aspirations nationales et libérales continuent de bouillonner, menant à de nouvelles révolutions et à la remise en question de l'ordre établi.",
        "slug": "restauration-revolutions-1815-1848"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "La Révolution française",
        "type": "book",
        "description": "Une étude classique et approfondie des causes, du déroulement et des conséquences de la Révolution française, par un historien majeur de la période.",
        "author": "Michel Vovelle",
        "year": "1992"
      },
      {
        "title": "Napoléon",
        "type": "book",
        "description": "Une biographie de référence de Napoléon Bonaparte, analysant son ascension, son règne et son impact sur l'Europe et le monde.",
        "author": "Jean Tulard",
        "year": "1987"
      },
      {
        "title": "Le Congrès de Vienne (1814-1815)",
        "type": "article",
        "description": "Un article synthétique présentant les enjeux, les acteurs et les décisions prises lors du Congrès de Vienne, qui a redessiné la carte de l'Europe après les guerres napoléoniennes.",
        "url": "https://www.universalis.fr/encyclopedie/congres-de-vienne/"
      },
      {
        "title": "L'Europe et la Révolution française",
        "type": "book",
        "description": "Une analyse des interactions entre la Révolution française et le reste de l'Europe, montrant comment les idées révolutionnaires se sont propagées et ont été reçues.",
        "author": "Albert Sorel",
        "year": "1885-1904"
      }
    ]
  },
  "glossary": [
    {
      "term": "Révolution française",
      "definition": "Période de bouleversements politiques et sociaux majeurs en France, de 1789 à 1799, qui a mis fin à la monarchie absolue et à la société d'ordres, et a jeté les bases de la République et des principes de liberté et d'égalité."
    },
    {
      "term": "Nationalisme",
      "definition": "Idéologie politique qui affirme l'existence d'une nation, c'est-à-dire d'un groupe humain partageant une identité culturelle, linguistique ou historique, et qui revendique son droit à l'autodétermination et à la souveraineté sur un territoire donné."
    },
    {
      "term": "Ancien Régime",
      "definition": "Terme utilisé pour désigner le système politique, social et économique de la France avant la Révolution de 1789, caractérisé par la monarchie absolue de droit divin, une société d'ordres (noblesse, clergé, tiers état) et des privilèges."
    },
    {
      "term": "Congrès de Vienne",
      "definition": "Conférence diplomatique qui s'est tenue à Vienne de septembre 1814 à juin 1815, réunissant les grandes puissances européennes (Autriche, Prusse, Russie, Royaume-Uni, France) pour redessiner la carte de l'Europe après la défaite de Napoléon et restaurer l'ordre monarchique et l'équilibre des puissances."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.

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