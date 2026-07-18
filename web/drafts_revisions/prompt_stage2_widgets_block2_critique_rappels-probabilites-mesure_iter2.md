You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "finance_quantitative",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "finance quantitative",
        "searchQuery": "finance quantitative",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Finance_quantitative",
        "year": "2023"
      }
    },
    {
      "id": "processus_stochastique",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "processus stochastique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Processus_stochastique",
        "year": "2023"
      }
    },
    {
      "id": "shreve",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Steven E. Shreve",
        "searchQuery": "Steven E. Shreve",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Steven_Shreve",
        "year": "2023"
      }
    },
    {
      "id": "bjork",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Tomas Björk",
        "searchQuery": "Tomas Björk",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Tomas_Bj%C3%B6rk",
        "year": "2023"
      }
    },
    {
      "id": "sigma_algebre",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "σ-algèbre",
        "searchQuery": "σ-algèbre",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%CE%A3-alg%C3%A8bre",
        "year": "2023"
      }
    },
    {
      "id": "mesure_probabilite",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "mesure de probabilité",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mesure_de_probabilit%C3%A9",
        "year": "2023"
      }
    },
    {
      "id": "variable_aleatoire",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "variable aléatoire",
        "searchQuery": "variable aléatoire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Variable_al%C3%A9atoire",
        "year": "2023"
      }
    },
    {
      "id": "fonction_mesurable",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "fonction mesurable",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Fonction_mesurable",
        "year": "2023"
      }
    },
    {
      "id": "esperance_conditionnelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "espérance conditionnelle",
        "searchQuery": "espérance conditionnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Esp%C3%A9rance_conditionnelle",
        "year": "2023"
      }
    },
    {
      "id": "kolmogorov",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Andreï Kolmogorov",
        "searchQuery": "Andreï Kolmogorov",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Andre%C3%AF_Kolmogorov",
        "year": "2023"
      }
    },
    {
      "id": "espace_mesurable",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "espaces mesurables",
        "searchQuery": "espace mesurable",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Espace_mesurable",
        "year": "2023"
      }
    },
    {
      "id": "tribu",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "tribu (mathématiques)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Tribu_(math%C3%A9matiques)",
        "year": "2023"
      }
    },
    {
      "id": "martingale",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "martingales",
        "searchQuery": "martingale (théorie des probabilités)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Martingale_(th%C3%A9orie_des_probabilit%C3%A9s)",
        "year": "2023"
      }
    },
    {
      "id": "integrale_stochastique",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "intégrale stochastique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Int%C3%A9grale_stochastique",
        "year": "2023"
      }
    },
    {
      "id": "ito",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Kiyosi Itô",
        "searchQuery": "Kiyosi Itô",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Kiyosi_It%C3%B4",
        "year": "2023"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. The "year", "dates", "url", or "wikipediaLink" properties can be "null" or omitted for components that do not require them or where the resource is unresolved/needs backend matching (such as ConceptLink, Location, Glossary, Image, Audio, and Video). Do NOT reject the block or treat "null" or omission as a placeholder or incomplete for these properties on non-applicable component types.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.