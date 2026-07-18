You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "mouvement_brownien",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Mouvement Brownien",
        "searchQuery": "Mouvement Brownien",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien",
        "year": "1827 (observation), 1905 (théorie d'Einstein), 1923 (théorie de Wiener)"
      }
    },
    {
      "id": "wiener_norbert",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Norbert Wiener",
        "searchQuery": "Norbert Wiener",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Norbert_Wiener",
        "year": "1894-1964"
      }
    },
    {
      "id": "volatilite",
      "componentType": "Glossary",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "searchQuery": "volatilité",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Volatilit%C3%A9_(finance)",
        "year": "XXe siècle (concept financier)"
      }
    },
    {
      "id": "ito_kiyosi",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Kiyosi Itô",
        "searchQuery": "Kiyosi Itô",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Kiyosi_It%C3%B4",
        "year": "1915-2008"
      }
    },
    {
      "id": "lipschitz_condition",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Condition de Lipschitz",
        "searchQuery": "Condition de Lipschitz",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Fonction_lipschitzienne",
        "year": "1897 (Rudolf Lipschitz)"
      }
    },
    {
      "id": "linear_growth",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Croissance Linéaire",
        "searchQuery": "Croissance Linéaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Fonction_affine",
        "year": "Antiquité (concepts mathématiques)"
      }
    },
    {
      "id": "ito_kiyosi",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Kiyosi Itô",
        "searchQuery": "Kiyosi Itô",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Kiyosi_It%C3%B4",
        "year": "1915-2008"
      }
    },
    {
      "id": "black_scholes",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Fischer Black et Myron Scholes",
        "searchQuery": "Fischer Black et Myron Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "year": "1973 (publication du modèle)"
      }
    },
    {
      "id": "ito_kiyosi",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "Kiyosi Itô",
        "searchQuery": "Kiyosi Itô",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Kiyosi_It%C3%B4",
        "year": "1915-2008"
      }
    },
    {
      "id": "eds_a_sauts",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "EDS à sauts",
        "searchQuery": "EDS à sauts",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Processus_de_sauts",
        "year": "Fin XXe siècle"
      }
    },
    {
      "id": "volatilite_stochastique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "name": "volatilité stochastique",
        "searchQuery": "volatilité stochastique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Volatilit%C3%A9_stochastique",
        "year": "Années 1980"
      }
    },
    {
      "id": "processus_de_levy",
      "componentType": "Glossary",
      "sectionAnchor": "Enrichment Hover Cards",
      "props": {
        "searchQuery": "processus de Lévy",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Processus_de_L%C3%A9vy",
        "year": "1934 (Paul Lévy)"
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