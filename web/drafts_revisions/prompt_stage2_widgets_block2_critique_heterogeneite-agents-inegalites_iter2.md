You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "agent_representatif",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "agent représentatif",
        "searchQuery": "agent représentatif économie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Agent_repr%C3%A9sentatif"
      }
    },
    {
      "id": "thomas_piketty",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Thomas Piketty",
        "searchQuery": "Thomas Piketty",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Thomas_Piketty"
      }
    },
    {
      "id": "coefficient_gini",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "coefficient de Gini",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Coefficient_de_Gini"
      }
    },
    {
      "id": "courbe_lorenz",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "courbe de Lorenz",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Courbe_de_Lorenz"
      }
    },
    {
      "id": "marches_incomplets",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "marchés incomplets",
        "searchQuery": "marchés incomplets économie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/March%C3%A9_incomplet"
      }
    },
    {
      "id": "paul_samuelson",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Paul Samuelson",
        "searchQuery": "Paul Samuelson",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Paul_Samuelson"
      }
    },
    {
      "id": "pmc_elevee",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "propension marginale à consommer (PMC)",
        "searchQuery": "propension marginale à consommer",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Propension_%C3%A0_consommer"
      }
    },
    {
      "id": "multiplicateurs_budgetaires",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "multiplicateurs budgétaires",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Multiplicateur_budg%C3%A9taire"
      }
    },
    {
      "id": "heterogeneite_agents",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "hétérogénéité des agents",
        "searchQuery": "modèle à agents hétérogènes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_%C3%A0_agents_h%C3%A9t%C3%A9rog%C3%A8nes"
      }
    },
    {
      "id": "modeles_dsge",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "modèles DSGE",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_d%27%C3%A9quilibre_g%C3%A9n%C3%A9ral_stochastique_dynamique"
      }
    },
    {
      "id": "piketty_thomas",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Thomas Piketty",
        "searchQuery": "Thomas Piketty",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Thomas_Piketty"
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