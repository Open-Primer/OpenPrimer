You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "conclusionSummary": {
    "items": [
      "La fin du XVIIIe et le début du XIXe siècle ont été marqués par des bouleversements politiques et sociaux sans précédent, initiés par la Révolution française.",
      "Cette période a vu l'effondrement de l'Ancien Régime et l'émergence de nouvelles idéologies politiques, telles que la souveraineté nationale et le libéralisme.",
      "Les guerres napoléoniennes ont exporté ces idées révolutionnaires à travers l'Europe, tout en suscitant des résistances et en stimulant le sentiment national dans les territoires occupés.",
      "Ces conflits ont redessiné la carte de l'Europe et jeté les bases des États-nations modernes, transformant durablement les frontières et les identités politiques.",
      "En somme, cette ère a profondément transformé les structures politiques, sociales et culturelles du continent, laissant un héritage durable sur la conception de l'État et de la citoyenneté."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Le Congrès de Vienne et la Restauration",
        "description": "Après les bouleversements révolutionnaires et napoléoniens, l'Europe tente de retrouver un équilibre. Cette leçon explorera les tentatives de restauration monarchique et la réorganisation du continent lors du Congrès de Vienne, ainsi que les premières contestations de cet ordre et l'émergence de nouvelles vagues révolutionnaires.",
        "slug": "congres-vienne-restauration"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "La Révolution française",
        "type": "book",
        "description": "Une étude classique et approfondie des causes, du déroulement et des conséquences de la Révolution française, offrant une perspective historiographique riche.",
        "author": "Michel Vovelle",
        "year": "1992"
      },
      {
        "title": "Napoléon",
        "type": "book",
        "description": "Une biographie exhaustive de Napoléon Bonaparte, analysant son rôle dans la diffusion des idéaux révolutionnaires et la construction de l'Empire, ainsi que son impact sur l'Europe.",
        "author": "Jean Tulard",
        "year": "1987"
      },
      {
        "title": "L'invention de la nation moderne",
        "type": "article",
        "description": "Analyse de l'émergence du concept de nation et de nationalisme à l'époque des révolutions, explorant comment ces idées ont façonné les identités collectives.",
        "author": "Anne-Marie Thiesse",
        "year": "1999"
      },
      {
        "title": "Histoire de la Révolution française et de l'Empire",
        "type": "website",
        "description": "Un site de référence offrant des ressources variées (textes, images, chronologies, analyses) sur la Révolution française et la période napoléonienne, idéal pour approfondir les connaissances.",
        "url": "https://www.herodote.net/histoire/revolution-francaise"
      }
    ]
  },
  "glossary": [
    {
      "term": "Ancien Régime",
      "definition": "Système politique et social en vigueur en France du XVIe au XVIIIe siècle, caractérisé par une monarchie absolue de droit divin, une société d'ordres (clergé, noblesse, tiers état) et des privilèges héréditaires."
    },
    {
      "term": "Souveraineté nationale",
      "definition": "Principe politique selon lequel la souveraineté, c'est-à-dire le pouvoir suprême, appartient à la nation, entité collective et indivisible, et non au monarque. Elle est exercée par des représentants élus."
    },
    {
      "term": "Nationalisme",
      "definition": "Idéologie politique qui affirme l'existence et la primauté d'une nation, souvent basée sur une identité culturelle, linguistique ou historique commune, et qui vise à l'autonomie, à l'unité ou à la puissance de cette nation."
    },
    {
      "term": "Code civil (Code Napoléon)",
      "definition": "Recueil de lois civiles promulgué en 1804 sous Napoléon Bonaparte, qui unifie le droit français et consacre les principes fondamentaux de la Révolution tels que l'égalité devant la loi, la propriété privée et la laïcité de l'État."
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