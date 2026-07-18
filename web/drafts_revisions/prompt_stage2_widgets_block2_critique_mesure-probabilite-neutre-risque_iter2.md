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
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Finance_quantitative"
      }
    },
    {
      "id": "arbitrage",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "arbitrage (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Arbitrage_(finance)"
      }
    },
    {
      "id": "black_scholes",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Fischer Black, Myron Scholes et Robert Merton",
        "searchQuery": "Myron Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Myron_Scholes"
      }
    },
    {
      "id": "theoreme_girsanov",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Théorème de Girsanov",
        "searchQuery": "Théorème de Girsanov",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9or%C3%A8me_de_Girsanov"
      }
    },
    {
      "id": "drift",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "drift processus stochastique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Processus_de_Wiener_g%C3%A9n%C3%A9ralis%C3%A9"
      }
    },
    {
      "id": "volatilite",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "volatilité (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Volatilit%C3%A9_(finance)"
      }
    },
    {
      "id": "girsanov",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Igor Girsanov",
        "searchQuery": "Igor Girsanov",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Igor_Girsanov"
      }
    },
    {
      "id": "mesure_neutre_risque",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "mesure neutre au risque",
        "searchQuery": "mesure neutre au risque",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mesure_neutre_au_risque"
      }
    },
    {
      "id": "martingale",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "martingales",
        "searchQuery": "martingale (probabilités)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Martingale_(probabilit%C3%A9s)"
      }
    },
    {
      "id": "valorisation_neutre_risque",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "valorisation neutre au risque",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mesure_neutre_au_risque"
      }
    },
    {
      "id": "heston",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Steven Heston",
        "searchQuery": "Steven Heston",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Steven_Heston"
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