You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "finance_quantitative",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "finance quantitative",
        "searchQuery": "finance quantitative",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Finance_quantitative",
        "year": "N/A"
      }
    },
    {
      "id": "retour_moyenne",
      "componentType": "Glossary",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "searchQuery": "retour à la moyenne",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Retour_%C3%A0_la_moyenne",
        "year": "N/A"
      }
    },
    {
      "id": "taux_court",
      "componentType": "Glossary",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "searchQuery": "taux court",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Taux_d%27int%C3%A9r%C3%AAt_%C3%A0_court_terme",
        "year": "N/A"
      }
    },
    {
      "id": "courbe_taux",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "courbe des taux",
        "searchQuery": "courbe des taux",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Courbe_des_taux",
        "year": "N/A"
      }
    },
    {
      "id": "john_hull",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "John C. Hull",
        "searchQuery": "John C. Hull",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_C._Hull"
      }
    },
    {
      "id": "darrell_duffie",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "Darrell Duffie",
        "searchQuery": "Darrell Duffie",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Darrell_Duffie"
      }
    },
    {
      "id": "oldrich_vasicek",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "Oldřich Vašíček",
        "searchQuery": "Oldřich Vašíček",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Old%C5%99ich_Va%C5%A1%C3%AD%C4%8Dek"
      }
    },
    {
      "id": "john_cox",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "John C. Cox",
        "searchQuery": "John C. Cox",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_C._Cox"
      }
    },
    {
      "id": "alan_white",
      "componentType": "RealPerson",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "Alan White",
        "searchQuery": "Alan White (academic)",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Alan_White_(academic)"
      }
    },
    {
      "id": "no_arbitrage_model",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "name": "modèle sans arbitrage",
        "searchQuery": "absence d'opportunité d'arbitrage",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Absence_d%27opportunit%C3%A9_d%27arbitrage",
        "year": "N/A"
      }
    },
    {
      "id": "caps_floors",
      "componentType": "Glossary",
      "sectionAnchor": "Enrichment Hover Cards / Entity Links",
      "props": {
        "searchQuery": "Cap et floor",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Cap_et_floor"
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