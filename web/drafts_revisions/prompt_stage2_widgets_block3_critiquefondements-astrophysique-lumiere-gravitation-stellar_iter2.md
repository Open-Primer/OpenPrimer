You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
[
  "Au cours de cette leçon, nous avons exploré les piliers fondamentaux de l'astrophysique moderne, en commençant par la lumière, notre principal messager cosmique, et son rôle crucial dans la spectroscopie pour déchiffrer la composition et le mouvement des astres.",
  "Nous avons ensuite approfondi la gravitation, de la loi de Newton à la relativité générale d'Einstein, soulignant son influence prépondérante sur la formation des structures cosmiques.",
  "L'évolution stellaire a constitué un axe majeur, détaillant le cycle de vie des étoiles, de leur naissance dans les nébuleuses à leur fin spectaculaire en naines blanches, étoiles à neutrons ou trous noirs.",
  "Ces concepts interconnectés sont essentiels pour comprendre l'univers qui nous entoure et les phénomènes qui le régissent.",
  "Cette base solide nous prépare à des explorations plus complexes des galaxies et de la cosmologie, en nous fournissant les outils nécessaires pour interpréter les observations astronomiques."
]

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used.

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