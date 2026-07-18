You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "option_financiere",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "options financières",
        "searchQuery": "Option financière",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_financière"
      }
    },
    {
      "id": "grecques",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Grecques (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Grecques_(finance)"
      }
    },
    {
      "id": "delta",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Delta (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Delta_(finance)"
      }
    },
    {
      "id": "couverture_delta",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "couverture Delta",
        "searchQuery": "Couverture delta",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Couverture_delta"
      }
    },
    {
      "id": "gamma",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Gamma (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Gamma_(finance)"
      }
    },
    {
      "id": "vega",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Vega (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Vega_(finance)"
      }
    },
    {
      "id": "volatilite_implicite",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "volatilité implicite",
        "searchQuery": "Volatilité implicite",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Volatilit%C3%A9_implicite"
      }
    },
    {
      "id": "at_the_money",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "à la monnaie",
        "searchQuery": "Option financière à la monnaie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_financière#Dans_la_monnaie,_hors_de_la_monnaie,_%C3%A0_la_monnaie"
      }
    },
    {
      "id": "theta",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Theta (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Theta_(finance)"
      }
    },
    {
      "id": "rho",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Rho (finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rho_(finance)"
      }
    },
    {
      "id": "couverture_delta",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "couverture Delta",
        "searchQuery": "Couverture delta",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Couverture_delta"
      }
    },
    {
      "id": "delta_neutre",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Delta-neutre finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Couverture_delta"
      }
    },
    {
      "id": "gamma_neutre",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Gamma-neutre finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Grecques_(finance)#Gamma"
      }
    },
    {
      "id": "vega_neutre",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Vega-neutre finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Grecques_(finance)#Vega"
      }
    },
    {
      "id": "jump_diffusion",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "risque de saut",
        "searchQuery": "Processus de saut finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Processus_de_saut"
      }
    },
    {
      "id": "finance_quantitative",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Finance Quantitative",
        "searchQuery": "Finance quantitative",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Finance_quantitative"
      }
    },
    {
      "id": "gestion_risques",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Gestion des risques finance",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Gestion_des_risques"
      }
    },
    {
      "id": "hull_john",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "John Hull",
        "searchQuery": "John C. Hull",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_C._Hull"
      }
    },
    {
      "id": "shreve_steven",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Steven Shreve",
        "searchQuery": "Steven Shreve",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Steven_Shreve"
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