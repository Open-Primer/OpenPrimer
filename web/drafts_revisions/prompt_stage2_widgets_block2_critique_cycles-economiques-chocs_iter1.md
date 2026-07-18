You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "cycles_economiques",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "cycles économiques",
        "searchQuery": "cycles économiques",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Cycle_%C3%A9conomique"
      }
    },
    {
      "id": "cycles_economiques_reels",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "Cycles Économiques Réels (RBC)",
        "searchQuery": "Cycles Économiques Réels",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_cycles_%C3%A9conomiques_r%C3%A9els"
      }
    },
    {
      "id": "kydland_prescott",
      "componentType": "RealPerson",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "Finn Kydland et Edward Prescott",
        "searchQuery": "Finn Kydland et Edward Prescott",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Finn_Kydland"
      }
    },
    {
      "id": "chocs_stochastiques",
      "componentType": "Glossary",
      "sectionAnchor": "Lesson Content",
      "props": {
        "searchQuery": "chocs stochastiques",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Choc_stochastique"
      }
    },
    {
      "id": "agents_rationnels",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "agents rationnels",
        "searchQuery": "agents rationnels économie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Agent_%C3%A9conomique"
      }
    },
    {
      "id": "productivite_marginale",
      "componentType": "Glossary",
      "sectionAnchor": "Lesson Content",
      "props": {
        "searchQuery": "productivité marginale",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Productivit%C3%A9_marginale"
      }
    },
    {
      "id": "substitution_intertemporelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "substitution intertemporelle",
        "searchQuery": "substitution intertemporelle économie",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Intertemporal_choice"
      }
    },
    {
      "id": "filtre_hodrick_prescott",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "filtre de Hodrick-Prescott",
        "searchQuery": "filtre de Hodrick-Prescott",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Filtre_de_Hodrick-Prescott"
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