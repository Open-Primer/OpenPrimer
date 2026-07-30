You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "cite_etat",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Cités-États",
        "text": "Cités-États",
        "title": "Cités-États"
      }
    },
    {
      "id": "homere",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Homère",
        "text": "Homère",
        "title": "Homère"
      }
    },
    {
      "id": "mythologie",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Mythologie",
        "text": "Mythologie",
        "title": "Mythologie"
      }
    },
    {
      "id": "pantheon_grec",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Panthéon grec",
        "text": "Panthéon grec",
        "title": "Panthéon grec"
      }
    },
    {
      "id": "olympe",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Olympe",
        "text": "Olympe",
        "title": "Olympe"
      }
    },
    {
      "id": "do_ut_des",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Do ut des",
        "text": "Do ut des",
        "title": "Do ut des"
      }
    },
    {
      "id": "pythie",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Pythie",
        "text": "Pythie",
        "title": "Pythie"
      }
    },
    {
      "id": "paideia",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Paideia",
        "text": "Paideia",
        "title": "Paideia"
      }
    },
    {
      "id": "symposium",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "symposia",
        "text": "symposia",
        "title": "symposia"
      }
    },
    {
      "id": "polytheisme",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "polythéisme",
        "text": "polythéisme",
        "title": "polythéisme"
      }
    },
    {
      "id": "hellenisme",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "hellénisme",
        "text": "hellénisme",
        "title": "hellénisme"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, "N/A", "## Section Name", or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. The "year", "dates", "url", or "wikipediaLink" properties can be "null" or omitted for components that do not require them or where the resource is unresolved/needs backend matching (such as RealPerson, HistoricalPerson, ConceptLink, Location, Glossary, Image, Audio, Video, EventLink, HistoricalEventLink, EvenementHistorique, and ÉvénementHistorique). Do NOT reject the block or treat "null" or omission as a placeholder or incomplete for these properties on non-applicable component types.
6. CRITICAL WIDGET CONNECTION: Every interactive component or hover card (Biography, RealPerson, HistoricalPerson, ConceptLink, Location, Glossary, EventLink) must be strongly connected to the lesson's topics, informative, and detailed.

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