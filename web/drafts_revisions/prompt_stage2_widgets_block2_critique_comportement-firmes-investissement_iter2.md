You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "croissance_economique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "croissance économique",
        "searchQuery": "Croissance économique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Croissance_%C3%A9conomique"
      }
    },
    {
      "id": "solow_robert",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Robert Solow",
        "searchQuery": "Robert Solow",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Robert_Solow"
      }
    },
    {
      "id": "concurrence_parfaite",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "concurrence parfaite",
        "searchQuery": "Concurrence parfaite",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Concurrence_parfaite"
      }
    },
    {
      "id": "cout_usage_capital",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Coût d'usage du capital",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Co%C3%BBt_d%27usage_du_capital"
      }
    },
    {
      "id": "couts_ajustement",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "coûts d'ajustement",
        "searchQuery": "Coûts d'ajustement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Co%C3%BBts_d%27ajustement"
      }
    },
    {
      "id": "convexite",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Convexité (mathématiques)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Fonction_convexe"
      }
    },
    {
      "id": "jorgenson_dale",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Dale Jorgenson",
        "searchQuery": "Dale Jorgenson",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Dale_Jorgenson"
      }
    },
    {
      "id": "tobin_james",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "James Tobin",
        "searchQuery": "James Tobin",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/James_Tobin"
      }
    },
    {
      "id": "q_de_tobin",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Q de Tobin",
        "searchQuery": "Q de Tobin",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Q_de_Tobin"
      }
    },
    {
      "id": "maximisation_profit",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "maximisation du profit",
        "searchQuery": "Maximisation du profit",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Maximisation_du_profit"
      }
    },
    {
      "id": "cycles_economiques",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Cycle économique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Cycle_%C3%A9conomique"
      }
    },
    {
      "id": "robert_lucas",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Robert Lucas",
        "searchQuery": "Robert Lucas Jr.",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Robert_Lucas_Jr."
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