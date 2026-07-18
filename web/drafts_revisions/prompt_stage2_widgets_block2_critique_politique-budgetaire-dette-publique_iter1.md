You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "politique_budgetaire",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "politique budgétaire",
        "searchQuery": "politique budgétaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Politique_budg%C3%A9taire"
      }
    },
    {
      "id": "blanchard",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Olivier Blanchard",
        "searchQuery": "Olivier Blanchard",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Olivier_Blanchard"
      }
    },
    {
      "id": "dette_publique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "dette publique",
        "searchQuery": "dette publique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Dette_publique"
      }
    },
    {
      "id": "seigniorage",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "seigneuriage",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Seigneuriage"
      }
    },
    {
      "id": "deficit_budgetaire",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "déficit budgétaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/D%C3%A9ficit_budg%C3%A9taire"
      }
    },
    {
      "id": "distorsion_fiscale",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "distorsions fiscales",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Distorsion_fiscale"
      }
    },
    {
      "id": "effet_eviction",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "effet d'éviction",
        "searchQuery": "effet d'éviction",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_d%27%C3%A9viction"
      }
    },
    {
      "id": "ricardo_david",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "David Ricardo",
        "searchQuery": "David Ricardo",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/David_Ricardo"
      }
    },
    {
      "id": "barro_robert",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Robert Barro",
        "searchQuery": "Robert Barro",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Robert_Barro"
      }
    },
    {
      "id": "soutenabilite_budgetaire",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "soutenabilité budgétaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Soutenabilit%C3%A9_budg%C3%A9taire"
      }
    },
    {
      "id": "solde_primaire",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "solde primaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Solde_primaire"
      }
    },
    {
      "id": "consolidation_budgetaire",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "consolidation budgétaire",
        "searchQuery": "consolidation budgétaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Consolidation_budg%C3%A9taire"
      }
    },
    {
      "id": "soutenabilite_dette",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "soutenabilité de la dette",
        "searchQuery": "soutenabilité de la dette",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Soutenabilit%C3%A9_de_la_dette"
      }
    },
    {
      "id": "dominance_fiscale",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "dominance fiscale",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Dominance_fiscale"
      }
    },
    {
      "id": "blanchard_olivier",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Olivier Blanchard",
        "searchQuery": "Olivier Blanchard",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Olivier_Blanchard"
      }
    },
    {
      "id": "mmt",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "Théorie Monétaire Moderne",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_mon%C3%A9taire_moderne"
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